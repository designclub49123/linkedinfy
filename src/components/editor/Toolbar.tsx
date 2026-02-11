import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  MessageCircle,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Minus,
  Link,
  Image,
  Code,
  Quote,
  ChevronDown,
  Table,
  Plus,
  Trash2,
  Type,
  Palette,
  Sparkles,
  Settings2,
  MoreHorizontal,
  Move,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useSidebarStore } from '@/state/useSidebarStore';

interface ToolbarProps {
  onAction: (action: string, value?: string) => void;
  activeFormats: string[];
  selectedFont: string;
  selectedFontSize: string;
}

// Organized font categories
const fontCategories = {
  'Sans-serif': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Ubuntu', 'Raleway', 'Oswald', 'Source Sans Pro', 'Nunito', 'Rubik'],
  'Serif': ['Playfair Display', 'Merriweather', 'Slabo 27px'],
  'Display': ['Bebas Neue', 'Dancing Script', 'Pacifico', 'Caveat', 'Kalam', 'Permanent Marker', 'Shadows Into Light', 'Architects Daughter', 'Indie Flower'],
  'Monospace': ['Courier Prime', 'Space Mono', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono', 'Source Code Pro', 'Anonymous Pro', 'Inconsolata'],
  'Special': ['Libre Barcode 39 Text', 'Press Start 2P', 'VT323', 'Major Mono Display'],
  'System': ['Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Consolas']
};

// Flatten for backward compatibility
const fonts = Object.values(fontCategories).flat();
const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
const headingSizes = [
  { label: 'Heading 1', value: 'h1', preview: 'H1' },
  { label: 'Heading 2', value: 'h2', preview: 'H2' },
  { label: 'Heading 3', value: 'h3', preview: 'H3' },
];

const Toolbar: React.FC<ToolbarProps> = ({ onAction, activeFormats, selectedFont, selectedFontSize }) => {
  const { leftCollapsed, rightCollapsed } = useSidebarStore();
  const isActive = (format: string) => activeFormats.includes(format);
  
  // Determine if we should use compact layout (when any sidebar is open)
  const isCompactLayout = !leftCollapsed || !rightCollapsed;

  return (
    <div className="flex flex-col backdrop-blur supports-[backdrop-filter]: transition-colors border-b shadow-sm bg-background">
      {/* Primary Toolbar Row */}
      <div className={`flex items-center gap-1 px-4 py-2 transition-all duration-300 min-h-[44px] ${
        isCompactLayout ? 'flex-wrap gap-1 [&>*]:mb-[5px]' : 'flex-nowrap gap-1'
      }`}>
        {/* File Operations Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('undo')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('redo')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Typography Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          {/* Font Family */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 px-3 min-w-0 justify-between transition-colors border-border bg-background text-foreground hover:bg-accent ${
                  isCompactLayout ? 'max-w-24' : 'max-w-32'
                }`}
              >
                <span className="truncate text-sm">{selectedFont}</span>
                <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
              {Object.entries(fontCategories).map(([category, categoryFonts]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {categoryFonts.map(font => (
                    <DropdownMenuItem 
                      key={font} 
                      onClick={() => onAction('fontFamily', font)}
                    >
                      <span style={{ fontFamily: font }} className="text-sm flex-1">{font}</span>
                      {selectedFont === font && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  {category !== 'System' && <DropdownMenuSeparator />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 justify-between transition-colors border-border bg-background text-foreground hover:bg-accent ${
                  isCompactLayout ? 'w-12 px-2' : 'w-16 px-3'
                }`}
              >
                <span className="text-sm">{selectedFontSize}</span>
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {fontSizes.map(size => (
                <DropdownMenuItem key={size} onClick={() => onAction('fontSize', size)}>
                  <span className="text-sm">{size}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 transition-colors border-border bg-background text-foreground hover:bg-accent ${
                  isCompactLayout ? 'px-2' : 'px-3'
                }`}
              >
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {headingSizes.map(heading => (
                <DropdownMenuItem key={heading.value} onClick={() => onAction(heading.value)}>
                  <span className={cn(
                    'font-bold text-sm',
                    heading.value === 'h1' && 'text-2xl',
                    heading.value === 'h2' && 'text-xl',
                    heading.value === 'h3' && 'text-lg'
                  )}>
                    {heading.preview}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">{heading.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Text Formatting Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant={isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('bold')}
            className={cn(
              'h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95',
              isActive('bold') 
                ? 'bg-primary text-primary-foreground border border-primary shadow-lg'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('italic')}
            className={cn(
              'h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95',
              isActive('italic') 
                ? 'bg-primary text-primary-foreground border border-primary shadow-lg'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('underline')}
            className={cn(
              'h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95',
              isActive('underline') 
                ? 'bg-primary text-primary-foreground border border-primary shadow-lg'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('strikethrough') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('strikethrough')}
            className={cn(
              'h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95',
              isActive('strikethrough') 
                ? 'bg-primary text-primary-foreground border border-primary shadow-lg'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1 bg-border" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('subscript')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Subscript"
          >
            <span className="text-sm font-medium">X₂</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('superscript')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Superscript"
          >
            <span className="text-sm font-medium">X²</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Color & Style Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 transition-colors hover:bg-accent"
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onAction('textColor', '#000000')}>
                <div className="w-4 h-4 bg-foreground rounded mr-2" />
                <span className="text-sm">Black</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#ef4444')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(0 84% 60%)' }} />
                <span className="text-sm">Red</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#3b82f6')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
                <span className="text-sm">Blue</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#10b981')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(160 84% 39%)' }} />
                <span className="text-sm">Green</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#f59e0b')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(38 92% 50%)' }} />
                <span className="text-sm">Amber</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#8b5cf6')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(258 90% 66%)' }} />
                <span className="text-sm">Violet</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#ec4899')}>
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: 'hsl(330 81% 60%)' }} />
                <span className="text-sm">Pink</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('textColor', '#6b7280')}>
                <div className="w-4 h-4 rounded mr-2 bg-muted-foreground" />
                <span className="text-sm">Gray</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('highlight')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Highlight Text"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Alignment Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignLeft')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignCenter')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignRight')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignJustify')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Comments Group */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('comment')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Add Comment"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('orderedList')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('unorderedList')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Insert Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('link')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('image')}
            className={`h-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95 ${
              isCompactLayout ? 'px-2 gap-2' : 'w-8'
            }`}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
            {isCompactLayout && <span className="text-sm">Image</span>}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95 ${
                  isCompactLayout ? 'px-2 gap-2' : 'w-8'
                }`}
                title="Image Position"
              >
                <Move className="h-4 w-4" />
                {isCompactLayout && <span className="text-sm">Position</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'left')}>
                <AlignLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Align Left</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'center')}>
                <AlignCenter className="h-4 w-4 mr-2" />
                <span className="text-sm">Align Center</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'right')}>
                <AlignRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Align Right</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'inline')}>
                <span className="text-sm">Inline with Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'top')}>
                <span className="text-sm">Top of Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'bottom')}>
                <span className="text-sm">Bottom of Text</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'behind')}>
                <span className="text-sm">Behind Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('imagePosition', 'front')}>
                <span className="text-sm">In Front of Text</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95 ${
                  isCompactLayout ? 'px-2 gap-2' : 'w-8'
                }`}
                title="Insert Table"
              >
                <Table className="h-4 w-4" />
                {isCompactLayout && <span className="text-sm">Table</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onAction('table')}>
                <Table className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Table</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('insertRow')}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('insertColumn')}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Column</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('deleteRow')}>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Delete Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('deleteColumn')}>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Delete Column</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('code')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Code Format"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('quote')}
            className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            title="Block Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Elements Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('horizontalRule')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1" />

        {/* Layout Group - Moved to right side */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 transition-colors border-border bg-background text-foreground hover:bg-accent ${
                  isCompactLayout ? 'px-2' : 'px-3'
                }`}
              >
                <div className="w-4 h-3 border border-current rounded-sm mr-2" />
                <span className="text-sm">Margins</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => onAction('margins', 'normal')}>
                <span className="text-sm">Normal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('margins', 'narrow')}>
                <span className="text-sm">Narrow</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('margins', 'wide')}>
                <span className="text-sm">Wide</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 hover:bg-accent/50 transition-colors ${
                  isCompactLayout ? 'px-2' : 'px-3'
                }`}
              >
                <AlignJustify className="h-4 w-4 mr-2" />
                <span className="text-sm">Spacing</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '1')}>
                <span className="text-sm">Single</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '1.5')}>
                <span className="text-sm">1.5 Lines</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '2')}>
                <span className="text-sm">Double</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AI & More Tools */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('ai-assist')}
            className={`h-8 gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95 ${
              isCompactLayout ? 'px-2' : 'px-3'
            }`}
            title="AI Assistant"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
                title="More Tools"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction('settings')}>
                <Settings2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('macros')}>
                <Code className="h-4 w-4 mr-2" />
                <span className="text-sm">Macros</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;