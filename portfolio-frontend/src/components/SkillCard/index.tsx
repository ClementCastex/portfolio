import React from 'react';
import { Box, Typography, SvgIconProps, Theme } from '@mui/material';

interface SkillCardProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  description: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, description }) => {
  return (
    <Box sx={{
      p: 6,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: (theme: Theme) => `${theme.palette.primary.main}15`,
      borderRadius: 4,
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      border: (theme: Theme) => `1px solid ${theme.palette.primary.main}40`,
      '&:hover': {
        transform: 'translateY(-10px)',
        backgroundColor: (theme: Theme) => `${theme.palette.primary.main}25`,
        border: (theme: Theme) => `1px solid ${theme.palette.primary.main}`,
      }
    }}>
      {React.cloneElement(icon, { 
        sx: { 
          fontSize: 100, 
          color: (theme: Theme) => theme.palette.primary.main, 
          mb: 4,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(10deg)'
          }
        } 
      })}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Box>
  );
};

export default SkillCard; 