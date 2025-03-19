import React from 'react';
import { Box, Typography, Button, Container, Grid, IconButton, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import BrushIcon from '@mui/icons-material/Brush';
import WebIcon from '@mui/icons-material/Web';
import SchoolIcon from '@mui/icons-material/School';
import { keyframes } from '@mui/system';

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mb: 8
      }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Je suis Clément
            </Typography>
            <Typography variant="h2" sx={{ color: theme => theme.palette.primary.main, mb: 3, fontWeight: 'bold' }}>
              Étudiant dans le Développement Web
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px' }}>
              Actuellement en première année de la formation Chef de Projet Digital, je suis particulièrement
              attiré par la communication graphique. J'ai réalisé des dessins numériques sur Krita ainsi que
              des dessins sur papier dans le cadre d'activités extra-scolaires pendant un an. Créatif,
              imaginatif et curieux, j'ai une forte volonté de découvrir le développement web, raison pour
              laquelle j'ai entrepris la formation à la Normandie Web School.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              alignItems: 'center',
              width: '100%',
              gap: 8
            }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  href="https://github.com/ClementCastex" 
                  target="_blank" 
                  sx={{ 
                    width: 60,
                    height: 60,
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: theme => theme.palette.secondary.main,
                    }
                  }}
                >
                  <GitHubIcon sx={{ fontSize: 35 }} />
                </IconButton>
                <IconButton 
                  href="https://www.linkedin.com/in/clément-castex/" 
                  target="_blank" 
                  sx={{ 
                    width: 60,
                    height: 60,
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: theme => theme.palette.secondary.main,
                    }
                  }}
                >
                  <LinkedInIcon sx={{ fontSize: 35 }} />
                </IconButton>
                <IconButton 
                  href="https://www.instagram.com/clement_castex/" 
                  target="_blank" 
                  sx={{ 
                    width: 60,
                    height: 60,
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: theme => theme.palette.secondary.main,
                    }
                  }}
                >
                  <InstagramIcon sx={{ fontSize: 35 }} />
                </IconButton>
                <IconButton 
                  href="mailto:ccastex@normandiewebschool.fr"
                  sx={{ 
                    width: 60,
                    height: 60,
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: theme => theme.palette.secondary.main,
                    }
                  }}
                >
                  <EmailIcon sx={{ fontSize: 35 }} />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText,
                  '&:hover': { backgroundColor: theme => theme.palette.primary.dark },
                }}
                onClick={() => navigate('/about')}
              >
                Me Découvrir
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/images/Profil-Picture.webp"
              alt="ClémentProfil-Picture"
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Services Section */}
      <Box sx={{ width: '100%', mb: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 8, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Mes Compétences
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: theme => `${theme.palette.primary.main}15`,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              border: theme => `1px solid ${theme.palette.primary.main}40`,
              '&:hover': {
                transform: 'translateY(-10px)',
                backgroundColor: theme => `${theme.palette.primary.main}25`,
                border: theme => `1px solid ${theme.palette.primary.main}`,
              }
            }}>
              <WebIcon sx={{ 
                fontSize: 100, 
                color: theme => theme.palette.primary.main, 
                mb: 4,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(10deg)'
                }
              }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Développement Web
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Création de sites web modernes et responsifs en utilisant les dernières technologies comme React et TypeScript.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: theme => `${theme.palette.primary.main}15`,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              border: theme => `1px solid ${theme.palette.primary.main}40`,
              '&:hover': {
                transform: 'translateY(-10px)',
                backgroundColor: theme => `${theme.palette.primary.main}25`,
                border: theme => `1px solid ${theme.palette.primary.main}`,
              }
            }}>
              <BrushIcon sx={{ 
                fontSize: 100, 
                color: theme => theme.palette.primary.main, 
                mb: 4,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(10deg)'
                }
              }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Design Graphique
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Création de designs numériques et illustrations sur Krita, alliant créativité et technique.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 6,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: theme => `${theme.palette.primary.main}15`,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              border: theme => `1px solid ${theme.palette.primary.main}40`,
              '&:hover': {
                transform: 'translateY(-10px)',
                backgroundColor: theme => `${theme.palette.primary.main}25`,
                border: theme => `1px solid ${theme.palette.primary.main}`,
              }
            }}>
              <SchoolIcon sx={{ 
                fontSize: 100, 
                color: theme => theme.palette.primary.main, 
                mb: 4,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(10deg)'
                }
              }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Formation
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Étudiant en Bachelor Chef de Projet Digital à la Normandie Web School, en constante évolution.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 