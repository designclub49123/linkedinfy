import { supabase } from '@/integrations/supabase/client';

export type AIAction = 'chat' | 'rewrite' | 'summarize' | 'grammar' | 'translate' | 'expand' | 'complete';

interface AIRequest {
  action: AIAction;
  content: string;
  context?: string;
  targetLanguage?: string;
  tone?: string;
  style?: string;
}

interface AIResponse {
  result: string;
  tokensUsed: number;
  action: AIAction;
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const { data, error } = await supabase.functions.invoke('ai-assistant', {
    body: request
  });

  if (error) {
    console.error('AI call error:', error);
    throw new Error(error.message || 'Failed to call AI service');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AIResponse;
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  const response = await callAI({
    action: 'chat',
    content: message,
    context
  });
  return response.result;
}

export async function rewriteText(text: string, tone?: string, style?: string): Promise<string> {
  const response = await callAI({
    action: 'rewrite',
    content: text,
    tone,
    style
  });
  return response.result;
}

export async function summarizeText(text: string): Promise<string> {
  const response = await callAI({
    action: 'summarize',
    content: text
  });
  return response.result;
}

export async function checkGrammar(text: string): Promise<string> {
  const response = await callAI({
    action: 'grammar',
    content: text
  });
  return response.result;
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const response = await callAI({
    action: 'translate',
    content: text,
    targetLanguage
  });
  return response.result;
}

export async function expandText(text: string): Promise<string> {
  const response = await callAI({
    action: 'expand',
    content: text
  });
  return response.result;
}

export async function completeText(text: string): Promise<string> {
  const response = await callAI({
    action: 'complete',
    content: text
  });
  return response.result;
}
