# 🚨 AMÉLIORATIONS GESTION D'ERREURS

## 1. LOGGER CENTRALISÉ

### A. Backend - Service de logging
```php
// src/Service/LoggerService.php
<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class LoggerService
{
    public function __construct(
        private LoggerInterface $logger,
        private Security $security
    ) {}

    public function logError(string $message, array $context = [], \Throwable $exception = null): void
    {
        $context['user'] = $this->security->getUser()?->getEmail() ?? 'anonymous';
        $context['timestamp'] = new \DateTime();
        
        if ($exception) {
            $context['exception'] = [
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ];
        }
        
        $this->logger->error($message, $context);
    }

    public function logApiCall(Request $request, $response, float $duration): void
    {
        $this->logger->info('API Call', [
            'method' => $request->getMethod(),
            'uri' => $request->getUri(),
            'status' => $response->getStatusCode(),
            'duration' => $duration . 'ms',
            'user' => $this->security->getUser()?->getEmail() ?? 'anonymous'
        ]);
    }
}
```

### B. Exception Handler Global
```php
// src/EventListener/ExceptionListener.php
<?php

namespace App\EventListener;

use App\Service\LoggerService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener
{
    public function __construct(private LoggerService $loggerService) {}

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        // Logger l'erreur
        $this->loggerService->logError(
            'Unhandled exception: ' . $exception->getMessage(),
            ['request' => $request->getUri()],
            $exception
        );

        // Réponse pour API
        if (str_starts_with($request->getPathInfo(), '/api/')) {
            $statusCode = $exception instanceof HttpExceptionInterface 
                ? $exception->getStatusCode() 
                : Response::HTTP_INTERNAL_SERVER_ERROR;

            $response = new JsonResponse([
                'error' => $exception->getMessage(),
                'code' => $statusCode
            ], $statusCode);

            $event->setResponse($response);
        }
    }
}
```

## 2. FRONTEND - ERROR BOUNDARIES

### A. Error Boundary Component
```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logger l'erreur
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Envoyer à un service de monitoring (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Une erreur est survenue</Typography>
            <Typography variant="body2">
              {this.state.error?.message || 'Erreur inconnue'}
            </Typography>
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Réessayer
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### B. Hook de gestion d'erreurs
```typescript
// hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/slices/notificationSlice';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = useCallback((error: any, context?: string) => {
    let message = 'Une erreur est survenue';
    
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    // Logger en développement
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    }

    // Afficher notification utilisateur
    dispatch(showNotification({
      message,
      severity: 'error',
      duration: 6000
    }));

    // Envoyer à un service de monitoring en production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { tags: { context } });
    }
  }, [dispatch]);

  const handleApiError = useCallback((error: any) => {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        handleError(new Error('Session expirée, veuillez vous reconnecter'), 'Auth');
        // Rediriger vers login
        break;
      case 403:
        handleError(new Error('Accès non autorisé'), 'Auth');
        break;
      case 404:
        handleError(new Error('Ressource non trouvée'), 'API');
        break;
      case 500:
        handleError(new Error('Erreur serveur, veuillez réessayer'), 'API');
        break;
      default:
        handleError(error, 'API');
    }
  }, [handleError]);

  return { handleError, handleApiError };
};
```

## 3. VALIDATION ROBUSTE

### A. Validation côté client
```typescript
// utils/validation.ts
import * as Yup from 'yup';

export const projectSchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre est requis')
    .min(3, 'Le titre doit faire au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: Yup.string()
    .required('La description est requise')
    .min(10, 'La description doit faire au moins 10 caractères'),
  status: Yup.string()
    .oneOf(['draft', 'in_progress', 'completed', 'abandoned'])
    .required('Le statut est requis'),
  categories: Yup.array()
    .of(Yup.string())
    .max(5, 'Maximum 5 catégories')
});

export const validateProject = async (data: any) => {
  try {
    await projectSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors: Record<string, string> = {};
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};
```

## 4. MONITORING PRODUCTION

### A. Health Check Endpoint
```php
// src/Controller/HealthController.php
<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class HealthController extends AbstractController
{
    #[Route('/health', name: 'health_check', methods: ['GET'])]
    public function healthCheck(Connection $connection): JsonResponse
    {
        $checks = [
            'database' => $this->checkDatabase($connection),
            'uploads' => $this->checkUploadsDirectory(),
            'jwt' => $this->checkJwtKeys(),
        ];

        $allHealthy = array_reduce($checks, fn($carry, $check) => $carry && $check, true);

        return new JsonResponse([
            'status' => $allHealthy ? 'healthy' : 'unhealthy',
            'checks' => $checks,
            'timestamp' => new \DateTime()
        ], $allHealthy ? 200 : 503);
    }

    private function checkDatabase(Connection $connection): bool
    {
        try {
            $connection->executeQuery('SELECT 1');
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function checkUploadsDirectory(): bool
    {
        return is_writable($this->getParameter('uploads_directory'));
    }

    private function checkJwtKeys(): bool
    {
        $privateKey = $this->getParameter('jwt_secret_key');
        $publicKey = $this->getParameter('jwt_public_key');
        
        return file_exists($privateKey) && file_exists($publicKey);
    }
}
```
