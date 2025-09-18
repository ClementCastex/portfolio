import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCalendarEvents } from '../../store/slices/kanbanSlice';

const CalendarView: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  // Get first and last day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  useEffect(() => {
    const from = firstDayOfMonth.toISOString().split('T')[0];
    const to = lastDayOfMonth.toISOString().split('T')[0];
    
    dispatch(fetchCalendarEvents({ from, to }) as any)
      .then((result: any) => {
        if (result.payload) {
          setCalendarEvents(result.payload);
        }
      });
  }, [dispatch, currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(firstDayOfMonth);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = calendarEvents.filter(event => 
        new Date(event.dueAt).toDateString() === date.toDateString()
      );

      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={goToToday}
            size="small"
          >
            Aujourd'hui
          </Button>
          <IconButton onClick={() => navigateMonth('prev')}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => navigateMonth('next')}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.background.paper, 0.9) }}>
        {/* Day headers */}
        <Grid container>
          {dayNames.map((dayName) => (
            <Grid item xs key={dayName} sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                {dayName}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container>
          {calendarDays.map((day, index) => (
            <Grid item xs key={index} sx={{ height: 120, p: 0.25 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 1,
                  border: 1,
                  borderColor: 'divider',
                  backgroundColor: day.isCurrentMonth 
                    ? (day.isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent')
                    : alpha(theme.palette.grey[500], 0.05),
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: day.isToday ? 'bold' : 'normal',
                    color: day.isCurrentMonth 
                      ? (day.isToday ? theme.palette.primary.main : 'white')
                      : 'text.disabled',
                  }}
                >
                  {day.date.getDate()}
                </Typography>

                {/* Events for this day */}
                <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                  {day.events.slice(0, 2).map((event: any) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: 0.25,
                        borderRadius: 0.5,
                        backgroundColor: event.isOverdue 
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open card modal
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontSize: '0.6rem',
                          fontWeight: 'medium',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {event.title}
                      </Typography>
                    </Box>
                  ))}
                  {day.events.length > 2 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.6rem',
                        textAlign: 'center',
                      }}
                    >
                      +{day.events.length - 2} autres
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CalendarView;
