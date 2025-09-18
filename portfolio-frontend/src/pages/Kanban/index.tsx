import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Dashboard as KanbanIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import {
  fetchKanbans,
  fetchKanban,
  createKanban,
  updateKanban,
  deleteKanban,
  setActiveBoard,
} from '../../store/slices/kanbanSlice';
import KanbanBoard from '../../components/KanbanBoard';
import CalendarView from '../../components/CalendarView';

const Kanban: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boards, activeBoard, loading } = useSelector((state: RootState) => state.kanban);
  const { user } = useSelector((state: RootState) => state.auth);

  const [view, setView] = useState<'boards' | 'kanban' | 'calendar'>('boards');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<number | null>(null);
  const [editBoardDialogOpen, setEditBoardDialogOpen] = useState(false);
  const [editBoardName, setEditBoardName] = useState('');

  // Load kanbans on mount
  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) {
      dispatch(fetchKanbans({ search: searchQuery, sortBy }) as any);
    }
  }, [dispatch, user, searchQuery, sortBy]);

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      dispatch(createKanban({ name: newBoardName.trim() }) as any);
      setCreateDialogOpen(false);
      setNewBoardName('');
    }
  };

  const handleOpenBoard = (board: any) => {
    // Recharger le tableau complet avec toutes les données
    dispatch(fetchKanban(board.id) as any).then((result: any) => {
      if (result.payload) {
        dispatch(setActiveBoard(result.payload));
        setView('kanban');
      }
    });
  };

  const handleDeleteBoard = (boardId: number) => {
    setBoardToDelete(boardId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (boardToDelete) {
      dispatch(deleteKanban(boardToDelete) as any);
      setDeleteDialogOpen(false);
      setBoardToDelete(null);
    }
  };

  const handleEditBoard = () => {
    if (activeBoard) {
      setEditBoardName(activeBoard.name);
      setEditBoardDialogOpen(true);
    }
  };

  const confirmEditBoard = () => {
    if (activeBoard && editBoardName.trim()) {
      dispatch(updateKanban({ id: activeBoard.id, name: editBoardName.trim() }) as any);
      setEditBoardDialogOpen(false);
      setEditBoardName('');
    }
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Accès refusé. Cette section est réservée aux administrateurs.
        </Typography>
      </Box>
    );
  }

  // Vue Kanban
  if (view === 'kanban' && activeBoard) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0,
            position: 'relative',
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            left: 16, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Button 
              variant="outlined" 
              onClick={() => setView('boards')}
            >
              ← Retour aux tableaux
            </Button>
            <Typography variant="h5" sx={{ 
              color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary 
            }}>
              {activeBoard.name}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleEditBoard}
              sx={{ color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => setView('calendar')}
          >
            Vue Calendrier
          </Button>
        </Paper>
        <KanbanBoard board={activeBoard} />
      </Box>
    );
  }

  // Vue Calendrier
  if (view === 'calendar') {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setView('boards')}
            >
              ← Retour aux tableaux
            </Button>
            <Typography variant="h5" sx={{ color: 'white' }}>
              Calendrier des échéances
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<KanbanIcon />}
            onClick={() => setView(activeBoard ? 'kanban' : 'boards')}
          >
            {activeBoard ? 'Vue Kanban' : 'Mes tableaux'}
          </Button>
        </Paper>
        <CalendarView />
      </Box>
    );
  }

  // Vue principale - Liste des tableaux
  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary, 
          fontWeight: 'bold' 
        }}>
          Mes Tableaux Kanban
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => setView('calendar')}
          >
            Vue Calendrier
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ color: 'white' }}
          >
            Nouveau tableau
          </Button>
        </Stack>
      </Box>

      {/* Search and filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Rechercher un tableau..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Trier par"
          >
            <MenuItem value="recent">Plus récent</MenuItem>
            <MenuItem value="alphabetical">Alphabétique</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Boards grid */}
      <Grid container spacing={3}>
        {filteredBoards.map((board) => (
          <Grid item xs={12} sm={6} md={4} key={board.id}>
            <Card
              sx={{
                height: 200,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: 1,
                borderColor: alpha(theme.palette.primary.main, 0.2),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.primary.main,
                },
              }}
              onClick={() => handleOpenBoard(board)}
            >
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary, 
                    fontWeight: 'bold' 
                  }}>
                    {board.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditBoardName(board.name);
                        setEditBoardDialogOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {board.columns?.length || 0} colonnes
                  </Typography>

                  {/* Preview of columns */}
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {board.columns?.slice(0, 3).map((column) => (
                      <Chip
                        key={column.id}
                        label={`${column.name} (${column.cards?.length || 0})`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          color: 'white',
                        }}
                      />
                    ))}
                    {(board.columns?.length || 0) > 3 && (
                      <Chip
                        label={`+${(board.columns?.length || 0) - 3} autres`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.grey[500], 0.2),
                          color: 'text.secondary',
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredBoards.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {searchQuery ? 'Aucun tableau trouvé' : 'Aucun tableau créé'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              size="large"
              sx={{ color: 'white' }}
            >
              Créer mon premier tableau
            </Button>
          )}
        </Box>
      )}

      {/* Create Board Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouveau tableau</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du tableau"
            fullWidth
            variant="outlined"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Ex: Projet Portfolio, Tâches personnelles..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateBoard} 
            variant="contained" 
            disabled={!newBoardName.trim()}
            sx={{ color: 'white' }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Board Dialog */}
      <Dialog open={editBoardDialogOpen} onClose={() => setEditBoardDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Renommer le tableau</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du tableau"
            fullWidth
            variant="outlined"
            value={editBoardName}
            onChange={(e) => setEditBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditBoardDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={confirmEditBoard} 
            variant="contained" 
            disabled={!editBoardName.trim()}
            sx={{ color: 'white' }}
          >
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer le tableau</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce tableau ? Toutes les cartes et données seront perdues définitivement.
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
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Kanban;
