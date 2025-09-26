# 🔐 TEMPLATE CONFIGURATION PRODUCTION

## Créer le fichier .env.prod dans portfolio-backend/

```bash
# Copier le template
cp .env .env.prod

# Éditer avec les vraies valeurs
nano .env.prod
```

## Contenu du fichier .env.prod :

```bash
# CONFIGURATION PRODUCTION - Portfolio Clément Castex
# ⚠️ ATTENTION: Remplacer les valeurs par les vraies valeurs

# Environment
APP_ENV=prod
APP_DEBUG=false

# Secret généré - GÉNÉRER UN NOUVEAU: openssl rand -hex 32
APP_SECRET=48cb13b4482a48d12d049ad6730dfa90982c02154abaf8fdadbfebdd775103d6

# Database - Remplacer avec vos vraies valeurs VPS
DATABASE_URL="mysql://votre_user:votre_password@127.0.0.1:3306/db_portfolio?serverVersion=mariadb-10.6.22&charset=utf8mb4"

# JWT Configuration
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=VOTRE_PASSPHRASE_FORT

# CORS - Votre domaine uniquement
CORS_ALLOW_ORIGIN=https://clementcastex.art

# Cache Redis (optionnel)
# REDIS_URL=redis://localhost:6379
```

## Générer les clés JWT pour production :

```bash
# Dans le dossier portfolio-backend
mkdir -p config/jwt

# Générer la clé privée (vous demandera une passphrase)
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096

# Générer la clé publique
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout

# Sécuriser les permissions
chmod 600 config/jwt/private.pem
chmod 644 config/jwt/public.pem
```

## Variables importantes à personnaliser :

- **APP_SECRET** : Générer avec `openssl rand -hex 32`
- **DATABASE_URL** : Vos vraies informations MySQL
- **JWT_PASSPHRASE** : Passphrase forte pour les clés JWT
- **CORS_ALLOW_ORIGIN** : Votre domaine exact
