import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Toolbar,
  Tooltip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Note } from '../../types';

interface NoteEditorProps {
  note: Note;
  onChange: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onChange }) => {
  const theme = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleFormat = (command: string, value?: string) => {
    execCommand(command, value);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Image" />`;
        execCommand('insertHTML', img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Image collée" />`;
              execCommand('insertHTML', img);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Image déposée" />`;
          execCommand('insertHTML', img);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 48, gap: 1 }}>
          <Tooltip title="Gras">
            <IconButton
              size="small"
              onClick={() => handleFormat('bold')}
              sx={{ borderRadius: 1 }}
            >
              <BoldIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italique">
            <IconButton
              size="small"
              onClick={() => handleFormat('italic')}
              sx={{ borderRadius: 1 }}
            >
              <ItalicIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title="Liste à puces">
            <IconButton
              size="small"
              onClick={() => handleFormat('insertUnorderedList')}
              sx={{ borderRadius: 1 }}
            >
              <BulletListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Liste numérotée">
            <IconButton
              size="small"
              onClick={() => handleFormat('insertOrderedList')}
              sx={{ borderRadius: 1 }}
            >
              <NumberListIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title="Code inline">
            <IconButton
              size="small"
              onClick={() => handleFormat('insertHTML', '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">code</code>')}
              sx={{ borderRadius: 1 }}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Insérer une image">
            <IconButton
              size="small"
              onClick={handleImageUpload}
              sx={{ borderRadius: 1 }}
            >
              <ImageIcon />
            </IconButton>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Toolbar>
      </Paper>

      {/* Editor */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            if (editorRef.current) {
              onChange(editorRef.current.innerHTML);
            }
          }}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
          sx={{
            minHeight: '100%',
            p: 3,
            outline: 'none',
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            '&:focus': {
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              boxShadow: theme.shadows[2],
            },
            '& code': {
              backgroundColor: alpha(theme.palette.grey[500], 0.1),
              padding: '2px 4px',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
            },
            '& ul, & ol': {
              paddingLeft: theme.spacing(3),
            },
            '& li': {
              marginBottom: theme.spacing(0.5),
            },
            '& p': {
              marginBottom: theme.spacing(1),
              '&:last-child': {
                marginBottom: 0,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default NoteEditor;
