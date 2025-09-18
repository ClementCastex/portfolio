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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Palette as PaletteIcon,
  PriorityHigh as PriorityIcon,
  AccessTime as TimeIcon,
  CheckCircle as ChecklistIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
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
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | ''>('');
  const [estimatedHours, setEstimatedHours] = useState<number | ''>('');
  const [loggedHours, setLoggedHours] = useState<number | ''>('');
  const [checklist, setChecklist] = useState<Array<{id: string, text: string, completed: boolean}>>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3f51b5');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.descriptionHtml || '');
      setDueDate(card.dueAt ? card.dueAt.split('T')[0] : '');
      setSelectedTags(card.tags.map(tag => tag.id));
      setPriority(card.priority || '');
      setEstimatedHours(card.estimatedHours || '');
      setLoggedHours(card.loggedHours || '');
      setChecklist(card.checklist || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedTags([]);
      setPriority('');
      setEstimatedHours('');
      setLoggedHours('');
      setChecklist([]);
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
      priority: priority || undefined,
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
      loggedHours: loggedHours ? Number(loggedHours) : undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
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

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      };
      setChecklist(prev => [...prev, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
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

          {/* Due Date and Priority */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Date d'échéance"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Priorité</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                label="Priorité"
                startAdornment={<PriorityIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="">Aucune</MenuItem>
                <MenuItem value="low" sx={{ color: '#4caf50' }}>🟢 Basse</MenuItem>
                <MenuItem value="medium" sx={{ color: '#ff9800' }}>🟡 Moyenne</MenuItem>
                <MenuItem value="high" sx={{ color: '#f44336' }}>🔴 Haute</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Time Tracking */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Temps estimé (heures)"
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value ? Number(e.target.value) : '')}
              InputProps={{
                startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Temps passé (heures)"
              type="number"
              value={loggedHours}
              onChange={(e) => setLoggedHours(e.target.value ? Number(e.target.value) : '')}
              InputProps={{
                startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
          </Stack>

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

          {/* Checklist */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChecklistIcon />
                <Typography variant="subtitle2">
                  Checklist ({checklist.filter(item => item.completed).length}/{checklist.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Add new checklist item */}
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Ajouter une tâche..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleAddChecklistItem}
                    disabled={!newChecklistItem.trim()}
                  >
                    <AddIcon />
                  </Button>
                </Stack>

                {/* Checklist items */}
                {checklist.length > 0 && (
                  <List dense>
                    {checklist.map((item) => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Checkbox
                            checked={item.completed}
                            onChange={() => handleToggleChecklistItem(item.id)}
                            size="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              textDecoration: item.completed ? 'line-through' : 'none',
                              color: item.completed ? 'text.secondary' : 'text.primary',
                            },
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteChecklistItem(item.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

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

          {/* Comments section (placeholder) */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Commentaires
            </Typography>
            <Button variant="outlined" size="small" disabled>
              Ajouter un commentaire (à venir)
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
          sx={{ color: 'white' }}
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
            sx={{ color: 'white' }}
          >
            Créer
          </Button>
        </ColorDialogActions>
      </ColorDialog>
    </Dialog>
  );
};

export default KanbanCardModal;
