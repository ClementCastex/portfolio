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
  alpha,
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
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { KanbanCard, KanbanBoard as KanbanBoardType } from '../../types';
import { createCard, updateCard, createTag, uploadCardFile, deleteCardFile, createCardLink, deleteCardLink } from '../../store/slices/kanbanSlice';
import FilePreview from '../FilePreview';

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
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && card) {
      dispatch(uploadCardFile({ cardId: card.id, file }) as any);
    }
  };

  const handleDeleteFile = (fileId: number) => {
    dispatch(deleteCardFile(fileId) as any);
  };

  const handleAddLink = () => {
    if (newLinkUrl.trim() && card) {
      dispatch(createCardLink({ cardId: card.id, url: newLinkUrl.trim() }) as any);
      setNewLinkUrl('');
    }
  };

  const handleDeleteLink = (linkId: number) => {
    dispatch(deleteCardLink(linkId) as any);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (card) {
        dispatch(uploadCardFile({ cardId: card.id, file }) as any);
      }
    });
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

          {/* Files Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachFileIcon />
                <Typography variant="subtitle2">
                  Pièces jointes ({card?.files?.length || 0})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Drag & Drop Zone */}
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: isDragOver ? theme.palette.primary.main : 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: isDragOver ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Glissez-déposez vos fichiers ici ou
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    Parcourir
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                      multiple
                    />
                  </Button>
                </Box>

                {/* Files grid */}
                {card?.files && card.files.length > 0 && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
                    {card.files.map((file) => (
                      <Box key={file.id} sx={{ position: 'relative' }}>
                        <FilePreview file={file} />
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteFile(file.id)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: theme.palette.error.main,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Links Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon />
                <Typography variant="subtitle2">
                  Liens ({card?.links?.length || 0})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Add link */}
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="https://example.com"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                    sx={{ flexGrow: 1 }}
                    type="url"
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleAddLink}
                    disabled={!newLinkUrl.trim()}
                  >
                    <AddIcon />
                  </Button>
                </Stack>

                {/* Links list */}
                {card?.links && card.links.length > 0 && (
                  <Stack spacing={1}>
                    {card.links.map((link) => (
                      <Box
                        key={link.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        {/* Favicon or icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                          {link.faviconUrl ? (
                            <img 
                              src={link.faviconUrl} 
                              alt="favicon"
                              style={{ width: 24, height: 24 }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.setAttribute('style', 'display: block');
                              }}
                            />
                          ) : null}
                          <LinkIcon 
                            sx={{ 
                              fontSize: 24, 
                              color: theme.palette.primary.main,
                              display: link.faviconUrl ? 'none' : 'block',
                            }} 
                          />
                        </Box>

                        {/* Link info */}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'medium',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {link.title || 'Lien sans titre'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'block',
                            }}
                          >
                            {link.url}
                          </Typography>
                        </Box>

                        {/* Delete button */}
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(link.id);
                          }}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: theme.palette.error.main,
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Comments section (placeholder) */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CommentIcon />
                <Typography variant="subtitle2">
                  Commentaires ({card?.comments?.length || 0})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Fonctionnalité à venir : système de commentaires avec notifications
              </Typography>
            </AccordionDetails>
          </Accordion>
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
