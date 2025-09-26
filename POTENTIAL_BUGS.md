# 🐛 BUGS POTENTIELS IDENTIFIÉS

## 1. BUGS CRITIQUES À CORRIGER

### A. Upload de fichiers - Sécurité
```php
// PROBLÈME: Pas de validation MIME stricte
// FICHIER: portfolio-backend/src/Controller/KanbanCardController.php:222

// ACTUEL (VULNÉRABLE):
$file->setMime($uploadedFile->getMimeType());

// CORRECT:
private function validateMimeType(UploadedFile $file): bool
{
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    $detectedType = mime_content_type($file->getPathname());
    
    return in_array($detectedType, $allowedTypes) && 
           in_array($file->getMimeType(), $allowedTypes);
}
```

### B. Race Condition - Kanban Cards
```typescript
// PROBLÈME: Mise à jour simultanée de position
// FICHIER: portfolio-frontend/src/store/slices/kanbanSlice.ts

// Ajouter un lock optimiste:
const moveCard = createAsyncThunk(
  'kanban/moveCard',
  async ({ cardId, newColumnId, newPosition, version }: MoveCardParams) => {
    const response = await api.put(`/api/cards/${cardId}`, {
      column_id: newColumnId,
      position: newPosition,
      version // Version optimiste
    });
    return response.data;
  }
);
```

### C. Memory Leak - Notes Auto-save
```typescript
// PROBLÈME: Timer non nettoyé
// FICHIER: portfolio-frontend/src/components/NoteEditor/index.tsx

useEffect(() => {
  let timeoutId: NodeJS.Timeout;
  
  if (hasChanges) {
    timeoutId = setTimeout(() => {
      handleAutoSave();
    }, 2000);
  }
  
  // AJOUTER ce cleanup:
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [content, hasChanges]);
```

## 2. BUGS MINEURS

### A. Console.log en production
```bash
# Trouver tous les console.log
grep -r "console\." portfolio-frontend/src/

# Remplacer par un logger conditionnel:
const logger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
    // Envoyer à Sentry en production
  }
};
```

### B. Gestion des images cassées
```typescript
// AJOUTER dans ProjectCard et autres composants d'images:
const [imageError, setImageError] = useState(false);

<img 
  src={imageUrl}
  alt={alt}
  onError={() => setImageError(true)}
  style={{ display: imageError ? 'none' : 'block' }}
/>
{imageError && (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 200,
    bgcolor: 'grey.100'
  }}>
    <ImageIcon />
  </Box>
)}
```

### C. Dates non localisées
```typescript
// PROBLÈME: Dates en anglais
// SOLUTION: Ajouter locale française

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};
```

## 3. PROBLÈMES DE PERFORMANCE

### A. Re-renders inutiles
```typescript
// PROBLÈME: Composants qui re-render trop
// SOLUTION: Memoization

const ProjectCard = memo(({ project }: ProjectCardProps) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.project.id === nextProps.project.id &&
         prevProps.project.updatedAt === nextProps.project.updatedAt;
});
```

### B. Requêtes N+1
```php
// PROBLÈME: Requêtes multiples pour les relations
// FICHIER: Tous les repositories

// AJOUTER des joins explicites:
public function findProjectsWithRelations(): array
{
    return $this->createQueryBuilder('p')
        ->leftJoin('p.images', 'i')
        ->leftJoin('p.user', 'u')
        ->addSelect('i', 'u')
        ->getQuery()
        ->getResult();
}
```

## 4. PROBLÈMES D'ACCESSIBILITÉ

### A. Contraste insuffisant
```typescript
// Vérifier et corriger les contrastes
const theme = createTheme({
  palette: {
    primary: {
      main: '#5B348B',
      contrastText: '#FFFFFF' // S'assurer que le contraste est suffisant
    }
  }
});
```

### B. Navigation clavier manquante
```typescript
// AJOUTER dans tous les composants interactifs:
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};

<Box
  onClick={onClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"
  aria-label="Description de l'action"
>
```

## 5. PROBLÈMES DE COMPATIBILITÉ

### A. Navigateurs anciens
```typescript
// AJOUTER polyfills si nécessaire
// Dans public/index.html:
<script nomodule>
  // Polyfills pour navigateurs anciens
  if (!window.fetch) {
    document.write('<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch"><\/script>');
  }
</script>
```

### B. Mobile - Touch events
```typescript
// AMÉLIORER le drag & drop mobile
const handleTouchStart = (e: TouchEvent) => {
  // Gérer le touch pour mobile
  const touch = e.touches[0];
  setDragStart({ x: touch.clientX, y: touch.clientY });
};
```

## 6. SÉCURITÉ

### A. XSS dans les contenus riches
```typescript
// PROBLÈME: HTML non sanitisé dans les notes
// SOLUTION: DOMPurify

import DOMPurify from 'dompurify';

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class', 'style']
  });
};
```

### B. CSRF Protection
```php
// AJOUTER dans config/packages/framework.yaml:
framework:
    csrf_protection: true
    
# Et dans les formulaires React:
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
```
