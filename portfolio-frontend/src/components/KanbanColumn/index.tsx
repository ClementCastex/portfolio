import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { KanbanColumn as KanbanColumnType, KanbanCard } from '../../types';
import KanbanCardComponent from '../KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCreateCard: () => void;
  onEditCard: (card: KanbanCard) => void;
  onMoveCard?: (moveData: { cardId: number; fromColumnId: number; toColumnId: number; newPosition: number }) => void;
  onEditColumn?: (columnId: number, newName: string) => void;
  onDeleteColumn?: (columnId: number) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onCreateCard, onEditCard, onMoveCard, onEditColumn, onDeleteColumn }) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

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
    
    const cardId = parseInt(e.dataTransfer.getData('cardId'));
    const fromColumnId = parseInt(e.dataTransfer.getData('fromColumnId'));
    
    if (cardId && fromColumnId !== column.id) {
      // Dispatch move card action
      const moveCardAction = {
        cardId,
        fromColumnId,
        toColumnId: column.id,
        newPosition: column.cards?.length || 0,
      };
      
      // Import dispatch from props or context
      if (onMoveCard) {
        onMoveCard(moveCardAction);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditColumn = () => {
    setNewColumnName(column.name);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteColumn = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmEditColumn = () => {
    if (newColumnName.trim() && onEditColumn) {
      onEditColumn(column.id, newColumnName.trim());
    }
    setEditDialogOpen(false);
    setNewColumnName('');
  };

  const confirmDeleteColumn = () => {
    if (onDeleteColumn) {
      onDeleteColumn(column.id);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Paper
      sx={{
        minWidth: 280,
        maxWidth: 280,
        height: 'fit-content',
        maxHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.9) 
          : theme.palette.background.paper,
        border: isDragOver ? 2 : 1,
        borderColor: isDragOver ? theme.palette.primary.main : 'divider',
        transition: 'all 0.2s',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ 
          color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary, 
          fontWeight: 'bold' 
        }}>
          {column.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {column.cards?.length || 0}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 1,
          minHeight: 100,
        }}
      >
        <Stack spacing={1}>
          {column.cards?.map((card) => (
            <KanbanCardComponent
              key={card.id}
              card={card}
              columnId={column.id}
              onEdit={() => onEditCard(card)}
            />
          ))}
        </Stack>
      </Box>

      {/* Add Card Button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onCreateCard}
          sx={{
            borderStyle: 'dashed',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
            },
          }}
        >
          Ajouter une carte
        </Button>
      </Box>

      {/* Column Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditColumn}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Renommer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteColumn} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Column Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Renommer la colonne</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la colonne"
            fullWidth
            variant="outlined"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={confirmEditColumn} variant="contained" disabled={!newColumnName.trim()}>
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Column Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer la colonne</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la colonne "{column.name}" ?
            {column.cards && column.cards.length > 0 && (
              <Typography color="error" sx={{ mt: 1 }}>
                Cette colonne contient {column.cards.length} carte(s). Elles seront supprimées définitivement.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={confirmDeleteColumn} color="error" variant="contained">
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default KanbanColumn;
