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
  Badge,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  ViewWeek as WeekIcon,
  ViewModule as MonthIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCalendarEvents } from '../../store/slices/kanbanSlice';

// Styled components pour un look moderne
const ModernCalendarPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.spacing(2),
}));

const CalendarDay = styled(Box)(({ theme }) => ({
  height: 120,
  padding: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const EventCard = styled(Box)(({ theme, isOverdue }: { theme: any; isOverdue: boolean }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  backgroundColor: isOverdue ? theme.palette.error.main : theme.palette.primary.main,
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${alpha('#fff', 0.1)} 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 4px 15px ${alpha(isOverdue ? theme.palette.error.main : theme.palette.primary.main, 0.4)}`,
  },
}));

const CalendarView: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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
    setSelectedDay(new Date());
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
        isSelected: selectedDay?.toDateString() === date.toDateString(),
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

  // Statistiques des événements
  const totalEvents = calendarEvents.length;
  const overdueEvents = calendarEvents.filter(event => event.isOverdue).length;
  const todayEvents = calendarEvents.filter(event => 
    new Date(event.dueAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3, flexGrow: 1, minHeight: '100vh' }}>
        {/* Header moderne avec statistiques */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Calendrier des échéances
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Statistiques */}
              <Stack direction="row" spacing={2}>
                <Tooltip title="Événements aujourd'hui">
                  <Badge badgeContent={todayEvents} color="info">
                    <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
                      <TodayIcon fontSize="small" />
                    </Avatar>
                  </Badge>
                </Tooltip>
                
                <Tooltip title="Événements en retard">
                  <Badge badgeContent={overdueEvents} color="error">
                    <Avatar sx={{ bgcolor: theme.palette.error.main, width: 40, height: 40 }}>
                      <WarningIcon fontSize="small" />
                    </Avatar>
                  </Badge>
                </Tooltip>

                <Tooltip title="Total des événements ce mois">
                  <Badge badgeContent={totalEvents} color="primary">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                      <EventIcon fontSize="small" />
                    </Avatar>
                  </Badge>
                </Tooltip>
              </Stack>

              {/* Contrôles */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant={viewMode === 'month' ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<MonthIcon />}
                  onClick={() => setViewMode('month')}
                >
                  Mois
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<TodayIcon />}
                  onClick={goToToday}
                  size="small"
                  sx={{
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  Aujourd'hui
                </Button>
                
                <IconButton 
                  onClick={() => navigateMonth('prev')}
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                
                <IconButton 
                  onClick={() => navigateMonth('next')}
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* Calendrier moderne */}
        <ModernCalendarPaper elevation={8} sx={{ p: 3 }}>
          {/* En-têtes des jours */}
          <Grid container sx={{ mb: 1 }}>
            {dayNames.map((dayName, index) => (
              <Grid item xs key={dayName}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: index === 0 || index === 6 ? theme.palette.secondary.main : 'text.primary',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {dayName}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Grille du calendrier */}
          <Grid container>
            {calendarDays.map((day, index) => (
              <Grid item xs key={index}>
                <Zoom in timeout={100 + index * 10}>
                  <CalendarDay
                    onClick={() => setSelectedDay(day.date)}
                    sx={{
                      backgroundColor: day.isSelected
                        ? alpha(theme.palette.primary.main, 0.15)
                        : day.isCurrentMonth 
                          ? (day.isToday 
                              ? alpha(theme.palette.primary.main, 0.1) 
                              : 'transparent')
                          : alpha(theme.palette.grey[500], 0.05),
                      border: day.isSelected 
                        ? `2px solid ${theme.palette.primary.main}`
                        : day.isToday
                          ? `2px solid ${theme.palette.secondary.main}`
                          : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    {/* Numéro du jour */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: day.isToday ? 'bold' : day.isSelected ? 'semibold' : 'normal',
                          color: day.isCurrentMonth 
                            ? (day.isToday 
                                ? theme.palette.secondary.main 
                                : day.isSelected
                                  ? theme.palette.primary.main
                                  : 'white')
                            : 'text.disabled',
                          fontSize: day.isToday || day.isSelected ? '1rem' : '0.9rem',
                        }}
                      >
                        {day.date.getDate()}
                      </Typography>
                      
                      {day.events.length > 0 && (
                        <Tooltip title={`${day.events.length} événement(s)`}>
                          <Badge 
                            badgeContent={day.events.length} 
                            color={day.events.some((e: any) => e.isOverdue) ? 'error' : 'primary'}
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: '16px', height: '16px' } }}
                          >
                            <ScheduleIcon fontSize="small" color="action" />
                          </Badge>
                        </Tooltip>
                      )}
                    </Box>

                    {/* Événements du jour */}
                    <Stack spacing={0.5}>
                      {day.events.slice(0, 3).map((event: any, eventIndex: number) => (
                        <Tooltip key={event.id} title={`${event.title} - ${event.isOverdue ? 'En retard' : 'Planifié'}`}>
                          <EventCard
                            theme={theme}
                            isOverdue={event.isOverdue}
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open card modal
                              console.log('Open event:', event);
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 'medium',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              {event.isOverdue && <WarningIcon sx={{ fontSize: '0.8rem' }} />}
                              <Box
                                component="span"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {event.title}
                              </Box>
                            </Typography>
                          </EventCard>
                        </Tooltip>
                      ))}
                      
                      {day.events.length > 3 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: '0.65rem',
                            textAlign: 'center',
                            fontWeight: 'medium',
                            py: 0.5,
                          }}
                        >
                          +{day.events.length - 3} autres
                        </Typography>
                      )}
                    </Stack>
                  </CalendarDay>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </ModernCalendarPaper>

        {/* Panneau latéral des détails du jour sélectionné */}
        {selectedDay && (
          <Fade in timeout={500}>
            <ModernCalendarPaper elevation={4} sx={{ mt: 3, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Événements du {selectedDay.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              
              {calendarEvents.filter(event => 
                new Date(event.dueAt).toDateString() === selectedDay.toDateString()
              ).length > 0 ? (
                <Stack spacing={2}>
                  {calendarEvents
                    .filter(event => new Date(event.dueAt).toDateString() === selectedDay.toDateString())
                    .map((event: any) => (
                      <Card 
                        key={event.id}
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                          border: `1px solid ${event.isOverdue ? theme.palette.error.main : theme.palette.primary.main}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(event.isOverdue ? theme.palette.error.main : theme.palette.primary.main, 0.25)}`,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: event.isOverdue ? theme.palette.error.main : theme.palette.primary.main,
                              width: 40,
                              height: 40,
                            }}>
                              {event.isOverdue ? <WarningIcon /> : <EventIcon />}
                            </Avatar>
                            
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                {event.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {event.isOverdue ? 'En retard' : 'Planifié'}
                              </Typography>
                            </Box>
                            
                            <Chip
                              label={event.isOverdue ? 'RETARD' : 'PLANIFIÉ'}
                              color={event.isOverdue ? 'error' : 'primary'}
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    Aucun événement prévu pour cette date
                  </Typography>
                </Box>
              )}
            </ModernCalendarPaper>
          </Fade>
        )}
      </Box>
    </Fade>
  );
};

export default CalendarView;
