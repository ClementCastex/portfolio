import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  AttachFile as FileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { KanbanCardFile } from '../../types';

interface FilePreviewProps {
  file: KanbanCardFile;
  onClick?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClick }) => {
  const theme = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFileIcon = () => {
    if (file.isImage) {
      return (
        <img 
          src={file.url} 
          alt={file.filename}
          style={{ 
            width: 40, 
            height: 40, 
            objectFit: 'cover', 
            borderRadius: 8,
            cursor: 'pointer',
          }}
          onClick={() => setPreviewOpen(true)}
        />
      );
    }

    if (file.mime?.includes('pdf')) {
      return <PdfIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />;
    }

    if (file.mime?.includes('doc') || file.mime?.includes('text')) {
      return <DocIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />;
    }

    return <FileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {getFileIcon()}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            textAlign: 'center',
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.filename}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(file.size)}
        </Typography>
      </Box>

      {/* Image Preview Dialog */}
      {file.isImage && (
        <Dialog 
          open={previewOpen} 
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{file.filename}</Typography>
            <Box>
              <IconButton 
                onClick={() => window.open(file.url, '_blank')}
                sx={{ mr: 1 }}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={() => setPreviewOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <img 
              src={file.url} 
              alt={file.filename}
              style={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FilePreview;
