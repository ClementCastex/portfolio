import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
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
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { KanbanBoard as KanbanBoardType } from '../../types';
import KanbanColumn from '../KanbanColumn';
import KanbanCardModal from '../KanbanCardModal';
import { createColumn, updateColumn, deleteColumn, updateCard, moveCard } from '../../store/slices/kanbanSlice';

interface KanbanBoardProps {
  board: KanbanBoardType;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ board }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleCreateCard = (columnId: number) => {
    setSelectedColumnId(columnId);
    setSelectedCard(null);
    setCardModalOpen(true);
  };

  const handleEditCard = (card: any) => {
    setSelectedCard(card);
    setCardModalOpen(true);
  };

  const handleCreateColumn = () => {
    if (newColumnName.trim()) {
      dispatch(createColumn({ 
        kanbanId: board.id, 
        name: newColumnName.trim(),
        position: board.columns.length 
      }) as any);
      setColumnModalOpen(false);
      setNewColumnName('');
    }
  };

  const handleMoveCard = (moveData: { cardId: number; fromColumnId: number; toColumnId: number; newPosition: number }) => {
    // Optimistic update
    dispatch(moveCard(moveData));
    
    // API call to persist the change
    dispatch(updateCard({
      id: moveData.cardId,
      columnId: moveData.toColumnId,
      position: moveData.newPosition,
    }) as any);
  };

  const handleEditColumn = (columnId: number, newName: string) => {
    dispatch(updateColumn({ id: columnId, name: newName }) as any);
  };

  const handleDeleteColumn = (columnId: number) => {
    dispatch(deleteColumn(columnId) as any);
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Board content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 3,
          display: 'flex',
          gap: 3,
          minHeight: 0,
        }}
      >
        {board.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onCreateCard={() => handleCreateCard(column.id)}
            onEditCard={handleEditCard}
            onMoveCard={handleMoveCard}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}

        {/* Add Column Button */}
        <Paper
          sx={{
            minWidth: 280,
            height: 'fit-content',
            p: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
            border: 2,
            borderStyle: 'dashed',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          onClick={() => setColumnModalOpen(true)}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 2,
            }}
          >
            <AddIcon color="primary" />
            <Typography color="primary" fontWeight="medium">
              Ajouter une colonne
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Card Modal */}
      <KanbanCardModal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        card={selectedCard}
        columnId={selectedColumnId}
        board={board}
      />

      {/* Add Column Modal */}
      <Dialog open={columnModalOpen} onClose={() => setColumnModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une colonne</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la colonne"
            fullWidth
            variant="outlined"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Ex: En révision, Tests, Déployé..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnModalOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateColumn} 
            variant="contained" 
            disabled={!newColumnName.trim()}
            sx={{ color: 'white' }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanBoard;
