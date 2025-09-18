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
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as ChecklistIcon,
  AccessTime as TimeIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
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
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        border: card.isOverdue ? 2 : 1,
        borderColor: card.isOverdue ? theme.palette.error.main : 'divider',
        borderLeft: card.priority ? `4px solid ${card.priorityColor}` : 'none',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Card Header with Priority */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
              lineHeight: 1.3,
              flexGrow: 1,
            }}
          >
            {card.title}
          </Typography>
          
          {/* Priority indicator */}
          {card.priority && (
            <Tooltip title={`Priorité ${card.priority === 'high' ? 'haute' : card.priority === 'medium' ? 'moyenne' : 'basse'}`}>
              <PriorityIcon 
                sx={{ 
                  fontSize: 16, 
                  color: card.priorityColor,
                  ml: 1,
                }} 
              />
            </Tooltip>
          )}
        </Box>

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

        {/* Checklist Progress */}
        {card.checklist && Array.isArray(card.checklist) && card.checklist.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ChecklistIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {card.checklistProgress?.completed || 0}/{card.checklistProgress?.total || 0}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={card.checklistProgress?.percentage || 0}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.grey[500], 0.3),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: card.checklistProgress?.percentage === 100 
                    ? theme.palette.success.main 
                    : theme.palette.primary.main,
                },
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {card.tags && Array.isArray(card.tags) && card.tags.length > 0 && (
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

        {/* Assigned Users */}
        {card.assignedUserIds && Array.isArray(card.assignedUserIds) && card.assignedUserIds.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
              {card.assignedUserIds.map((userId, index) => (
                <Tooltip key={userId} title={`Utilisateur ${userId}`}>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      fontSize: '0.7rem',
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}

        {/* Time Tracking */}
        {(card.estimatedHours || card.loggedHours) && (
          <Box sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {card.loggedHours || 0}h
                {card.estimatedHours && ` / ${card.estimatedHours}h`}
              </Typography>
              {card.estimatedHours && card.loggedHours && (
                <LinearProgress
                  variant="determinate"
                  value={Math.min((card.loggedHours / card.estimatedHours) * 100, 100)}
                  sx={{
                    width: 40,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[500], 0.3),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: card.loggedHours > card.estimatedHours 
                        ? theme.palette.warning.main 
                        : theme.palette.info.main,
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
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

          {/* Attachments, links, and comments count */}
          <Stack direction="row" spacing={0.5}>
            {card.files && Array.isArray(card.files) && card.files.length > 0 && (
              <Tooltip title={`${card.files.length} pièce(s) jointe(s)`}>
                <Badge badgeContent={card.files.length} color="primary">
                  <AttachFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {card.links && Array.isArray(card.links) && card.links.length > 0 && (
              <Tooltip title={`${card.links.length} lien(s)`}>
                <Badge badgeContent={card.links.length} color="secondary">
                  <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {card.comments && Array.isArray(card.comments) && card.comments.length > 0 && (
              <Tooltip title={`${card.comments.length} commentaire(s)`}>
                <Badge badgeContent={card.comments.length} color="info">
                  <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {card.checklist && Array.isArray(card.checklist) && card.checklist.length > 0 && (
              <Tooltip title={`${card.checklistProgress?.completed || 0}/${card.checklistProgress?.total || 0} tâches`}>
                <Badge 
                  badgeContent={`${card.checklistProgress?.completed || 0}/${card.checklistProgress?.total || 0}`} 
                  color={card.checklistProgress?.percentage === 100 ? 'success' : 'default'}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      minWidth: 'auto',
                      height: 16,
                      padding: '0 4px',
                    },
                  }}
                >
                  <ChecklistIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
