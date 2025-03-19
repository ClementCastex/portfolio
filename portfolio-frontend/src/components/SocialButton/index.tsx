import React from 'react';
import { IconButton, SvgIconProps } from '@mui/material';

interface SocialButtonProps {
  href: string;
  icon: React.ReactElement<SvgIconProps>;
  ariaLabel?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, ariaLabel }) => {
  return (
    <IconButton 
      href={href}
      target="_blank"
      aria-label={ariaLabel}
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
      {React.cloneElement(icon, { sx: { fontSize: 35 } })}
    </IconButton>
  );
};

export default SocialButton; 