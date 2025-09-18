import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { KanbanCard as KanbanCardType } from '../../types';

interface KanbanCardProps {
  card: KanbanCardType;
  columnId: number;
  onEdit: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, columnId, onEdit }) => {
  const theme = useTheme();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id.toString());
    e.dataTransfer.setData('fromColumnId', columnId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDueDate = (dueAt: string | null) => {
    if (!dueAt) return null;
    const date = new Date(dueAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) return 'Aujourd\'hui';
    if (isTomorrow) return 'Demain';
    return date.toLocaleDateString();
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onClick={onEdit}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        border: card.isOverdue ? 2 : 1,
        borderColor: card.isOverdue ? theme.palette.error.main : 'divider',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Card Title */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            color: 'white',
            lineHeight: 1.3,
          }}
        >
          {card.title}
        </Typography>

        {/* Description preview */}
        {card.descriptionHtml && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
            dangerouslySetInnerHTML={{ 
              __html: card.descriptionHtml.replace(/<[^>]*>/g, '') 
            }}
          />
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {card.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: tag.colorHex,
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            ))}
            {card.tags.length > 3 && (
              <Chip
                label={`+${card.tags.length - 3}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: alpha(theme.palette.grey[500], 0.3),
                  color: 'text.secondary',
                }}
              />
            )}
          </Stack>
        )}

        {/* Footer with metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          {/* Due date */}
          {card.dueAt && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: card.isOverdue 
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.info.main, 0.1),
                border: 1,
                borderColor: card.isOverdue 
                  ? theme.palette.error.main
                  : theme.palette.info.main,
              }}
            >
              {card.isOverdue ? (
                <WarningIcon sx={{ fontSize: 12, color: theme.palette.error.main }} />
              ) : (
                <ScheduleIcon sx={{ fontSize: 12, color: theme.palette.info.main }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.7rem',
                  color: card.isOverdue ? theme.palette.error.main : theme.palette.info.main,
                  fontWeight: card.isOverdue ? 'bold' : 'normal',
                }}
              >
                {formatDueDate(card.dueAt)}
              </Typography>
            </Box>
          )}

          {/* Attachments and links count */}
          <Stack direction="row" spacing={0.5}>
            {card.files && card.files.length > 0 && (
              <Badge badgeContent={card.files.length} color="primary">
                <AttachFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Badge>
            )}
            {card.links && card.links.length > 0 && (
              <Badge badgeContent={card.links.length} color="secondary">
                <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Badge>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
