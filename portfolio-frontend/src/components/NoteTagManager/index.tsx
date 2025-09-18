import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createTag, fetchTags } from '../../store/slices/notesSlice';
import { NoteTag } from '../../types';

const NoteTagManager: React.FC = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector((state: RootState) => state.notes);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<NoteTag | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#2196F3');

  const predefinedColors = [
    '#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0',
    '#00BCD4', '#795548', '#607D8B', '#E91E63', '#3F51B5'
  ];

  const handleCreateTag = () => {
    setEditingTag(null);
    setTagName('');
    setTagColor('#2196F3');
    setDialogOpen(true);
  };

  const handleSaveTag = () => {
    if (tagName.trim()) {
      dispatch(createTag({ name: tagName.trim(), colorHex: tagColor }) as any);
      setDialogOpen(false);
      setTagName('');
      setTagColor('#2196F3');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Gestion des tags</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTag}
          size="small"
          sx={{ color: 'white' }}
        >
          Nouveau tag
        </Button>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            sx={{
              backgroundColor: tag.colorHex,
              color: 'white',
              '& .MuiChip-deleteIcon': {
                color: 'white',
              },
            }}
            onDelete={() => {
              // TODO: Implement tag deletion
              console.log('Delete tag:', tag.id);
            }}
          />
        ))}
      </Stack>

      {/* Create/Edit Tag Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTag ? 'Modifier le tag' : 'Créer un nouveau tag'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du tag"
            fullWidth
            variant="outlined"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Couleur du tag :
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {predefinedColors.map((color) => (
              <IconButton
                key={color}
                onClick={() => setTagColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  border: tagColor === color ? 3 : 1,
                  borderColor: tagColor === color ? 'primary.main' : 'divider',
                  '&:hover': {
                    backgroundColor: color,
                    opacity: 0.8,
                  },
                }}
              >
                {tagColor === color && <PaletteIcon sx={{ color: 'white', fontSize: 16 }} />}
              </IconButton>
            ))}
          </Stack>

          <TextField
            label="Couleur personnalisée (hex)"
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Aperçu :
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={tagName || 'Nom du tag'}
                sx={{
                  backgroundColor: tagColor,
                  color: 'white',
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSaveTag} 
            variant="contained" 
            disabled={!tagName.trim()}
            sx={{ color: 'white' }}
          >
            {editingTag ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteTagManager;
