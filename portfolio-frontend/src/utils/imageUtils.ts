export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Si c'est déjà une URL complète
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Pour les images stockées localement
  // En développement, utiliser le proxy React (défini dans package.json)
  // En production, chemin relatif (Nginx sert les fichiers)
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    return imagePath; // Chemin relatif pour Nginx
  } else {
    // En développement, le proxy React redirige vers Symfony
    return imagePath; // Le proxy s'occupe de la redirection
  }
}; 