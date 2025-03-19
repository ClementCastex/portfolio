import React from 'react';
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
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { ProjectCardProps } from '../../types';
import { getFullImageUrl } from '../../utils/imageUtils';

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status) {
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
  return status.replace('_', ' ').toLowerCase();
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
  const mainImage = project.images && project.images.length > 0 ? project.images[0] : null;

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {mainImage && (
        <CardMedia
          component="img"
          height="200"
          image={getFullImageUrl(mainImage)}
          alt={project.title}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={handleViewDetails}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{ cursor: 'pointer' }}
            onClick={handleViewDetails}
          >
            {project.title}
          </Typography>
          <Chip
            label={getStatusLabel(project.status)}
            color={getStatusColor(project.status)}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {project.shortDescription}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {project.categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {project.githubUrl && (
            <IconButton
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="primary"
            >
              <GitHubIcon />
            </IconButton>
          )}
          {project.websiteUrl && (
            <IconButton
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="primary"
            >
              <LanguageIcon />
            </IconButton>
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={handleViewDetails}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              ml: 1,
              borderWidth: 3,
              borderColor: 'rgb(91, 52, 139)',
              '&:hover': {
                borderWidth: 3,
                borderColor: 'rgb(116, 68, 175)',
              }
            }}
          >
            Voir plus
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2">{project.likes || 0}</Typography>
          {onLike && (
            <IconButton
              onClick={() => onLike(project.id)}
              size="small"
              color="primary"
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
          {isAdmin && (
            <>
              {onEdit && (
                <IconButton
                  onClick={() => onEdit(project)}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  onClick={() => onDelete(project.id)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProjectCard; 