# ⚡ AMÉLIORATIONS DE PERFORMANCES

## 1. FRONTEND OPTIMIZATIONS

### A. Images et Assets
```typescript
// Lazy loading pour images projets
const ProjectImage: React.FC<{src: string, alt: string}> = ({src, alt}) => {
  return (
    <img 
      src={src} 
      alt={alt}
      loading="lazy"
      style={{
        aspectRatio: '16/9',
        objectFit: 'cover'
      }}
    />
  );
};

// Compression d'images en production
// Dans build process
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['src/assets/*.{jpg,png}'], {
  destination: 'build/static/images',
  plugins: [imageminWebp({quality: 80})]
});
```

### B. Code Splitting
```typescript
// Router.tsx - Lazy loading des pages
const Notes = lazy(() => import('./pages/Notes'));
const Kanban = lazy(() => import('./pages/Kanban'));
const CharteGraphique = lazy(() => import('./pages/CharteGraphique'));

// Dans App.tsx
<Suspense fallback={<CircularProgress />}>
  <Routes>...</Routes>
</Suspense>
```

### C. Redux Optimizations
```typescript
// Memoization des sélecteurs
import { createSelector } from '@reduxjs/toolkit';

const selectFilteredProjects = createSelector(
  [(state: RootState) => state.projects.items,
   (state: RootState) => state.projects.filters],
  (projects, filters) => {
    return projects.filter(project => 
      // Logique de filtrage
    );
  }
);
```

## 2. BACKEND OPTIMIZATIONS

### A. Database Indexing
```sql
-- Indexes recommandés
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_kanban_cards_column_id ON kanban_cards(column_id);
CREATE INDEX idx_kanban_cards_due_at ON kanban_cards(due_at);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);

-- Index composés
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
CREATE INDEX idx_cards_column_position ON kanban_cards(column_id, position);
```

### B. Query Optimization
```php
// Dans les repositories - Utiliser joins au lieu de lazy loading
public function findProjectsWithImages(int $userId): array
{
    return $this->createQueryBuilder('p')
        ->leftJoin('p.images', 'i')
        ->addSelect('i')
        ->where('p.user = :userId')
        ->setParameter('userId', $userId)
        ->orderBy('p.updatedAt', 'DESC')
        ->getQuery()
        ->getResult();
}

// Pagination pour gros datasets
public function findPaginatedProjects(int $page = 1, int $limit = 12): array
{
    return $this->createQueryBuilder('p')
        ->setFirstResult(($page - 1) * $limit)
        ->setMaxResults($limit)
        ->orderBy('p.createdAt', 'DESC')
        ->getQuery()
        ->getResult();
}
```

### C. Caching
```yaml
# config/packages/cache.yaml
framework:
    cache:
        app: cache.adapter.redis
        default_redis_provider: 'redis://localhost:6379'
        
    http_cache:
        public_dir: '%kernel.project_dir%/public'
```

```php
// Dans les contrôleurs
use Symfony\Contracts\Cache\CacheInterface;

public function getProjects(CacheInterface $cache): JsonResponse
{
    $projects = $cache->get('user_projects_' . $this->getUser()->getId(), 
        function (ItemInterface $item) {
            $item->expiresAfter(300); // 5 minutes
            return $this->projectRepository->findByUser($this->getUser());
        }
    );
    
    return $this->json($projects);
}
```

## 3. COMPRESSION & MINIFICATION

### A. Gzip/Brotli (Nginx)
```nginx
# Dans nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

# Brotli (si disponible)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### B. Assets Optimization
```json
// package.json - Build optimisé
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false npm run build:react && npm run optimize:images",
    "build:react": "react-scripts build",
    "optimize:images": "imagemin build/static/media/*.{jpg,png} --out-dir=build/static/media --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant"
  }
}
```

## 4. MONITORING & METRICS

### A. Performance Monitoring
```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: Function) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`);
  }
  
  return result;
};

// Usage dans les composants
const expensiveCalculation = useMemo(() => 
  measurePerformance('Filter Projects', () => 
    projects.filter(/* complex logic */)
  ), [projects, filters]
);
```

### B. Bundle Analysis
```bash
# Analyser la taille du bundle
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```
