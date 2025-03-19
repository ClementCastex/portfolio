import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import BrushIcon from '@mui/icons-material/Brush';
import WebIcon from '@mui/icons-material/Web';
import SchoolIcon from '@mui/icons-material/School';
import GradientTitle from '../../components/GradientTitle';
import SkillCard from '../../components/SkillCard';
import SocialButton from '../../components/SocialButton';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { href: "https://github.com/ClementCastex", icon: <GitHubIcon />, ariaLabel: "GitHub" },
    { href: "https://www.linkedin.com/in/clément-castex/", icon: <LinkedInIcon />, ariaLabel: "LinkedIn" },
    { href: "https://www.instagram.com/clement_castex/", icon: <InstagramIcon />, ariaLabel: "Instagram" },
    { href: "mailto:ccastex@normandiewebschool.fr", icon: <EmailIcon />, ariaLabel: "Email" }
  ];

  const skills = [
    {
      icon: <WebIcon />,
      title: "Développement Web",
      description: "Création de sites web modernes et responsifs en utilisant les dernières technologies comme React et TypeScript."
    },
    {
      icon: <BrushIcon />,
      title: "Design Graphique",
      description: "Création de designs numériques et illustrations sur Krita, alliant créativité et technique."
    },
    {
      icon: <SchoolIcon />,
      title: "Formation",
      description: "Étudiant en Bachelor Chef de Projet Digital à la Normandie Web School, en constante évolution."
    }
  ];

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
            <GradientTitle>
              Étudiant dans le Développement Web
            </GradientTitle>
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
                {socialLinks.map((link, index) => (
                  <SocialButton
                    key={index}
                    href={link.href}
                    icon={link.icon}
                    ariaLabel={link.ariaLabel}
                  />
                ))}
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

      {/* Skills Section */}
      <Box sx={{ width: '100%', mb: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 8, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Mes Compétences
        </Typography>
        <Grid container spacing={6}>
          {skills.map((skill, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SkillCard {...skill} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 