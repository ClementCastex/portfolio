# 🛡️ AMÉLIORATIONS DE SÉCURITÉ RECOMMANDÉES

## 1. VULNÉRABILITÉS DÉPENDANCES

### Frontend (URGENT)
```bash
# Corriger les vulnérabilités
npm audit fix

# Si nécessaire (breaking changes)
npm audit fix --force
```

### Validation fichiers uploads
```php
// Dans KanbanCardController.php - AJOUTER
private const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword'
];

private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

private function validateFile(UploadedFile $file): array
{
    $errors = [];
    
    // Vérifier le type MIME
    if (!in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES)) {
        $errors[] = 'Type de fichier non autorisé';
    }
    
    // Vérifier la taille
    if ($file->getSize() > self::MAX_FILE_SIZE) {
        $errors[] = 'Fichier trop volumineux (max 10MB)';
    }
    
    // Vérifier l'extension
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc'];
    if (!in_array($file->guessExtension(), $allowedExtensions)) {
        $errors[] = 'Extension de fichier non autorisée';
    }
    
    return $errors;
}
```

## 2. RATE LIMITING

### Ajouter dans config/packages/framework.yaml
```yaml
framework:
    rate_limiter:
        api_login:
            policy: 'sliding_window'
            limit: 5
            interval: '15 minutes'
        api_upload:
            policy: 'fixed_window'
            limit: 10
            interval: '1 hour'
```

## 3. VARIABLES D'ENVIRONNEMENT

### Créer .env.prod
```bash
APP_ENV=prod
APP_SECRET=GENERATE_STRONG_SECRET_HERE
DATABASE_URL="mysql://user:password@host:3306/db_name?serverVersion=mariadb-10.6.22&charset=utf8mb4"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=YOUR_STRONG_PASSPHRASE
CORS_ALLOW_ORIGIN=https://clementcastex.art
```

## 4. HEADERS SÉCURITÉ

### Dans public/.htaccess (production)
```apache
# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'"

# HSTS (HTTPS uniquement)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

## 5. VALIDATION INPUTS

### Ajouter validation stricte
```php
// Dans tous les contrôleurs
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;

private function validateInput(array $data, array $constraints): array
{
    $violations = $this->validator->validate($data, new Assert\Collection($constraints));
    
    $errors = [];
    foreach ($violations as $violation) {
        $errors[$violation->getPropertyPath()] = $violation->getMessage();
    }
    
    return $errors;
}
```
