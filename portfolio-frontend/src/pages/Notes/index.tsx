import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  FileCopy as DuplicateIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Label as TagIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  duplicateNote,
  fetchTags,
  setActiveNote,
  updateNoteContent,
  setUnsavedChanges,
} from '../../store/slices/notesSlice';
import NoteEditor from '../../components/NoteEditor';
import NoteTagManager from '../../components/NoteTagManager';

const Notes: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { notes, tags, activeNoteId, loading, unsavedChanges } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const activeNote = notes.find(note => note.id === activeNoteId);

  // Load notes and tags on mount
  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) {
      dispatch(fetchNotes({}) as any);
      dispatch(fetchTags() as any);
    }
  }, [dispatch, user]);

  // Auto-save functionality with debounce
  const debouncedSave = useCallback(
    debounce((noteId: number, data: any) => {
      dispatch(updateNote({ id: noteId, ...data }) as any);
    }, 800),
    [dispatch]
  );

  const handleCreateNote = () => {
    console.log('🚀 Creating new note...');
    console.log('User:', user);
    console.log('Token available:', !!user);
    dispatch(createNote({ title: 'Nouvelle note' }) as any)
      .then((result: any) => {
        console.log('✅ Note created:', result);
      })
      .catch((error: any) => {
        console.error('❌ Error creating note:', error);
      });
  };

  const handleNoteChange = (noteId: number, field: 'title' | 'contentHtml', value: string) => {
    dispatch(updateNoteContent({ id: noteId, [field]: value }));
    debouncedSave(noteId, { [field]: value });
  };

  const handleDeleteNote = (noteId: number) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      dispatch(deleteNote(noteToDelete) as any);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleDuplicateNote = (noteId: number) => {
    dispatch(duplicateNote(noteId) as any);
  };

  const handleExportPDF = (noteId: number) => {
    // TODO: Implement PDF export
    console.log('Export PDF for note:', noteId);
  };

  const handleExportPNG = (noteId: number) => {
    // TODO: Implement PNG export
    console.log('Export PNG for note:', noteId);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.contentHtml.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTagId || 
      note.tags.some(tag => tag.id === selectedTagId);
    
    return matchesSearch && matchesTag;
  });

  if (!user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Accès refusé. Cette section est réservée aux administrateurs.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with tabs */}
      <Paper 
        elevation={1} 
        sx={{ 
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 1 }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" sx={{ 
            mr: 2, 
            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary 
          }}>
            Bloc-notes
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {notes.length > 0 ? (
              <Tabs
                value={activeNoteId}
                onChange={(_, newValue) => dispatch(setActiveNote(newValue))}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  flexGrow: 1,
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '& .MuiTab-root': {
                    color: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.common.white, 0.7)
                      : alpha(theme.palette.text.primary, 0.7),
                    '&.Mui-selected': {
                      color: theme.palette.mode === 'dark' 
                        ? theme.palette.common.white
                        : theme.palette.text.primary,
                    },
                    '&:hover': {
                      color: theme.palette.mode === 'dark' 
                        ? theme.palette.common.white
                        : theme.palette.text.primary,
                    },
                  },
                }}
              >
                {notes.map((note) => (
                  <Tab
                    key={note.id}
                    value={note.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{note.title}</span>
                        {unsavedChanges[note.id] && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.warning.main,
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          sx={{ ml: 0.5, p: 0.25 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    sx={{
                      minWidth: 120,
                      maxWidth: 200,
                      textTransform: 'none',
                    }}
                  />
                ))}
              </Tabs>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Aucune note ouverte
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{ ml: 2, color: 'white' }}
          >
            Nouvelle note
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? 320 : 0,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '& .MuiDrawer-paper': {
              width: 320,
              position: 'relative',
              border: 'none',
              borderRight: 1,
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Rechercher dans les notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filtrer par tag :
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label="Tous"
                onClick={() => setSelectedTagId(null)}
                color={selectedTagId === null ? 'primary' : 'default'}
                size="small"
              />
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => setSelectedTagId(tag.id)}
                  color={selectedTagId === tag.id ? 'primary' : 'default'}
                  size="small"
                  sx={{
                    backgroundColor: selectedTagId === tag.id ? tag.colorHex : 'default',
                    color: selectedTagId === tag.id ? 'white' : 'inherit',
                  }}
                />
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Toutes mes notes ({filteredNotes.length})
            </Typography>
            <List dense>
              {filteredNotes.map((note) => (
                <ListItem
                  key={note.id}
                  disablePadding
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemButton
                    selected={note.id === activeNoteId}
                    onClick={() => dispatch(setActiveNote(note.id))}
                    sx={{
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemText
                      primary={note.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </Typography>
                          {note.tags.length > 0 && (
                            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                              {note.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag.id}
                                  label={tag.name}
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: '0.6rem',
                                    backgroundColor: tag.colorHex,
                                    color: 'white',
                                  }}
                                />
                              ))}
                            </Stack>
                          )}
                        </Box>
                      }
                    />
                    {unsavedChanges[note.id] && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.warning.main,
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main content */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            width: sidebarOpen ? 'calc(100% - 320px)' : '100%',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {activeNote ? (
            <>
              {/* Note actions bar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <TextField
                  value={activeNote.title}
                  onChange={(e) => handleNoteChange(activeNote.id, 'title', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    flexGrow: 1, 
                    mr: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.common.white, 0.3)
                          : alpha(theme.palette.text.primary, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.common.white, 0.5)
                          : alpha(theme.palette.text.primary, 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.mode === 'dark' 
                        ? theme.palette.common.white
                        : theme.palette.text.primary,
                      fontWeight: 500,
                    },
                  }}
                />

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Dupliquer">
                    <IconButton onClick={() => handleDuplicateNote(activeNote.id)}>
                      <DuplicateIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exporter en PDF">
                    <IconButton onClick={() => handleExportPDF(activeNote.id)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDeleteNote(activeNote.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Note editor */}
              <NoteEditor
                note={activeNote}
                onChange={(content) => handleNoteChange(activeNote.id, 'contentHtml', content)}
              />
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                Aucune note sélectionnée
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Créez une nouvelle note ou sélectionnez-en une existante dans la barre latérale.
              </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNote}
                  size="large"
                  sx={{ color: 'white' }}
                >
                  Créer ma première note
                </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer la note</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ color: 'white' }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default Notes;
