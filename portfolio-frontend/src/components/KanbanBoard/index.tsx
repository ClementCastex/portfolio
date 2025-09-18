import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
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

interface KanbanBoardProps {
  board: KanbanBoardType;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ board }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const handleCreateCard = (columnId: number) => {
    setSelectedColumnId(columnId);
    setSelectedCard(null);
    setCardModalOpen(true);
  };

  const handleEditCard = (card: any) => {
    setSelectedCard(card);
    setCardModalOpen(true);
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
          onClick={() => {
            // TODO: Add new column
            console.log('Add new column');
          }}
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
    </Box>
  );
};

export default KanbanBoard;
