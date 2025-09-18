import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Divider,
  Dialog as ColorDialog,
  DialogTitle as ColorDialogTitle,
  DialogContent as ColorDialogContent,
  DialogActions as ColorDialogActions,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { KanbanCard, KanbanBoard as KanbanBoardType } from '../../types';
import { createCard, updateCard, createTag } from '../../store/slices/kanbanSlice';

interface KanbanCardModalProps {
  open: boolean;
  onClose: () => void;
  card: KanbanCard | null;
  columnId: number | null;
  board: KanbanBoardType;
}

const KanbanCardModal: React.FC<KanbanCardModalProps> = ({
  open,
  onClose,
  card,
  columnId,
  board,
}) => {
  const dispatch = useDispatch();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3f51b5');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.descriptionHtml || '');
      setDueDate(card.dueAt ? card.dueAt.split('T')[0] : '');
      setSelectedTags(card.tags.map(tag => tag.id));
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedTags([]);
    }
  }, [card, open]);

  const predefinedColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  ];

  const handleSave = () => {
    const cardData = {
      title,
      descriptionHtml: description,
      dueAt: dueDate || undefined,
      tagIds: selectedTags,
    };

    if (card) {
      // Update existing card
      dispatch(updateCard({ id: card.id, ...cardData }) as any);
    } else if (columnId) {
      // Create new card
      dispatch(createCard({ columnId, ...cardData }) as any);
    }

    onClose();
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      dispatch(createTag({
        kanbanId: board.id,
        name: newTagName.trim(),
        colorHex: newTagColor,
      }) as any).then((result: any) => {
        if (result.payload) {
          setSelectedTags(prev => [...prev, result.payload.id]);
        }
      });
      setTagDialogOpen(false);
      setNewTagName('');
      setNewTagColor('#3f51b5');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: 500 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {card ? 'Modifier la carte' : 'Nouvelle carte'}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Title */}
          <TextField
            label="Titre de la carte"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Décrivez votre tâche..."
          />

          {/* Due Date */}
          <TextField
            label="Date d'échéance"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          {/* Tags */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Tags</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setTagDialogOpen(true)}
              >
                Nouveau tag
              </Button>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {board.tags?.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => handleTagToggle(tag.id)}
                  color={selectedTags.includes(tag.id) ? 'primary' : 'default'}
                  sx={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.colorHex : 'default',
                    color: selectedTags.includes(tag.id) ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: tag.colorHex,
                      color: 'white',
                    },
                  }}
                />
              ))}
              {(!board.tags || board.tags.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  Aucun tag disponible. Créez votre premier tag !
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Files and Links sections (placeholder for now) */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Pièces jointes
            </Typography>
            <Button variant="outlined" size="small" disabled>
              Ajouter un fichier (à venir)
            </Button>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Liens
            </Typography>
            <Button variant="outlined" size="small" disabled>
              Ajouter un lien (à venir)
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={!title.trim()}
        >
          {card ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>

      {/* Create Tag Dialog */}
      <ColorDialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)} maxWidth="sm" fullWidth>
        <ColorDialogTitle>Créer un nouveau tag</ColorDialogTitle>
        <ColorDialogContent>
          <Stack spacing={3}>
            <TextField
              autoFocus
              label="Nom du tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              fullWidth
              placeholder="Ex: Urgent, En cours, Terminé..."
            />
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Couleur
              </Typography>
              <Grid container spacing={1}>
                {predefinedColors.map((color) => (
                  <Grid item key={color}>
                    <IconButton
                      onClick={() => setNewTagColor(color)}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: color,
                        border: newTagColor === color ? 3 : 1,
                        borderColor: newTagColor === color ? 'primary.main' : 'divider',
                        '&:hover': {
                          backgroundColor: color,
                          opacity: 0.8,
                        },
                      }}
                    >
                      {newTagColor === color && (
                        <PaletteIcon sx={{ color: 'white', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
              
              <TextField
                label="Couleur personnalisée (hex)"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                size="small"
                sx={{ mt: 2 }}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: newTagColor,
                        borderRadius: 1,
                        mr: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                  ),
                }}
              />
            </Box>
          </Stack>
        </ColorDialogContent>
        <ColorDialogActions>
          <Button onClick={() => setTagDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateTag} 
            variant="contained"
            disabled={!newTagName.trim()}
          >
            Créer
          </Button>
        </ColorDialogActions>
      </ColorDialog>
    </Dialog>
  );
};

export default KanbanCardModal;
