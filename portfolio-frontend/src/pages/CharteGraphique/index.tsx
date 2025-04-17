import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

// Composant pour les motifs de losanges
const DiamondPattern = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '40%',
      height: '40%',
      opacity: 0.2,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L45 15L60 30L45 45z' fill='%235B348B'/%3E%3C/svg%3E")`,
      backgroundSize: 'contain',
      backgroundRepeat: 'repeat',
      pointerEvents: 'none',
    }}
  />
);

// Composant pour la section titre
const TitleSection: React.FC<{ title: string }> = ({ title }) => (
  <Box
    sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      bgcolor: theme => theme.palette.background.default,
      color: theme => theme.palette.text.primary,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        bgcolor: '#5B348B',
      }}
    />
    <Container maxWidth="lg">
      <Typography variant="h1" sx={{ 
        fontSize: '4rem', 
        fontWeight: 'bold',
        ml: '80px'
      }}>
        {title}
      </Typography>
    </Container>
  </Box>
);

// Composant pour la section couleurs
const ColorSection = () => (
  <Box sx={{ 
    p: 8, 
    bgcolor: theme => theme.palette.background.default,
    color: theme => theme.palette.text.primary,
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  }}>
    {/* Barre latérale violette */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        bgcolor: '#5B348B',
      }}
    />
    
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        {/* Partie gauche avec le texte */}
        <Grid item xs={12} md={5}>
          <Box sx={{ ml: '0px', mr: '40px' }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'Exo 2',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              mb: 6
            }}>
              1 - PALETTE DE COULEUR
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Ma couleur principale, <strong>le violet foncé</strong>, couramment utilisé en mode et spiritualité, représente pour moi <strong>la technologie</strong> et le web. Symbole de <strong>noblesse, royauté, sagesse, créativité et mystère</strong>, il m'a formé, défini et me suivra tout au long de ma carrière.
            </Typography>

            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Les deux nuances de <strong>gris foncé</strong> accompagnent le violet avec <strong>modernité et ma touche personnelle</strong>. Le gris le plus foncé sert de contraste au plus clair et comme couleur de texte sur fond blanc pour alléger les textes.
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Le <strong>jaune moutarde</strong>, complémentaire du violet foncé, <strong>ajoute luminosité et chaleur</strong>. Le blanc pur est principalement utilisé pour les textes sur fond sombre pour une meilleure visibilité.
            </Typography>
          </Box>
        </Grid>

        {/* Partie droite avec les couleurs */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={6}>
            {/* Violet principal */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#5B348B',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>Hex # 5B348B</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>RGB ( 91, 52, 139 )</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>CMYK ( 35%, 63%, 0%, 45% )</Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>HSV ( 267°, 63%, 55% )</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Les deux gris */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#23272A',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>Hex # 23272A</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>RGB ( 35, 39, 42 )</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>CMYK ( 17%, 7%, 0%, 84% )</Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>HSV ( 206°, 17%, 16% )</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#2C2F33',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>Hex # 2C2F33</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>RGB ( 44, 47, 51 )</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>CMYK ( 14%, 8%, 0%, 80% )</Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>HSV ( 214°, 14%, 20% )</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Jaune et blanc */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#CCAA1D',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>Hex # CCAA1D</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>RGB ( 204, 170, 29 )</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>CMYK ( 0%, 17%, 86%, 20% )</Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>HSV ( 48°, 86%, 80% )</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#F7F3F7',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '1.4rem' }}>Hex # F7F3F7</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>RGB ( 247, 243, 247 )</Typography>
                  <Typography sx={{ mb: 0.5, fontSize: '1.1rem' }}>CMYK ( 0%, 2%, 0%, 3% )</Typography>
                  <Typography sx={{ fontSize: '1.1rem' }}>HSV ( 300°, 2%, 97% )</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// Composant pour la section typographie
const TypographySection = () => (
  <Box sx={{ 
    p: 8, 
    bgcolor: theme => theme.palette.background.default,
    color: theme => theme.palette.text.primary,
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  }}>
    {/* Barre latérale violette */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        bgcolor: '#5B348B',
      }}
    />
    
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        {/* Partie gauche avec le texte */}
        <Grid item xs={12} md={5}>
          <Box sx={{ ml: '0px', mr: '40px' }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'Exo 2',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              mb: 6
            }}>
              2 - FONTS
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Ma charte Graphique est composée de deux typographies <strong>Exo 2</strong> et <strong>Quicksand</strong>
            </Typography>

            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              <strong>Exo 2</strong> est la typographie <strong>des titres</strong>, elle est le plus souvent utilisée en <strong>"Black italique"</strong> pour <strong>les gros titres</strong> mais peut être utilisée en <strong>"Black"</strong> pour les titres moins important ou sous-titre.
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              <strong>Quicksand</strong> est la typographie utilisée principalement pour <strong>des textes</strong> en <strong>"Régular"</strong> ou <strong>"Bold"</strong> seulement pour <strong>surligner des éléments important</strong>. Dans des cas de sous-sous-titre on peut utiliser <strong>Quicksand en "Bold"</strong> avec une plus grande police.
            </Typography>
          </Box>
        </Grid>

        {/* Partie droite avec les exemples de typographie */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={8}>
            {/* Exo 2 */}
            <Grid item xs={12}>
              <Box>
                <Typography sx={{ 
                  fontFamily: 'Exo 2',
                  fontSize: '5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  EXO 2
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Exo 2',
                  fontSize: '2rem',
                  mb: 2
                }}>
                  Clément CASTEX
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Exo 2',
                  fontSize: '1.5rem',
                  mb: 2
                }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Exo 2',
                  fontSize: '1.5rem',
                  mb: 4,
                  fontStyle: 'italic'
                }}>
                  abcdefghijklmnopqrstuvwxyz
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Exo 2',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: theme => theme.palette.text.primary
                }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et vehicula est. In eget erat quis ex vestibulum pretium in eu augue. Proin fringilla ullamcorper ligula, vitae vehicula lacus vulputate eget.
                </Typography>
              </Box>
            </Grid>

            {/* Quicksand */}
            <Grid item xs={12}>
              <Box>
                <Typography sx={{ 
                  fontFamily: 'Quicksand',
                  fontSize: '5rem',
                  fontWeight: 'normal',
                  mb: 2
                }}>
                  Quicksand
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Quicksand',
                  fontSize: '2rem',
                  mb: 2
                }}>
                  Clément CASTEX
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Quicksand',
                  fontSize: '1.5rem',
                  mb: 2
                }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Quicksand',
                  fontSize: '1.5rem',
                  mb: 4
                }}>
                  abcdefghijklmnopqrstuvwxyz
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Quicksand',
                  fontSize: '1rem',
                  color: theme => theme.palette.text.primary
                }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et vehicula est. In eget erat quis ex vestibulum pretium in eu augue. Proin fringilla ullamcorper ligula, vitae vehicula lacus vulputate eget.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// Composant pour la section Story Telling
