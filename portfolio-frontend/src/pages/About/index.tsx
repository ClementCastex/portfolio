import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Tab,
  Tabs,
  alpha,
} from '@mui/material';
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  Web as WebIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  Brush as BrushIcon,
  Description as DescriptionIcon,
  ArrowForward as ArrowForwardIcon,
  Palette as PaletteIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  EmojiEvents as EmojiEventsIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: React.ReactNode;
}

const skills: Skill[] = [
  { name: 'React', level: 90, category: 'Frontend', icon: <WebIcon color="primary" /> },
  { name: 'TypeScript', level: 85, category: 'Frontend', icon: <CodeIcon color="primary" /> },
  { name: 'Material-UI', level: 80, category: 'Frontend', icon: <PaletteIcon color="primary" /> },
  { name: 'Symfony', level: 85, category: 'Backend', icon: <StorageIcon color="primary" /> },
  { name: 'PHP', level: 85, category: 'Backend', icon: <CodeIcon color="primary" /> },
  { name: 'MySQL', level: 80, category: 'Backend', icon: <StorageIcon color="primary" /> },
  { name: 'Docker', level: 75, category: 'DevOps', icon: <DashboardIcon color="primary" /> },
  { name: 'Git', level: 85, category: 'DevOps', icon: <CodeIcon color="primary" /> },
];

