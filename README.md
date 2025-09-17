# 🚀 Portfolio v3

Un portfolio moderne et professionnel construit avec **React TypeScript** (frontend) et **Symfony 7.2** (backend).

## 📋 Table des matières

- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [⚡ Installation et lancement](#-installation-et-lancement)
- [🔧 Configuration](#-configuration)
- [📱 Fonctionnalités](#-fonctionnalités)
- [🌐 Mise en production](#-mise-en-production)
- [🐛 Dépannage](#-dépannage)
- [📝 Notes pour le futur](#-notes-pour-le-futur)

## 🛠️ Technologies utilisées

### Frontend
- **React 19** avec TypeScript
- **Material-UI (MUI)** pour l'interface
- **Redux Toolkit** pour la gestion d'état
- **React Router** pour la navigation
- **HTML2Canvas & jsPDF** pour l'export PDF

### Backend
- **Symfony 7.2** (PHP 8.2+)
- **Doctrine ORM** pour la base de données
- **JWT Authentication** pour l'authentification
- **API RESTful**

## ⚡ Installation et lancement

### Prérequis
- **Node.js** (version 16+)
- **PHP** (version 8.2+)
- **Composer**
- **MySQL/MariaDB** ou **SQLite**

### 🚀 Lancement rapide

1. **Cloner le repository**
   ```bash
   git clone git@github.com:ClementCastex/portfolio.git
   cd portfolio-v3
   ```

2. **Installation des dépendances**
   ```bash
   # Frontend
   cd portfolio-frontend
   npm install
   
   # Backend
   cd ../portfolio-backend
   composer install
   ```

3. **Configuration de la base de données**
   ```bash
   # Copier le fichier d'environnement
   cp .env .env.local
   
   # Éditer .env.local avec vos paramètres DB
   # DATABASE_URL="mysql://username:password@127.0.0.1:3306/portfolio_db"
   
   # Créer la base de données
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```

4. **Lancer les serveurs**
   
   **Terminal 1 - Backend :**
   ```bash
   cd portfolio-backend
   symfony server:start
   # Ou si Symfony CLI n'est pas installé :
   php -S localhost:8000 -t public/
   ```
   
   **Terminal 2 - Frontend :**
   ```bash
   cd portfolio-frontend
   npm start
   ```

5. **Accéder à l'application**
   - Frontend : http://localhost:3000
   - Backend API : http://localhost:8000

## 🔧 Configuration

### Variables d'environnement (Backend)

Créez un fichier `.env.local` dans `portfolio-backend/` :

```env
# Base de données
DATABASE_URL="mysql://username:password@127.0.0.1:3306/portfolio_db"

# JWT Configuration
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-passphrase

# Environnement
APP_ENV=dev
APP_SECRET=your-app-secret
```

### Configuration JWT

```bash
cd portfolio-backend
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

### Variables d'environnement (Frontend)

Créez un fichier `.env.local` dans `portfolio-frontend/` :

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

## 📱 Fonctionnalités

- ✅ **Portfolio interactif** avec projets et compétences
- ✅ **Interface d'administration** pour gérer les projets
- ✅ **Authentification JWT**
- ✅ **Upload d'images** pour les projets
- ✅ **Export PDF** du portfolio
- ✅ **Design responsive** avec Material-UI
- ✅ **Système de tags** pour filtrer les projets
- ✅ **Gestion des favoris/bookmarks**

## 🌐 Mise en production

### 📦 Préparation

1. **Build du frontend**
   ```bash
   cd portfolio-frontend
   npm run build
   ```

2. **Configuration production (Backend)**
   ```bash
   cd portfolio-backend
   cp .env .env.prod
   # Éditer .env.prod avec les paramètres de production
   ```

### 🌍 Déploiement sur serveur

#### Option 1: Serveur VPS/Dédié

1. **Transférer les fichiers**
   ```bash
   # Via rsync
   rsync -av --exclude 'node_modules' --exclude '.git' ./ user@your-server:/var/www/portfolio/
   ```

2. **Configuration serveur web (Apache/Nginx)**
   
   **Nginx exemple:**
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;
       root /var/www/portfolio/portfolio-frontend/build;
       index index.html;

       # Frontend (React)
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Installation sur le serveur**
   ```bash
   # Sur le serveur
   cd /var/www/portfolio
   
   # Backend
   cd portfolio-backend
   composer install --no-dev --optimize-autoloader
   php bin/console cache:clear --env=prod
   php bin/console doctrine:migrations:migrate --no-interaction
   
   # Permissions
   sudo chown -R www-data:www-data var/
   sudo chmod -R 755 var/
   ```

#### Option 2: Hébergement partagé

1. **Préparer les fichiers**
   ```bash
   # Build frontend
   cd portfolio-frontend && npm run build
   
   # Optimiser backend
   cd ../portfolio-backend
   composer install --no-dev --optimize-autoloader
   ```

2. **Upload via FTP/SFTP**
   - Uploader `portfolio-frontend/build/*` vers le dossier public_html
   - Uploader `portfolio-backend/` vers un dossier privé
   - Configurer la base de données via le panel d'hébergement

#### Option 3: Services cloud (Vercel, Netlify, Heroku)

**Vercel (Frontend):**
```bash
cd portfolio-frontend
npm install -g vercel
vercel
```

**Heroku (Backend):**
```bash
cd portfolio-backend
# Créer Procfile
echo "web: heroku-php-apache2 public/" > Procfile
git add . && git commit -m "Deploy to Heroku"
heroku create your-app-name
git push heroku main
```

### 🔒 Configuration HTTPS

```bash
# Avec Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## 🐛 Dépannage

### Problèmes courants

**❌ Erreur "Cannot find module"**
```bash
cd portfolio-frontend && npm install
# ou
cd portfolio-backend && composer install
```

**❌ Erreur base de données**
```bash
cd portfolio-backend
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

**❌ Erreur JWT**
```bash
# Regénérer les clés JWT
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

**❌ Problème de permissions (Linux)**
```bash
sudo chown -R $USER:$USER .
sudo chmod -R 755 portfolio-backend/var/
```

### Logs utiles

```bash
# Frontend
npm start # Les erreurs s'affichent dans le terminal

# Backend
tail -f portfolio-backend/var/log/dev.log
# ou
php bin/console debug:router # Voir les routes disponibles
```

## 📝 Notes pour le futur

### 🔄 Maintenance régulière

```bash
# Mettre à jour les dépendances
cd portfolio-frontend && npm update
cd portfolio-backend && composer update

# Nettoyer le cache Symfony
php bin/console cache:clear
```

### 📊 Monitoring

- Surveiller les logs d'erreur
- Vérifier les performances avec les DevTools
- Tester régulièrement sur mobile

### 🚀 Améliorations futures

- [ ] Ajouter des tests automatisés
- [ ] Implémenter un système de cache Redis
- [ ] Ajouter la compression d'images
- [ ] Mettre en place un CDN pour les assets
- [ ] Ajouter Google Analytics
- [ ] Implémenter un système de newsletter

### 📋 Commandes utiles à retenir

```bash
# Développement
npm start                              # Lancer le frontend
symfony server:start                   # Lancer le backend
php bin/console make:entity           # Créer une entité Doctrine

# Production
npm run build                         # Build frontend
composer install --no-dev            # Install prod dependencies
php bin/console cache:clear --env=prod # Clear prod cache

# Base de données
php bin/console doctrine:migrations:migrate  # Appliquer migrations
php bin/console doctrine:fixtures:load      # Charger des données de test

# Git
git add . && git commit -m "message" && git push origin DEV
```

---

## 👨‍💻 Développé par Clément Castex

**Contact :** ccastex@normandiewebschool.fr

---

*Ce README a été généré pour vous aider à maintenir et déployer votre portfolio facilement. N'hésitez pas à le mettre à jour selon vos besoins !* 🚀
