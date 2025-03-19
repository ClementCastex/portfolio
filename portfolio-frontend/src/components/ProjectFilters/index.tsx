import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  SelectChangeEvent,
  Paper,
  InputAdornment,
  Fade,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Badge,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  Category as CategoryIcon,
  TaskAlt as StatusIcon,
  Clear as ClearIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { darkInputStyle, lightInputStyle } from '../../theme/styles';

interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  allTags: string[];
  showOnlyLiked?: boolean;
  setShowOnlyLiked?: (value: boolean) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  allTags,
  showOnlyLiked = false,
  setShowOnlyLiked,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const primaryColor = isDarkMode ? '#FFFFFF' : '#5B348B'; // Blanc en mode sombre, violet en mode clair

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  const handleTagChange = (event: SelectChangeEvent) => {
    setSelectedTag(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedStatus) count++;
    if (selectedTag) count++;
    if (sortBy !== 'date_desc') count++;
    if (showOnlyLiked) count++;
    return count;
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedTag('');
    setSortBy('date_desc');
    if (setShowOnlyLiked) setShowOnlyLiked(false);
  };
  
  const activeFilterCount = getActiveFilterCount();

  return (
    <Fade in={true} timeout={500}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2.5, 
          borderRadius: 2,
          mb: 3,
          transition: 'all 0.3s',
          border: activeFilterCount > 0 ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)'}` : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            badgeContent={activeFilterCount}
            color={isDarkMode ? "default" : "primary"}
            sx={{ 
              mr: 1.5,
              '& .MuiBadge-badge': {
                backgroundColor: isDarkMode ? 'white' : undefined,
                color: isDarkMode ? 'black' : undefined
              }
            }}
          >
            <FilterIcon color={activeFilterCount > 0 ? (isDarkMode ? "inherit" : "primary") : "action"} 
              sx={{ color: activeFilterCount > 0 && isDarkMode ? 'white' : undefined }}
            />
          </Badge>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500, fontSize: '1.1rem', color: 'text.primary' }}>
            Filtrer les projets
          </Typography>
          {activeFilterCount > 0 && (
            <Tooltip title="Réinitialiser tous les filtres">
              <IconButton 
                size="small" 
                onClick={handleClearFilters}
                sx={{ ml: 1 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher un projet..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.primary }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                ...isDarkMode ? darkInputStyle : lightInputStyle,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  transition: 'all 0.3s',
                  backgroundColor: isDarkMode 
                    ? searchQuery ? 'rgba(255, 255, 255, 0.12)' : 'transparent' 
                    : searchQuery ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              sx={{
                ...isDarkMode ? darkInputStyle : lightInputStyle,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  transition: 'all 0.3s',
                  backgroundColor: isDarkMode 
                    ? selectedStatus ? 'rgba(255, 255, 255, 0.12)' : 'transparent' 
                    : selectedStatus ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiSvgIcon-root': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <InputLabel 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                <StatusIcon fontSize="small" sx={{ fontSize: 18 }} /> Statut
              </InputLabel>
              <Select
                value={selectedStatus}
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><StatusIcon fontSize="small" /> Statut</Box>}
                onChange={handleStatusChange}
                endAdornment={selectedStatus ? (
                  <IconButton
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatus('');
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null}
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="completed">
                  <Chip 
                    label="Terminé" 
                    size="small" 
                    color="success" 
                    sx={{ height: 24, fontSize: '0.8rem' }}
                  />
                </MenuItem>
                <MenuItem value="in_progress">
                  <Chip 
                    label="En cours" 
                    size="small" 
                    color="warning" 
                    sx={{ height: 24, fontSize: '0.8rem' }}
                  />
                </MenuItem>
                <MenuItem value="abandoned">
                  <Chip 
                    label="Abandonné" 
                    size="small" 
                    color="error" 
                    sx={{ height: 24, fontSize: '0.8rem' }}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              sx={{
                ...isDarkMode ? darkInputStyle : lightInputStyle,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  transition: 'all 0.3s',
                  backgroundColor: isDarkMode 
                    ? selectedTag ? 'rgba(255, 255, 255, 0.12)' : 'transparent' 
                    : selectedTag ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiSvgIcon-root': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <InputLabel
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                <CategoryIcon fontSize="small" sx={{ fontSize: 18 }} /> Catégorie
              </InputLabel>
              <Select
                value={selectedTag}
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CategoryIcon fontSize="small" /> Catégorie</Box>}
                onChange={handleTagChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                endAdornment={selectedTag ? (
                  <IconButton
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag('');
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null}
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              sx={{
                ...isDarkMode ? darkInputStyle : lightInputStyle,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  transition: 'all 0.3s',
                  backgroundColor: isDarkMode 
                    ? sortBy !== 'date_desc' ? 'rgba(255, 255, 255, 0.12)' : 'transparent' 
                    : sortBy !== 'date_desc' ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiSvgIcon-root': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <InputLabel
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                <SortIcon fontSize="small" sx={{ fontSize: 18 }} /> Trier par
              </InputLabel>
              <Select
                value={sortBy}
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><SortIcon fontSize="small" /> Trier par</Box>}
                onChange={handleSortChange}
                endAdornment={sortBy !== 'date_desc' ? (
                  <IconButton
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortBy('date_desc');
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null}
              >
                <MenuItem value="date_desc">Date (Plus récent d'abord)</MenuItem>
                <MenuItem value="date_asc">Date (Plus ancien d'abord)</MenuItem>
                <MenuItem value="title_asc">Titre (A-Z)</MenuItem>
                <MenuItem value="title_desc">Titre (Z-A)</MenuItem>
                <MenuItem value="likes_desc">Likes (Plus populaire)</MenuItem>
                <MenuItem value="likes_asc">Likes (Moins populaire)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Ajout du filtre "Mes likes" */}
          {setShowOnlyLiked && (
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`,
                borderRadius: 1.5,
                p: 1,
                pl: 2,
                pr: 1.5,
                height: '56px',
                backgroundColor: isDarkMode 
                  ? showOnlyLiked ? 'rgba(255, 255, 255, 0.12)' : 'transparent' 
                  : showOnlyLiked ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                },
                transition: 'all 0.3s'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <FavoriteIcon 
                    fontSize="small" 
                    color={showOnlyLiked ? "error" : "action"} 
                    sx={{ mr: 1 }} 
                  />
                  <Typography variant="body1" color="text.primary">
                    Mes likes
                  </Typography>
                </Box>
                <Switch 
                  checked={showOnlyLiked}
                  onChange={(e) => setShowOnlyLiked(e.target.checked)}
                  color={isDarkMode ? "default" : "primary"}
                  sx={{
                    ...(isDarkMode && {
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'white',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }
                    })
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        
        {/* Affichage des filtres actifs */}
        {activeFilterCount > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`,
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ mr: 1, display: 'flex', alignItems: 'center', fontWeight: 'medium' }}>
              Filtres actifs:
            </Typography>
            
            {searchQuery && (
              <Chip
                label={`Recherche: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                size="small"
                color={isDarkMode ? "default" : "primary"}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  color: isDarkMode ? 'white' : undefined,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    '&:hover': {
                      color: isDarkMode ? 'white' : undefined
                    }
                  }
                }}
              />
            )}
            
            {selectedStatus && (
              <Chip
                label={`Statut: ${selectedStatus === 'completed' ? 'Terminé' : selectedStatus === 'in_progress' ? 'En cours' : 'Abandonné'}`}
                onDelete={() => setSelectedStatus('')}
                size="small"
                color={isDarkMode ? "default" : "primary"}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  color: isDarkMode ? 'white' : undefined,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    '&:hover': {
                      color: isDarkMode ? 'white' : undefined
                    }
                  }
                }}
              />
            )}
            
            {selectedTag && (
              <Chip
                label={`Catégorie: ${selectedTag}`}
                onDelete={() => setSelectedTag('')}
                size="small"
                color={isDarkMode ? "default" : "primary"}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  color: isDarkMode ? 'white' : undefined,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    '&:hover': {
                      color: isDarkMode ? 'white' : undefined
                    }
                  }
                }}
              />
            )}
            
            {sortBy !== 'date_desc' && (
              <Chip
                label={`Tri: ${
                  sortBy === 'date_asc' ? 'Plus ancien' :
                  sortBy === 'title_asc' ? 'Titre (A-Z)' :
                  sortBy === 'title_desc' ? 'Titre (Z-A)' :
                  sortBy === 'likes_desc' ? 'Plus populaire' :
                  'Moins populaire'
                }`}
                onDelete={() => setSortBy('date_desc')}
                size="small"
                color={isDarkMode ? "default" : "primary"}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  color: isDarkMode ? 'white' : undefined,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    '&:hover': {
                      color: isDarkMode ? 'white' : undefined
                    }
                  }
                }}
              />
            )}
            
            {showOnlyLiked && setShowOnlyLiked && (
              <Chip
                icon={<FavoriteIcon fontSize="small" />}
                label="Mes likes"
                onDelete={() => setShowOnlyLiked(false)}
                size="small"
                color={isDarkMode ? "default" : "primary"}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  color: isDarkMode ? 'white' : undefined,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    '&:hover': {
                      color: isDarkMode ? 'white' : undefined
                    }
                  }
                }}
              />
            )}
          </Box>
        )}
      </Paper>
    </Fade>
  );
};

export default ProjectFilters; 