const About: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    // Déclenche les animations après le chargement
    setTimeout(() => {
      setAnimationComplete(true);
    }, 300);
  }, []);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getSkillColor = (level: number) => {
    if (level >= 85) return 'success';
    if (level >= 70) return 'info';
    if (level >= 50) return 'warning';
    return 'error';
  };

  const renderSkills = () => {
    const categories = Array.from(new Set(skills.map(skill => skill.category)));
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          '&::after': {
            content: '""',
            display: 'block',
            height: '3px',
            width: '50px',
            backgroundColor: '#5B348B',
            marginLeft: '10px',
          }
        }}>
          <EmojiEventsIcon sx={{ mr: 1, color: '#5B348B' }} /> 
          Mes compétences
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} md={4} key={category}>
              <Grow in={animationComplete} style={{ transformOrigin: '0 0 0' }} timeout={(index + 1) * 300}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="#5B348B" fontWeight="bold">
                      {category}
                    </Typography>
                    <Stack spacing={2.5}>
                      {skills
                        .filter(skill => skill.category === category)
                        .map(skill => (
                          <Box key={skill.name}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {skill.icon}
                                <Typography variant="body1" sx={{ ml: 1 }}>
                                  {skill.name}
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold">
                                {skill.level}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={skill.level} 
                              color={getSkillColor(skill.level) as 'success' | 'info' | 'warning' | 'error'}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: theme => 
                                  theme.palette.mode === 'dark' 
                                    ? alpha(theme.palette.background.paper, 0.15)
                                    : alpha(theme.palette.background.paper, 0.5)
                              }} 
                            />
                          </Box>
                        ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  console.log('Current user state:', user);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 8 }}>
        {/* Header avec profil */}
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            position: 'relative', 
            textAlign: 'center', 
            mb: 8,
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  backgroundColor: '#5B348B',
                  borderRadius: '2px'
                }
              }}
            >
              À propos de moi
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: '800px', mx: 'auto', mt: 3 }}
            >
              Découvrez mon parcours, mes compétences et mes passions dans le développement web
            </Typography>
          </Box>
        </Fade>

        {/* Section Profile - Modernisée */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1000}>
              <Card 
                elevation={4} 
                sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <Box sx={{ 
                  height: '120px', 
                  bgcolor: '#5B348B',
                  position: 'relative'
                }}/>
                <CardContent sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  mt: -8
                }}>
                  <Avatar
                    sx={{
                      width: 150,
                      height: 150,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#5B348B',
                      border: '5px solid white',
                      boxShadow: 3
                    }}
                  >
                    CC
                  </Avatar>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Castex Clement
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Étudiant en Développement Web
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Bachelor Chef de Projet Digital - Normandie Web School
                  </Typography>
                  
                  {/* Social Links */}
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="center" 
                    sx={{ mt: 2, mb: 1 }}
                  >
                    <Tooltip title="GitHub">
                      <IconButton 
                        sx={{ 
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#5B348B',
                            color: 'white'
                          }
                        }}
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <IconButton 
                        sx={{ 
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#5B348B',
                            color: 'white'
                          }
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Email">
                      <IconButton 
                        sx={{ 
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#5B348B',
                            color: 'white'
                          }
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ 
                      mt: 2,
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#5B348B',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : '#4a2a70',
                      },
                      borderRadius: 2
                    }}
                  >
                    Télécharger CV
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grow in={true} timeout={1200}>
              <Card 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ 
                      color: theme => theme.palette.mode === 'dark' ? '#CCAA1D' : '#5B348B',
                      display: 'flex',
                      alignItems: 'center',
                      '&::after': {
                        content: '""',
                        display: 'block',
                        height: '3px',
                        width: '60px',
                        backgroundColor: '#5B348B',
                        marginLeft: '10px',
                      }
                    }}
                  >
                    Bienvenue sur mon Portfolio
                  </Typography>
                  
                  <Typography 
                    paragraph 
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.6,
                      mb: 3
                    }}
                  >
                    Fasciné par le monde du Développement web, j'ai choisi de me lancer dans l'aventure de la Normandie Web School pour explorer cette passion naissante. Engagé en première année pour obtenir un Bachelor de Chef de Projet Digital, j'ai également été séduit par les intrications de la Communication Graphique, une fusion harmonieuse de technologie et d'esthétique.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip 
                      label="Développement Web" 
                      icon={<CodeIcon />} 
                      color="primary" 
                      variant={isDarkMode ? "filled" : "outlined"} 
                    />
                    <Chip 
                      label="Design Graphique" 
                      icon={<BrushIcon />} 
                      color="secondary" 
                      variant={isDarkMode ? "filled" : "outlined"} 
                    />
                    <Chip 
                      label="UI/UX Design" 
                      icon={<PaletteIcon />} 
                      color="info" 
                      variant={isDarkMode ? "filled" : "outlined"} 
                    />
                    <Chip 
                      label="Chef de Projet" 
                      icon={<DashboardIcon />} 
                      color="success" 
                      variant={isDarkMode ? "filled" : "outlined"} 
                    />
                  </Box>
                  
                  <Typography paragraph>
                    Encore en quête de ma voie professionnelle, le métier tels que le Designer Web se profile comme une option prometteuse en accord avec mes passions.
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/projects')}
                    sx={{ 
                      color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                      borderColor: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                      '&:hover': {
                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#4a2a70',
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(91, 52, 139, 0.08)'
                      }
                    }}
                  >
                    Voir mes projets
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Compétences */}
        <Box sx={{ mb: 8 }}>
          {renderSkills()}
        </Box>

        {/* Navigation par onglets pour le parcours */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              '&::after': {
                content: '""',
                display: 'block',
                height: '3px',
                width: '50px',
                backgroundColor: '#5B348B',
                marginLeft: '10px',
              }
            }}
          >
            <TimelineIcon sx={{ mr: 1, color: '#5B348B' }} /> 
            Mon parcours
          </Typography>
          
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab} 
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                },
                '& .Mui-selected': {
                  color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#5B348B',
                },
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <Tab label="Parcours d'apprentissage" icon={<SchoolIcon />} iconPosition="start" />
              <Tab label="Inspirations et Objectifs" icon={<BrushIcon />} iconPosition="start" />
              <Tab label="Origines de mes Passions" icon={<CodeIcon />} iconPosition="start" />
              <Tab label="Ambitions" icon={<EmojiEventsIcon />} iconPosition="start" />
            </Tabs>
            
            <Divider />
            
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Fade in={true}>
                  <Box>
                    <Typography paragraph>
                      De manière indépendante, j'ai plongé dans le monde des dessins numériques sur Krita, puis suivi des cours extrascolaires de dessin papier/numérique pendant un an. Mon ambition était claire : intégrer le design graphique à mes études futures sans en faire pour autant ma profession exclusive. C'est ainsi que je me suis orienté vers le développement web.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Auto-formation en design numérique</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Cours extrascolaires de dessin</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Formation en développement web</Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
              
              {activeTab === 1 && (
                <Fade in={true}>
                  <Box>
                    <Typography paragraph>
                      Mon intérêt pour ce domaine remonte à mes années de collège, avec l'utilisation du logiciel Scratch lors des cours de technologie. Cette passion s'est intensifiée au lycée avec l'option Sciences de l'ingénieur dès la classe de seconde. Notre projet de terminale, la conception d'une application pour « améliorer » un réfrigérateur, nous a permis de donner libre cours à notre imagination, créativité, logique, et esprit d'équipe.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CheckCircleIcon color="info" fontSize="small" />
                      <Typography>Premiers pas avec Scratch au collège</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="info" fontSize="small" />
                      <Typography>Option Sciences de l'ingénieur au lycée</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="info" fontSize="small" />
                      <Typography>Projet d'application innovante en terminale</Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
              
              {activeTab === 2 && (
                <Fade in={true}>
                  <Box>
                    <Typography paragraph>
                      De l'école primaire à aujourd'hui, ma fascination pour les ordinateurs persiste, que ce soit pour le plaisir avec les jeux vidéo entre amis, les vidéos/films/séries, ou la création de dessins. Ma fascination pour l'informatique s'étend à la culture générale, avec ma curiosité nourrie par des vidéos informatives et des cours en ligne, particulièrement pendant le confinement.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CheckCircleIcon color="warning" fontSize="small" />
                      <Typography>Passion précoce pour l'informatique</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="warning" fontSize="small" />
                      <Typography>Autoformation pendant le confinement</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="warning" fontSize="small" />
                      <Typography>Curiosité pour les technologies émergentes</Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
              
              {activeTab === 3 && (
                <Fade in={true}>
                  <Box>
                    <Typography paragraph>
                      Bien que mon intérêt initial pour l'ordinateur ait été centré sur les jeux vidéo, mon ambition actuelle est d'acquérir des compétences pour créer mes propres applications, jeux, sites web et logiciels. Dans un monde où la majorité des gens possèdent un ordinateur, un téléphone ou tout autre objet numérique connecté, je trouve une véritable source de divertissement et de motivation pour apprendre davantage.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Développement d'applications et sites web</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Création de jeux vidéo interactifs</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography>Conception d'interfaces utilisateur innovantes</Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          </Card>
        </Box>

        {/* Section Projets et CV améliorée */}
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            '&::after': {
              content: '""',
              display: 'block',
              height: '3px',
              width: '50px',
              backgroundColor: '#5B348B',
              marginLeft: '10px',
            }
          }}
        >
          <CampaignIcon sx={{ mr: 1, color: '#5B348B' }} /> 
          Découvrez mes travaux
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              title: "Projets Professionnels",
              description: "Découvrez mes projets réalisés lors des cours de la Normandie Web School, accompagnés des logiciels utilisés et des dates de création.",
              icon: <WorkIcon sx={{ fontSize: 40, color: '#5B348B' }} />,
              route: '/projects',
              buttonText: "Voir les projets",
              delay: 100
            },
            {
              title: "Projets Personnels",
              description: "Découvrez mes dessins réalisés lors de cours extrascolaires ou indépendamment, accompagnés des logiciels utilisés et des dates de création.",
              icon: <BrushIcon sx={{ fontSize: 40, color: '#5B348B' }} />,
              route: '/projects',
              buttonText: "Voir les projets",
              delay: 300
            },
            {
              title: "Charte Graphique",
              description: "Découvrez l'évolution de mon identité visuelle, de la conception de mon logo aux choix des couleurs et typographies qui représentent ma personnalité et mes valeurs.",
              icon: <PaletteIcon sx={{ fontSize: 40, color: '#5B348B' }} />,
              route: '/style-guide',
              buttonText: "Voir la charte graphique",
              delay: 500
            }
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow 
                in={animationComplete} 
                style={{ transformOrigin: '0 0 0' }} 
                timeout={800 + item.delay}
              >
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-7px)',
                      boxShadow: 6
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      fontWeight="bold" 
                      align="center"
                      sx={{ color: theme => theme.palette.mode === 'dark' ? '#CCAA1D' : '#5B348B' }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      align="center" 
                      sx={{ 
                        mb: 2, 
                        color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(item.route)}
                      sx={{ 
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#5B348B',
                        '&:hover': {
                          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#4a2a70',
                        },
                        color: 'white'
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  </Box>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About; 