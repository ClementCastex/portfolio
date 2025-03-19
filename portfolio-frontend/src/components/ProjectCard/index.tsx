import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  Button,
  Skeleton,
  Divider,
  Tooltip,
  CardActionArea,
  alpha,
  Badge,
  Stack,
  Avatar,
  AvatarGroup,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  ArrowForward as ArrowForwardIcon,
  Image as ImageIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ProjectCardProps } from '../../types';
import { getFullImageUrl } from '../../utils/imageUtils';

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'warning';
    case 'ABANDONED':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Terminé';
    case 'in_progress':
      return 'En cours';
    case 'abandoned':
      return 'Abandonné';
    default:
      return status.replace('_', ' ');
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onLike,
  isLiked = false,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const mainImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(project.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
    }
  };

  const heartIconColor = isDarkMode 
    ? (isLiked ? '#CCAA1D' : 'rgba(255, 255, 255, 0.6)') 
    : (isLiked ? '#5B348B' : 'rgba(0, 0, 0, 0.6)');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: isHovered 
          ? `0 14px 28px ${alpha(theme.palette.common.black, 0.25)}, 0 10px 10px ${alpha(theme.palette.common.black, 0.22)}`
          : `0 3px 6px ${alpha(theme.palette.common.black, 0.16)}, 0 3px 6px ${alpha(theme.palette.common.black, 0.23)}`,
        '&:hover': {
          transform: 'translateY(-8px)',
        },
        bgcolor: theme.palette.background.paper,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image avec badge de status et nombre d'images */}
      <Box sx={{ position: 'relative' }} onClick={handleViewDetails}>
        <CardActionArea>
          {mainImage ? (
            <>
              <CardMedia
                component="img"
                height="180"
                image={getFullImageUrl(mainImage)}
                alt={project.title}
                sx={{ 
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease-in-out',
                  ...(isHovered && { transform: 'scale(1.05)' }),
                  ...(imageLoaded ? {} : { display: 'none' })
                }}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <Skeleton 
                  variant="rectangular" 
                  height={180} 
                  animation="wave" 
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
                />
              )}
            </>
          ) : (
            <Box 
              sx={{ 
                height: 180, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }}
            >
              <ImageIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.primary, 0.3) }} />
            </Box>
          )}
        </CardActionArea>

        {/* Status badge */}
        <Chip
          label={getStatusLabel(project.status)}
          color={getStatusColor(project.status)}
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            fontWeight: 'medium',
            boxShadow: 1,
          }}
        />

        {/* Images count badge */}
        {project.images && project.images.length > 1 && (
          <Chip
            icon={<ImageIcon fontSize="small" />}
            label={project.images.length}
            size="small"
            sx={{ 
              position: 'absolute', 
              bottom: 12, 
              right: 12,
              fontWeight: 'medium',
              bgcolor: alpha(theme.palette.common.black, 0.5),
              color: 'white',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
        <Box mb={1}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom={false}
            noWrap
            sx={{ 
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
              color: theme.palette.text.primary,
              '&:hover': {
                color: '#5B348B',
              }
            }}
            onClick={handleViewDetails}
          >
            {project.title}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{ 
            mb: 2,
            height: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.shortDescription}
        </Typography>
        
        {/* Categories */}
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {project.categories.slice(0, 3).map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: '#5B348B',
                fontSize: '0.7rem',
                height: '22px',
              }}
            />
          ))}
          {project.categories.length > 3 && (
            <Chip
              label={`+${project.categories.length - 3}`}
              size="small"
              sx={{ 
                fontSize: '0.7rem', 
                height: '22px',
                bgcolor: alpha('#5B348B', 0.1),
              }}
            />
          )}
        </Stack>
      </CardContent>

      <Divider sx={{ mt: 'auto', mx: 2 }} />

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Like button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={isLiked ? "Je n'aime plus" : "J'aime"}>
              <IconButton
                onClick={handleLikeClick}
                size="small"
                sx={{ color: heartIconColor }}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography 
              variant="body2" 
              sx={{ 
                color: heartIconColor,
                fontWeight: 'medium',
                minWidth: '12px',
              }}
            >
              {project.likes || 0}
            </Typography>
          </Box>

          {/* External links */}
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            {project.githubUrl && (
              <Tooltip title="GitHub">
                <IconButton
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {project.websiteUrl && (
              <Tooltip title="Site Web">
                <IconButton
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <LanguageIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* Admin actions */}
          {isAdmin && (
            <>
              {onEdit && (
                <Tooltip title="Modifier">
                  <IconButton
                    onClick={handleEditClick}
                    size="small"
                    sx={{ color: isDarkMode ? '#5B348B' : 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Supprimer">
                  <IconButton
                    onClick={handleDeleteClick}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}

          {/* View details button */}
          <Tooltip title="Voir les détails">
            <IconButton
              size="small"
              onClick={handleViewDetails}
              sx={{ 
                color: '#5B348B',
                bgcolor: alpha('#5B348B', 0.1),
                '&:hover': {
                  bgcolor: alpha('#5B348B', 0.2),
                },
                width: 28,
                height: 28,
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProjectCard; 