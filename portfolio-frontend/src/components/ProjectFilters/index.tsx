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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
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
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  const handleTagChange = (event: SelectChangeEvent) => {
    setSelectedTag(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Rechercher"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ color: isDarkMode ? '#F7F3F7' : '#23272A', mr: 1 }} />,
          }}
          sx={isDarkMode ? darkInputStyle : lightInputStyle}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={selectedStatus}
            label="Statut"
            onChange={handleStatusChange}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="completed">Terminé</MenuItem>
            <MenuItem value="in_progress">En cours</MenuItem>
            <MenuItem value="abandoned">Abandonné</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={selectedTag}
            label="Catégorie"
            onChange={handleTagChange}
          >
            <MenuItem value="">Toutes</MenuItem>
            {allTags.map((tag) => (
              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth sx={isDarkMode ? darkInputStyle : lightInputStyle}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortBy}
            label="Trier par"
            onChange={handleSortChange}
          >
            <MenuItem value="date_desc">Date (Plus récent)</MenuItem>
            <MenuItem value="date_asc">Date (Plus ancien)</MenuItem>
            <MenuItem value="title_asc">Titre (A-Z)</MenuItem>
            <MenuItem value="title_desc">Titre (Z-A)</MenuItem>
            <MenuItem value="likes_desc">Likes (Plus populaire)</MenuItem>
            <MenuItem value="likes_asc">Likes (Moins populaire)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProjectFilters; 