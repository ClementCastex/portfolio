import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Zoom,
} from '@mui/material';
import {
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useNotificationContext } from '../../hooks/useNotificationContext';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description = '' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const notification = useNotificationContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url)
      .then(() => {
        notification.showNotification('Lien copié dans le presse-papier!', 'success', 3000);
      })
      .catch(() => {
        notification.showNotification('Échec de la copie du lien', 'error');
      });
    handleClose();
  };

  const shareOnFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    handleClose();
  };

  const shareOnTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    handleClose();
  };

  const shareOnLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    handleClose();
  };

  const shareByEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`, '_blank');
    handleClose();
  };

  const shareOnWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n\n' + description + '\n\n' + url)}`, '_blank');
    handleClose();
  };

  return (
    <>
      <Tooltip title="Partager">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'action.disabled',
            '&:hover': {
              color: theme => theme.palette.mode === 'dark' ? 'white' : 'primary.main',
            },
          }}
          aria-label="Partager ce projet"
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={e => e.stopPropagation()}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            borderRadius: 2,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        TransitionComponent={Zoom}
      >
        <MenuItem onClick={copyToClipboard}>
          <ListItemIcon>
            <LinkIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText>Copier le lien</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareOnFacebook}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareOnTwitter}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />
          </ListItemIcon>
          <ListItemText>Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareOnLinkedIn}>
          <ListItemIcon>
            <LinkedInIcon fontSize="small" sx={{ color: '#0A66C2' }} />
          </ListItemIcon>
          <ListItemText>LinkedIn</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareByEmail}>
          <ListItemIcon>
            <EmailIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText>Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareOnWhatsApp}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SocialShare; 