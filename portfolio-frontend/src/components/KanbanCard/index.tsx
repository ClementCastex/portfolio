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

  // Normaliser les données de la carte pour éviter les erreurs
  const normalizedCard = {
    ...card,
    tags: Array.isArray(card.tags) ? card.tags : [],
    files: Array.isArray(card.files) ? card.files : [],
    links: Array.isArray(card.links) ? card.links : [],
    comments: Array.isArray(card.comments) ? card.comments : [],
    checklist: Array.isArray(card.checklist) ? card.checklist : [],
    assignedUserIds: Array.isArray(card.assignedUserIds) ? card.assignedUserIds : [],
    checklistProgress: card.checklistProgress || { completed: 0, total: 0, percentage: 0 },
    priorityColor: card.priorityColor || '#9e9e9e',
  };

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
        border: normalizedCard.isOverdue ? 2 : 1,
        borderColor: normalizedCard.isOverdue ? theme.palette.error.main : 'divider',
        borderLeft: normalizedCard.priority ? `4px solid ${normalizedCard.priorityColor}` : 'none',
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
            {normalizedCard.title}
          </Typography>
          
          {/* Priority indicator */}
          {normalizedCard.priority && (
            <Tooltip title={`Priorité ${normalizedCard.priority === 'high' ? 'haute' : normalizedCard.priority === 'medium' ? 'moyenne' : 'basse'}`}>
              <PriorityIcon 
                sx={{ 
                  fontSize: 16, 
                  color: normalizedCard.priorityColor,
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
        {normalizedCard.checklist && normalizedCard.checklist.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ChecklistIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {normalizedCard.checklistProgress.completed}/{normalizedCard.checklistProgress.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={normalizedCard.checklistProgress.percentage}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.grey[500], 0.3),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: normalizedCard.checklistProgress.percentage === 100 
                    ? theme.palette.success.main 
                    : theme.palette.primary.main,
                },
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {normalizedCard.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {normalizedCard.tags.slice(0, 3).map((tag) => (
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
            {normalizedCard.tags.length > 3 && (
              <Chip
                label={`+${normalizedCard.tags.length - 3}`}
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
        {normalizedCard.assignedUserIds.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
              {normalizedCard.assignedUserIds.map((userId, index) => (
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
        {(normalizedCard.estimatedHours || normalizedCard.loggedHours) && (
          <Box sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {normalizedCard.loggedHours || 0}h
                {normalizedCard.estimatedHours && ` / ${normalizedCard.estimatedHours}h`}
              </Typography>
              {normalizedCard.estimatedHours && normalizedCard.loggedHours && (
                <LinearProgress
                  variant="determinate"
                  value={Math.min((normalizedCard.loggedHours / normalizedCard.estimatedHours) * 100, 100)}
                  sx={{
                    width: 40,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[500], 0.3),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: normalizedCard.loggedHours > normalizedCard.estimatedHours 
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
            {normalizedCard.files.length > 0 && (
              <Tooltip title={`${normalizedCard.files.length} pièce(s) jointe(s)`}>
                <Badge badgeContent={normalizedCard.files.length} color="primary">
                  <AttachFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {normalizedCard.links.length > 0 && (
              <Tooltip title={`${normalizedCard.links.length} lien(s)`}>
                <Badge badgeContent={normalizedCard.links.length} color="secondary">
                  <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {normalizedCard.comments.length > 0 && (
              <Tooltip title={`${normalizedCard.comments.length} commentaire(s)`}>
                <Badge badgeContent={normalizedCard.comments.length} color="info">
                  <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
            {normalizedCard.checklist.length > 0 && (
              <Tooltip title={`${normalizedCard.checklistProgress.completed}/${normalizedCard.checklistProgress.total} tâches`}>
                <Badge 
                  badgeContent={`${normalizedCard.checklistProgress.completed}/${normalizedCard.checklistProgress.total}`} 
                  color={normalizedCard.checklistProgress.percentage === 100 ? 'success' : 'default'}
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
