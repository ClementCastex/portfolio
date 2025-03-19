import React, { useState } from 'react';
import { Box } from '@mui/material';
import { getFullImageUrl } from '../../utils/imageUtils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: string | number;
  height?: string | number;
  sx?: object;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.webp',
  width = '100%',
  height = 'auto',
  sx = {},
}) => {
  const [error, setError] = useState(false);

  return (
    <Box
      component="img"
      src={error ? fallbackSrc : getFullImageUrl(src)}
      alt={alt}
      onError={() => setError(true)}
      sx={{
        width,
        height,
        objectFit: 'cover',
        ...sx,
      }}
    />
  );
};

export default ImageWithFallback; 