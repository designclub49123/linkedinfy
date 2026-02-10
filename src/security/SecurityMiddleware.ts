// Security Middleware for PaperMorph 6.0
// Request/response security middleware and authentication

import SecurityService from './SecurityService';

export interface SecurityContext {
  userId?: string;
  isAuthenticated: boolean;
  permissions: string[];
  roles: string[];
  ip: string;
  userAgent: string;
  sessionId: string;
  lastActivity: Date;
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  condition: (context: SecurityContext) => boolean;
  action: 'allow' | 'deny' | 'log' | 'challenge';
  message?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private securityService: SecurityService;
  private rules: SecurityRule[] = [];
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();
  private sessions: Map<string, SecurityContext> = new Map();

  private constructor() {
    this.securityService = SecurityService.getInstance();
    this.initializeDefaultRules();
  }

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'auth_required',
        name: 'Authentication Required',
        description: 'Requires authentication for protected routes',
        enabled: true,
        priority: 1,
        condition: (context) => {
          const protectedRoutes = ['/app', '/admin', '/settings', '/billing'];
          return protectedRoutes.some(route => context.userAgent.includes(route));
        },
        action: 'deny',
        message: 'Authentication required'
      },
      {
        id: 'admin_required',
        name: 'Admin Access Required',
        description: 'Requires admin role for admin routes',
        enabled: true,
        priority: 2,
        condition: (context) => {
          return context.userAgent.includes('/admin') && !context.roles.includes('admin');
        },
        action: 'deny',
        message: 'Admin access required'
      },
      {
        id: 'rate_limit',
        name: 'Rate Limiting',
        description: 'Limits requests per IP address',
        enabled: true,
        priority: 3,
        condition: (context) => {
          return this.isRateLimited(context.ip);
        },
        action: 'deny',
        message: 'Rate limit exceeded'
      },
      {
        id: 'session_valid',
        name: 'Valid Session Required',
        description: 'Requires valid session for authenticated routes',
        enabled: true,
        priority: 4,
        condition: (context) => {
          if (!context.isAuthenticated) return false;
          return !this.isSessionValid(context.sessionId);
        },
        action: 'deny',
        message: 'Session expired'
      }
    ];
  }

  // Request Processing
  async processRequest(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    ip: string;
    body?: any;
  }): Promise<{
    allowed: boolean;
    context: SecurityContext;
    reason?: string;
    statusCode?: number;
  }> {
    const context = this.createSecurityContext(request);
    
    // Update session activity
    if (context.sessionId) {
      this.updateSessionActivity(context.sessionId);
    }

    // Apply security rules - collect log promises, don't await in loop
    const sortedRules = this.rules.sort((a, b) => a.priority - b.priority);
    const logPromises: Promise<void>[] = [];

    for (const rule of sortedRules) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(context)) {
          logPromises.push(this.logSecurityEvent(rule, context));
          
          if (rule.action === 'deny') {
            // Fire-and-forget log promises
            Promise.all(logPromises).catch(console.error);
            return {
              allowed: false,
              context,
              reason: rule.message || 'Access denied',
              statusCode: 403
            };
          } else if (rule.action === 'challenge') {
            Promise.all(logPromises).catch(console.error);
            return {
              allowed: false,
              context,
              reason: rule.message || 'Additional authentication required',
              statusCode: 401
            };
          }
        }
      } catch (error) {
        console.error(`Security rule ${rule.id} failed:`, error);
      }
    }

    // Flush any pending log promises
    Promise.all(logPromises).catch(console.error);

    return {
      allowed: true,
      context
    };
  }

  private createSecurityContext(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    ip: string;
    body?: any;
  }): SecurityContext {
    const sessionId = this.extractSessionId(request.headers);
    const existingSession = this.sessions.get(sessionId);

    return {
      userId: existingSession?.userId,
      isAuthenticated: existingSession?.isAuthenticated || false,
      permissions: existingSession?.permissions || [],
      roles: existingSession?.roles || [],
      ip: request.ip,
      userAgent: request.headers['user-agent'] || '',
      sessionId,
      lastActivity: new Date()
    };
  }

  private extractSessionId(headers: Record<string, string>): string {
    return headers['authorization']?.replace('Bearer ', '') || 
           headers['x-session-id'] || 
           'anonymous';
  }

  // Session Management
  createSession(context: Omit<SecurityContext, 'sessionId' | 'lastActivity'>): string {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullContext: SecurityContext = {
      ...context,
      sessionId,
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, fullContext);
    return sessionId;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  updateSession(sessionId: string, updates: Partial<SecurityContext>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.set(sessionId, { ...session, ...updates, lastActivity: new Date() });
    }
  }

  private updateSessionActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  private isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const policy = this.securityService.getPolicy('default');
    if (!policy) return true;

    const now = new Date();
    const sessionAge = now.getTime() - session.lastActivity.getTime();
    return sessionAge < policy.settings.sessionTimeout;
  }

  // Rate Limiting
  isRateLimited(ip: string, config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }): boolean {
    const now = Date.now();
    const limit = this.rateLimits.get(ip);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return false;
    }

    if (limit.count >= config.maxRequests) {
      return true;
    }

    limit.count++;
    return false;
  }

  // Rule Management
  addRule(rule: SecurityRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  updateRule(ruleId: string, updates: Partial<SecurityRule>): void {
    const ruleIndex = this.rules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  getRules(): SecurityRule[] {
    return [...this.rules];
  }

  // Authentication Helpers
  async authenticate(credentials: {
    email: string;
    password: string;
    ip: string;
    userAgent: string;
  }): Promise<{
    success: boolean;
    userId?: string;
    roles?: string[];
    permissions?: string[];
    sessionId?: string;
    error?: string;
  }> {
    try {
      // Check rate limiting
      if (this.isRateLimited(credentials.ip)) {
        return {
          success: false,
          error: 'Too many login attempts'
        };
      }

      // Validate credentials (mock implementation)
      const isValid = await this.validateCredentials(credentials.email, credentials.password);
      
      if (isValid) {
        const userContext = await this.getUserContext(credentials.email);
        const sessionId = this.createSession({
          userId: userContext.userId,
          isAuthenticated: true,
          permissions: userContext.permissions,
          roles: userContext.roles,
          ip: credentials.ip,
          userAgent: credentials.userAgent
        });

        await this.securityService.logEvent({
          type: 'login',
          userId: userContext.userId,
          ip: credentials.ip,
          userAgent: credentials.userAgent,
          details: { email: credentials.email },
          severity: 'low'
        });

        return {
          success: true,
          userId: userContext.userId,
          roles: userContext.roles,
          permissions: userContext.permissions,
          sessionId
        };
      }
      
      await this.securityService.logEvent({
        type: 'login',
        userId: '',
        ip: credentials.ip,
        userAgent: credentials.userAgent,
        details: { email: credentials.email, reason: 'invalid_credentials' },
        severity: 'medium'
      });

      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  private async validateCredentials(email: string, password: string): Promise<boolean> {
    // Mock validation - in real implementation, check against database
    return email === 'user@example.com' && password === 'password123';
  }

  private async getUserContext(email: string): Promise<{
    userId: string;
    roles: string[];
    permissions: string[];
  }> {
    // Mock user context - in real implementation, fetch from database
    return {
      userId: 'user_123',
      roles: ['user'],
      permissions: ['read', 'write']
    };
  }

  // Authorization Helpers
  hasPermission(context: SecurityContext, permission: string): boolean {
    return context.permissions.includes(permission) || context.roles.includes('admin');
  }

  hasRole(context: SecurityContext, role: string): boolean {
    return context.roles.includes(role);
  }

  // Security Event Logging
  private async logSecurityEvent(rule: SecurityRule, context: SecurityContext): Promise<void> {
    await this.securityService.logEvent({
      type: 'suspicious_activity',
      userId: context.userId || 'anonymous',
      ip: context.ip,
      userAgent: context.userAgent,
      details: {
        rule: rule.id,
        ruleName: rule.name,
        action: rule.action
      },
      severity: rule.action === 'deny' ? 'medium' : 'low'
    });
  }

  // Security Headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
  }

  // CSRF Protection
  generateCSRFToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  // Input Validation
  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    return this.securityService.validatePassword(password);
  }

  // Security Analytics
  getSecurityMetrics(): {
    activeSessions: number;
    blockedRequests: number;
    rateLimitedIPs: number;
    activeRules: number;
  } {
    return {
      activeSessions: this.sessions.size,
      blockedRequests: this.rateLimits.size,
      rateLimitedIPs: Array.from(this.rateLimits.values()).filter(limit => limit.count > 100).length,
      activeRules: this.rules.filter(rule => rule.enabled).length
    };
  }

  // Cleanup
  async cleanup(): Promise<void> {
    const now = Date.now();
    
    // Clean up expired sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - session.lastActivity.getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) { // 24 hours
        this.sessions.delete(sessionId);
      }
    }

    // Clean up expired rate limits
    for (const [ip, limit] of this.rateLimits.entries()) {
      if (now > limit.resetTime) {
        this.rateLimits.delete(ip);
      }
    }
  }
}

export default SecurityMiddleware;
