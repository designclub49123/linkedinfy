import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  PenTool,
  CheckCircle,
  Languages,
  FileText,
  Brain,
  Zap,
  MessageSquare,
  Image,
  TrendingUp,
  BarChart3,
  Mic,
  Video,
  Headphones,
  Globe,
  BookOpen,
  Lightbulb,
  Target,
  Rocket,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const AI_TOOLS = [
  {
    category: 'Writing',
    items: [
      {
        id: 'writing-assistant',
        label: 'Writing Assistant',
        description: 'AI-powered writing help',
        icon: PenTool,
        route: '/ai/writing-assistant',
        badge: 'Popular',
        live: true,
      },
      {
        id: 'grammar-check',
        label: 'Grammar Check',
        description: 'Advanced grammar correction',
        icon: CheckCircle,
        route: '/ai/grammar-check',
        badge: null,
        live: true,
      },
      {
        id: 'translation',
        label: 'Translation',
        description: 'Multi-language translation',
        icon: Languages,
        route: '/ai/translation',
        badge: 'New',
        live: true,
      },
      {
        id: 'summarization',
        label: 'Text Summarization',
        description: 'Condense long texts',
        icon: FileText,
        route: '/ai/summarization',
        badge: null,
        live: true,
      },
    ],
  },
  {
    category: 'Analysis',
    items: [
      {
        id: 'content-generator',
        label: 'Content Generator',
        description: 'Generate new content',
        icon: Sparkles,
        route: '/ai/content-generator',
        badge: 'Popular',
        live: true,
      },
      {
        id: 'summarization',
        label: 'Summarization',
        description: 'Condense long texts',
        icon: BarChart3,
        route: '/ai/summarization',
        badge: null,
        live: true,
      },
    ],
  },
  {
    category: 'Communication',
    items: [
      {
        id: 'chat-assistant',
        label: 'Chat Assistant',
        description: 'AI conversation partner',
        icon: MessageSquare,
        route: '/ai/chat',
        badge: 'Live',
        live: true,
      },
    ],
  },
];

export function AIToolsDropdown() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const [isOpening, setIsOpening] = useState(false);

  const handleToolClick = (route: string, isLive: boolean) => {
    if (isLive) {
      navigate(route);
    } else {
      // Show toast for non-live tools
      console.log('This tool is coming soon!');
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpening}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
          'gap-2 h-8 px-2.5 transition-all duration-200 group relative',
            'hover:bg-accent text-foreground'
          )}
        >
          <Sparkles className={cn(
            'h-3 w-3 transition-transform duration-200',
            isOpening ? 'rotate-180' : 'group-hover:animate-pulse'
          )} />
          <span className="hidden lg:block text-sm font-medium">AI Tools</span>
          {isOpening && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <div className="px-2 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium text-sm">AI Tools Suite</div>
              <div className="text-xs text-muted-foreground">Powered by advanced AI</div>
            </div>
          </div>
        </div>

        {AI_TOOLS.map((category) => (
          <div key={category.category}>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 py-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {category.category === 'Writing' && <PenTool className="h-4 w-4 text-primary" />}
                    {category.category === 'Analysis' && <Brain className="h-4 w-4 text-primary" />}
                    {category.category === 'Content' && <Sparkles className="h-4 w-4 text-primary" />}
                    {category.category === 'Communication' && <MessageSquare className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{category.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.items.filter(item => item.live).length} of {category.items.length} available
                    </div>
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                {category.items.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem
                      key={tool.id}
                      onClick={() => handleToolClick(tool.route, tool.live)}
                      className={cn(
                        'gap-3 py-2 px-3 cursor-pointer transition-colors',
                        !tool.live && 'opacity-60 cursor-not-allowed',
                        tool.live && 'hover:bg-primary/5'
                      )}
                    >
                      <div className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        tool.live ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <Icon className={cn(
                          'h-4 w-4',
                          tool.live ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{tool.label}</span>
                          {tool.badge && (
                            <Badge variant={tool.badge === 'Live' ? 'default' : 'secondary'} className="text-xs">
                              {tool.badge}
                            </Badge>
                          )}
                          {tool.live && (
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{tool.description}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {category.category !== AI_TOOLS[AI_TOOLS.length - 1].category && (
              <DropdownMenuSeparator />
            )}
          </div>
        ))}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigate('/ai/all-tools')}
          className="gap-3 py-2 px-3 cursor-pointer hover:bg-primary/5"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Rocket className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">All AI Tools</div>
            <div className="text-xs text-muted-foreground">Browse complete tool collection</div>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
