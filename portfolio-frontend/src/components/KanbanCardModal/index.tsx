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
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { KanbanCard, KanbanBoard as KanbanBoardType } from '../../types';
import { createCard, updateCard } from '../../store/slices/kanbanSlice';

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
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
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
                  Aucun tag disponible. Créez-en dans les paramètres du tableau.
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
    </Dialog>
  );
};

export default KanbanCardModal;
