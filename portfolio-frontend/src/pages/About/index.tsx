import React from 'react';
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
} from '@mui/icons-material';
import { RootState } from '../../store';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  { name: 'React', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 85, category: 'Frontend' },
  { name: 'Material-UI', level: 80, category: 'Frontend' },
  { name: 'Symfony', level: 85, category: 'Backend' },
  { name: 'PHP', level: 85, category: 'Backend' },
  { name: 'MySQL', level: 80, category: 'Backend' },
  { name: 'Docker', level: 75, category: 'DevOps' },
  { name: 'Git', level: 85, category: 'DevOps' },
];

const About: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  console.log('Current user state:', user);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Section Profile */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                CC
              </Avatar>
              <Typography variant="h4" gutterBottom>
                Castex Clement
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Étudiant en Développement Web
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bachelor Chef de Projet Digital - Normandie Web School
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                Bienvenue sur mon Portfolio
              </Typography>
              <Typography paragraph>
                Fasciné par le monde du Développement web, j'ai choisi de me lancer dans l'aventure de la Normandie Web School pour explorer cette passion naissante. Engagé en première année pour obtenir un Bachelor de Chef de Projet Digital, j'ai également été séduit par les intrications de la Communication Graphique, une fusion harmonieuse de technologie et d'esthétique. Encore en quête de ma voie professionnelle, le métier tels que le Designer Web se profile comme une option prometteuse en accord avec mes passions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Sections du parcours */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SchoolIcon color="primary" fontSize="large" />
                <Typography variant="h5">Mon Parcours d'apprentissage</Typography>
              </Box>
              <Typography paragraph>
                De manière indépendante, j'ai plongé dans le monde des dessins numériques sur Krita, puis suivi des cours extrascolaires de dessin papier/numérique pendant un an. Mon ambition était claire : intégrer le design graphique à mes études futures sans en faire pour autant ma profession exclusive. C'est ainsi que je me suis orienté vers le développement web.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <BrushIcon color="primary" fontSize="large" />
                <Typography variant="h5">Mes Inspirations et Objectifs</Typography>
              </Box>
              <Typography paragraph>
                Mon intérêt pour ce domaine remonte à mes années de collège, avec l'utilisation du logiciel Scratch lors des cours de technologie. Cette passion s'est intensifiée au lycée avec l'option Sciences de l'ingénieur dès la classe de seconde. Notre projet de terminale, la conception d'une application pour « améliorer » un réfrigérateur, nous a permis de donner libre cours à notre imagination, créativité, logique, et esprit d'équipe.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CodeIcon color="primary" fontSize="large" />
                <Typography variant="h5">L'Origine de mes Passions</Typography>
              </Box>
              <Typography paragraph>
                De l'école primaire à aujourd'hui, ma fascination pour les ordinateurs persiste, que ce soit pour le plaisir avec les jeux vidéo entre amis, les vidéos/films/séries, ou la création de dessins. Ma fascination pour l'informatique s'étend à la culture générale, avec ma curiosité nourrie par des vidéos informatives et des cours en ligne, particulièrement pendant le confinement.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <SchoolIcon color="primary" fontSize="large" />
                <Typography variant="h5">Mes Ambitions</Typography>
              </Box>
              <Typography paragraph>
                Bien que mon intérêt initial pour l'ordinateur ait été centré sur les jeux vidéo, mon ambition actuelle est d'acquérir des compétences pour créer mes propres applications, jeux, sites web et logiciels. Dans un monde où la majorité des gens possèdent un ordinateur, un téléphone ou tout autre objet numérique connecté, je trouve une véritable source de divertissement et de motivation pour apprendre davantage.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Section Projets et CV */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" gutterBottom>Projets Professionnels</Typography>
                <Typography paragraph>
                  Découvrez mes projets réalisés lors des cours de la Normandie Web School, accompagnés des logiciels utilisés et des dates de création.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/projects')}
                  sx={{ 
                    mt: 'auto',
                    color: 'white',
                    '&:hover': {
                      color: 'white',
                    }
                  }}
                >
                  Voir les projets
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" gutterBottom>Projets Personnels</Typography>
                <Typography paragraph>
                  Découvrez mes dessins réalisés lors de cours extrascolaires ou indépendamment, accompagnés des logiciels utilisés et des dates de création.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/projects')}
                  sx={{ 
                    mt: 'auto',
                    color: 'white',
                    '&:hover': {
                      color: 'white',
                    }
                  }}
                >
                  Voir les projets
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <PaletteIcon color="primary" fontSize="large" />
                  <Typography variant="h5" gutterBottom>Charte Graphique</Typography>
                </Box>
                <Typography paragraph>
                  Découvrez l'évolution de mon identité visuelle, de la conception de mon logo aux choix des couleurs et typographies qui représentent ma personnalité et mes valeurs.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/style-guide')}
                  sx={{ 
                    mt: 'auto',
                    color: 'white',
                    '&:hover': {
                      color: 'white',
                    }
                  }}
                >
                  Voir la charte graphique
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About; 