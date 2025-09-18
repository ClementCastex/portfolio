import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { KanbanColumn as KanbanColumnType, KanbanCard } from '../../types';
import KanbanCardComponent from '../KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCreateCard: () => void;
  onEditCard: (card: KanbanCard) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onCreateCard, onEditCard }) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

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
    
    // TODO: Handle card drop logic
    const cardId = e.dataTransfer.getData('cardId');
    console.log('Dropped card', cardId, 'in column', column.id);
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
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
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
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {column.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {column.cards?.length || 0}
          </Typography>
          <IconButton size="small">
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
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          Ajouter une carte
        </Button>
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