const StoryTellingSection = () => (
  <Box sx={{ 
    p: 8, 
    bgcolor: theme => theme.palette.background.default,
    color: theme => theme.palette.text.primary,
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  }}>
    {/* Barre latérale violette */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        bgcolor: '#5B348B',
      }}
    />
    
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        {/* Partie gauche avec le texte */}
        <Grid item xs={12} md={5}>
          <Box sx={{ ml: '0px', mr: '40px' }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'Exo 2',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              mb: 6
            }}>
              3.1 - STORY TELLING
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Mon logo est un <strong>assemblage d'idées personnelles</strong>, créant un logo moderne qui peut être interprété par tout le monde. Ma première idée était de faire un œil pour représenter <strong>mon aspect graphique</strong>, avec la pupille formant la lettre "C" de mon nom. Cependant, ce logo était trop prévisible.
            </Typography>

            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Pour mon second essai, j'ai essayé d'implémenter mon <strong>lien avec le web</strong>, mais le même problème persistait.
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              En <strong>repartant de zéro</strong>, j'ai créé ce logo final, un mélange de mes deux passions et la lettre de mon prénom. Après avoir demandé l'avis de plusieurs personnes, chacun voyait quelque chose de différent—d'un pingouin qui glisse à une tête d'oiseau. Cela m'a confirmé que j'avais réussi à <strong>provoquer différentes interprétations</strong> chez les clients. Selon moi, il ressemble à un œil (mon aspect graphique) et une souris (mon aspect développement web).
            </Typography>
          </Box>
        </Grid>

        {/* Partie droite avec les logos */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={4} alignItems="center">
            {/* Premier essai */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="h6" sx={{ color: theme => theme.palette.text.primary }}>Premier essai</Typography>
                <img 
                  src="/images/Logo idée 1.png" 
                  alt="Logo Icon"
                  style={{
                    width: '200px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>

            {/* Deuxième essai */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="h6" sx={{ color: theme => theme.palette.text.primary }}>Deuxième essai</Typography>
                <img 
                  src="/images/Logo idée 1 V2.png" 
                  alt="Logo Icon"
                  style={{
                    width: '350px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>

            {/* Résultat final */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="h6" sx={{ color: theme => theme.palette.text.primary }}>Résultat Final</Typography>
                <img 
                  src="/images/Logo Icon Off V2.svg" 
                  alt="Logo Icon"
                  style={{
                    width: '350px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// Composant pour la section logo
const LogoSection = () => (
  <Box sx={{ 
    p: 8, 
    bgcolor: theme => theme.palette.background.default,
    color: theme => theme.palette.text.primary,
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  }}>
    {/* Barre latérale violette */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        bgcolor: '#5B348B',
      }}
    />
    
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        {/* Partie gauche avec le texte */}
        <Grid item xs={12} md={5}>
          <Box sx={{ ml: '0px', mr: '40px' }}>
            <Typography variant="h2" sx={{ 
              fontFamily: 'Exo 2',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              mb: 6
            }}>
              3 - LOGO
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Voici mes 3 Logo principales, ils ont chacun une utilité un endroit où ils doivent être utilisés.
            </Typography>

            <Typography paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Pour la petite icône elle est seulement utilisée dans les pages d'en-tête de site, dû à ça plus petite largeur, cependant cette icône n'est pas une déformation (page 3.5).
            </Typography>

            <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Quant à la grande icône et la version bannière ils sont égaux. On n'est obligé de mettre la bannière et aurait pu utiliser l'icône, tout dépend de la largeur de l'espace disponible.
            </Typography>
          </Box>
        </Grid>

        {/* Partie droite avec les logos */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={8} alignItems="center">
            {/* Logo Icon */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                mb: 4
              }}>
                <img 
                  src="/images/Logo Icon Off V2.svg" 
                  alt="Logo Icon"
                  style={{
                    width: '300px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>

            {/* Logo Bannière */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center'
              }}>
                <img 
                  src="/images/Logo Bannière Off V2.svg" 
                  alt="Logo Bannière"
                  style={{
                    width: '600px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// Composant pour l'effet de particules optimisé
const ParticleEffect = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '40%',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        right: '-50%',
        bottom: '-50%',
        width: '200%',
        height: '200%',
        background: 'transparent',
        backgroundImage: theme => `
          radial-gradient(circle at 15% 25%, ${theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.4)' : 'rgba(91, 52, 139, 0.25)'} 1px, transparent 3px),
          radial-gradient(circle at 35% 65%, ${theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.35)' : 'rgba(91, 52, 139, 0.2)'} 2px, transparent 4px),
          radial-gradient(circle at 55% 45%, ${theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.3)' : 'rgba(91, 52, 139, 0.18)'} 3px, transparent 6px),
          radial-gradient(circle at 75% 85%, ${theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.25)' : 'rgba(91, 52, 139, 0.15)'} 1px, transparent 3px),
          radial-gradient(circle at 85% 15%, ${theme.palette.mode === 'dark' ? 'rgba(91, 52, 139, 0.35)' : 'rgba(91, 52, 139, 0.2)'} 2px, transparent 4px)
        `,
        backgroundSize: '200px 200px',
        animation: 'particleAnimation 30s linear infinite',
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0))',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0))',
      },
      '@keyframes particleAnimation': {
        '0%': {
          transform: 'translate(0, 0) rotate(0deg)',
        },
        '100%': {
          transform: 'translate(-30%, 30%) rotate(5deg)',
        },
      },
    }}
  />
);

const CharteGraphique: React.FC = () => {
  const handleDownloadPDF = () => {
    window.open('/documents/Charte Graphique Clément Castex V2.pdf', '_blank');
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TitleSection title="Charte Graphique Clément Castex " />
      <ColorSection />
      <TypographySection />
      <LogoSection />
      <StoryTellingSection />

      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}
      >
        <Tooltip title="Télécharger la charte graphique">
          <IconButton
            onClick={handleDownloadPDF}
            sx={{
              backgroundColor: '#5B348B',
              color: 'white',
              width: 56,
              height: 56,
              '&:hover': {
                backgroundColor: '#4a2b73',
              },
              boxShadow: 3
            }}
          >
            <PdfIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <ParticleEffect />
    </Box>
  );
};

export default CharteGraphique; 