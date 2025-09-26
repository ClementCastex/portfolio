# 🚀 Guide de Déploiement Portfolio v3 en Production

## 📋 Vue d'ensemble

**Domaine cible** : `clementcastex.art`  
**Serveur** : VPS Debian Linux  
**Architecture** : Frontend React + Backend Symfony + Base de données MySQL  
**SSL** : Certificat Let's Encrypt  

---

## 🛠️ Étape 1 : Préparation du Serveur VPS

### 1.1 Connexion et mise à jour
```bash
# Connexion SSH au VPS
ssh root@votre-ip-vps

# Mise à jour du système
apt update && apt upgrade -y

# Installation des dépendances essentielles
apt install -y nginx mysql-server php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-gd php8.2-intl nodejs npm git certbot python3-certbot-nginx composer curl wget unzip
```

### 1.2 Configuration MySQL
```bash
# Sécurisation MySQL
mysql_secure_installation

# Connexion MySQL
mysql -u root -p

# Création de la base de données et utilisateur
CREATE DATABASE db_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON db_portfolio.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.3 Configuration PHP
```bash
# Éditer la configuration PHP-FPM
nano /etc/php/8.2/fpm/php.ini

# Modifications importantes :
upload_max_filesize = 20M
post_max_size = 20M
memory_limit = 256M
max_execution_time = 300

# Redémarrer PHP-FPM
systemctl restart php8.2-fpm
```

---

## 📁 Étape 2 : Déploiement du Code

### 2.1 Clone du repository
```bash
# Aller dans le répertoire web
cd /var/www

# Cloner le projet
git clone https://github.com/ClementCastex/portfolio.git clementcastex.art
cd clementcastex.art

# Passer sur la branche DEV (production)
git checkout DEV
```

### 2.2 Configuration Backend (Symfony)
```bash
cd portfolio-backend

# Installation des dépendances
composer install --no-dev --optimize-autoloader

# Configuration de l'environnement
cp .env .env.local

# Éditer .env.local
nano .env.local
```

**Contenu de `.env.local` pour production :**
```env
# Production environment
APP_ENV=prod
APP_DEBUG=false
APP_SECRET=VOTRE_SECRET_SYMFONY_UNIQUE_32_CHARS

# Database
DATABASE_URL="mysql://portfolio_user:VOTRE_MOT_DE_PASSE@127.0.0.1:3306/db_portfolio?serverVersion=mariadb-10.6.22&charset=utf8mb4"

# JWT Configuration
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=

# CORS (ajuster selon vos besoins)
CORS_ALLOW_ORIGIN=https://clementcastex.art
```

### 2.3 Configuration JWT
```bash
# Créer le dossier JWT
mkdir -p config/jwt

# Générer les clés JWT
openssl genpkey -out config/jwt/private.pem -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout

# Permissions
chmod 600 config/jwt/private.pem
chmod 644 config/jwt/public.pem
```

### 2.4 Base de données et cache
```bash
# Créer la base de données
php bin/console doctrine:database:create --env=prod

# Appliquer les migrations
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

# Créer l'utilisateur admin
php bin/console doctrine:fixtures:load --no-interaction --env=prod
# OU créer manuellement :
# php bin/console app:create-admin clement.castex22@gmail.com admin123

# Vider le cache
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod

# Permissions
chown -R www-data:www-data var/
chmod -R 755 var/
chown -R www-data:www-data public/uploads/
chmod -R 755 public/uploads/
```

### 2.5 Configuration Frontend (React)
```bash
cd ../portfolio-frontend

# Installation des dépendances
npm ci --production

# Configuration de l'environnement
nano .env.production
```

**Contenu de `.env.production` :**
```env
REACT_APP_API_URL=https://clementcastex.art/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### 2.6 Build du frontend
```bash
# Build de production
npm run build

# Le dossier 'build' contient maintenant l'application optimisée
```

---

## 🌐 Étape 3 : Configuration Nginx

### 3.1 Configuration du site
```bash
# Créer la configuration Nginx
nano /etc/nginx/sites-available/clementcastex.art
```

**Contenu de la configuration Nginx :**
```nginx
server {
    listen 80;
    server_name clementcastex.art www.clementcastex.art;
    root /var/www/clementcastex.art/portfolio-frontend/build;
    index index.html;

    # Gestion des fichiers statiques React
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend Symfony
    location /api {
        alias /var/www/clementcastex.art/portfolio-backend/public;
        try_files $uri /index.php$is_args$args;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/clementcastex.art/portfolio-backend/public/index.php;
            fastcgi_param DOCUMENT_ROOT /var/www/clementcastex.art/portfolio-backend/public;
        }
    }

    # Uploads (Notes et Kanban)
    location /uploads {
        alias /var/www/clementcastex.art/portfolio-backend/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    location ~ /\. {
        deny all;
    }

    # Optimisations
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 3.2 Activation du site
```bash
# Activer le site
ln -s /etc/nginx/sites-available/clementcastex.art /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

---

## 🔒 Étape 4 : Configuration SSL (Let's Encrypt)

### 4.1 Obtention du certificat SSL
```bash
# Obtenir le certificat SSL automatiquement
certbot --nginx -d clementcastex.art -d www.clementcastex.art

# Vérifier le renouvellement automatique
certbot renew --dry-run

# Configuration du renouvellement automatique
crontab -e
# Ajouter cette ligne :
0 12 * * * /usr/bin/certbot renew --quiet
```

### 4.2 Configuration finale Nginx (après SSL)
Le fichier sera automatiquement modifié par Certbot, mais vérifiez qu'il ressemble à :

```nginx
server {
    listen 443 ssl http2;
    server_name clementcastex.art www.clementcastex.art;
    
    ssl_certificate /etc/letsencrypt/live/clementcastex.art/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/clementcastex.art/privkey.pem;
    
    # ... reste de la configuration identique
}

server {
    listen 80;
    server_name clementcastex.art www.clementcastex.art;
    return 301 https://$server_name$request_uri;
}
```

---

## ⚙️ Étape 5 : Modifications du Code pour Production

### 5.1 Backend - Configuration CORS
```bash
# Éditer config/packages/nelmio_cors.yaml
nano portfolio-backend/config/packages/nelmio_cors.yaml
```

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['https://clementcastex\.art']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api/':
            origin_regex: true
            allow_origin: ['https://clementcastex\.art']
```

### 5.2 Frontend - Variables d'environnement
Le fichier `.env.production` doit contenir :
```env
REACT_APP_API_URL=https://clementcastex.art/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### 5.3 Sécurité - Masquer les informations sensibles
```bash
# Backend - Masquer les erreurs en production
# Dans .env.local, vérifier :
APP_DEBUG=false

# Supprimer les fichiers de développement
rm -f portfolio-backend/.env.local.dist
rm -f portfolio-backend/var/log/*.log
```

---

## 🔄 Étape 6 : Script de Déploiement Automatique

### 6.1 Créer un script de déploiement
```bash
nano /var/www/deploy.sh
chmod +x /var/www/deploy.sh
```

**Contenu du script `deploy.sh` :**
```bash
#!/bin/bash

echo "🚀 Déploiement Portfolio v3..."

# Variables
PROJECT_DIR="/var/www/clementcastex.art"
BACKEND_DIR="$PROJECT_DIR/portfolio-backend"
FRONTEND_DIR="$PROJECT_DIR/portfolio-frontend"

# Aller dans le répertoire du projet
cd $PROJECT_DIR

# Sauvegarder la base de données
echo "💾 Sauvegarde de la base de données..."
mysqldump -u portfolio_user -p db_portfolio > backup_$(date +%Y%m%d_%H%M%S).sql

# Récupérer les dernières modifications
echo "📥 Récupération du code..."
git pull origin DEV

# Backend
echo "🔧 Mise à jour Backend..."
cd $BACKEND_DIR
composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction --env=prod
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod

# Frontend
echo "🎨 Build Frontend..."
cd $FRONTEND_DIR
npm ci --production
npm run build

# Permissions
echo "🔐 Ajustement des permissions..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR
chmod -R 755 $BACKEND_DIR/var/
chmod -R 755 $BACKEND_DIR/public/uploads/

# Redémarrage des services
echo "🔄 Redémarrage des services..."
systemctl reload nginx
systemctl restart php8.2-fpm

echo "✅ Déploiement terminé !"
echo "🌐 Site accessible sur : https://clementcastex.art"
```

---

## 🗂️ Étape 7 : Configuration DNS

### 7.1 Configuration chez votre registrar
Configurez les enregistrements DNS :

```
Type    Nom                 Valeur
A       clementcastex.art   VOTRE_IP_VPS
A       www                 VOTRE_IP_VPS
CNAME   www                 clementcastex.art
```

---

## 🔒 Étape 8 : Sécurité Production

### 8.1 Firewall
```bash
# Configuration UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### 8.2 Fail2Ban (protection contre les attaques)
```bash
apt install fail2ban

# Configuration
nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

### 8.3 Sécurisation des fichiers sensibles
```bash
# Permissions strictes
chmod 600 portfolio-backend/.env.local
chmod 600 portfolio-backend/config/jwt/private.pem
chmod 644 portfolio-backend/config/jwt/public.pem

# Masquer les fichiers sensibles
echo "portfolio-backend/.env.local" >> .gitignore
echo "portfolio-backend/config/jwt/*.pem" >> .gitignore
```

---

## 📊 Étape 9 : Monitoring et Logs

### 9.1 Configuration des logs
```bash
# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs Symfony
tail -f /var/www/clementcastex.art/portfolio-backend/var/log/prod.log

# Logs système
journalctl -u nginx -f
journalctl -u php8.2-fpm -f
```

### 9.2 Monitoring basique
```bash
# Script de monitoring simple
nano /root/monitor.sh
chmod +x /root/monitor.sh
```

```bash
#!/bin/bash
echo "📊 Status Portfolio v3 - $(date)"
echo "🌐 Nginx: $(systemctl is-active nginx)"
echo "🐘 PHP-FPM: $(systemctl is-active php8.2-fpm)"
echo "🗄️ MySQL: $(systemctl is-active mysql)"
echo "💾 Espace disque: $(df -h / | tail -1 | awk '{print $5}')"
echo "🧠 RAM: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "🌡️ Load: $(uptime | awk -F'load average:' '{print $2}')"
```

---

## 🔄 Étape 10 : Maintenance et Mises à Jour

### 10.1 Procédure de mise à jour
```bash
# 1. Sauvegarde
mysqldump -u portfolio_user -p db_portfolio > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Mise à jour du code
cd /var/www/clementcastex.art
git pull origin DEV

# 3. Backend
cd portfolio-backend
composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction --env=prod
php bin/console cache:clear --env=prod

# 4. Frontend
cd ../portfolio-frontend
npm ci --production
npm run build

# 5. Redémarrage
systemctl reload nginx
systemctl restart php8.2-fpm
```

### 10.2 Sauvegarde automatique
```bash
# Ajouter au crontab
crontab -e

# Sauvegarde quotidienne à 2h du matin
0 2 * * * mysqldump -u portfolio_user -pVOTRE_MOT_DE_PASSE db_portfolio | gzip > /root/backups/portfolio_$(date +\%Y\%m\%d).sql.gz

# Nettoyage des anciennes sauvegardes (garde 30 jours)
0 3 * * * find /root/backups/ -name "portfolio_*.sql.gz" -mtime +30 -delete
```

---

## ⚡ Étape 11 : Optimisations Performance

### 11.1 Configuration Nginx optimisée
```nginx
# Ajouter dans le bloc server
client_max_body_size 20M;
client_body_timeout 60s;
client_header_timeout 60s;
keepalive_timeout 65;
send_timeout 60s;

# Cache statique
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    gzip_static on;
}

# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json
    image/svg+xml;
```

### 11.2 Optimisation MySQL
```sql
# Configuration MySQL pour performance
# Dans /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
query_cache_type = 1
query_cache_size = 32M
max_connections = 100
```

---

## 🔍 Étape 12 : Tests et Validation

### 12.1 Tests de fonctionnement
```bash
# Test API
curl -X GET https://clementcastex.art/api/projects

# Test frontend
curl -I https://clementcastex.art

# Test SSL
curl -I https://clementcastex.art | grep -i ssl
```

### 12.2 Checklist de validation
- [ ] ✅ Site accessible sur https://clementcastex.art
- [ ] ✅ Redirection HTTP → HTTPS
- [ ] ✅ Certificat SSL valide
- [ ] ✅ API fonctionnelle (/api/projects)
- [ ] ✅ Connexion admin possible
- [ ] ✅ Upload d'images fonctionnel
- [ ] ✅ Bloc-notes accessible
- [ ] ✅ Kanban accessible
- [ ] ✅ Export PDF/PNG fonctionnel
- [ ] ✅ Thème clair/sombre fonctionnel

---

## 🚨 Étape 13 : Dépannage Courant

### 13.1 Problèmes fréquents

**Erreur 500 - Internal Server Error**
```bash
# Vérifier les logs
tail -f /var/log/nginx/error.log
tail -f /var/www/clementcastex.art/portfolio-backend/var/log/prod.log

# Vérifier les permissions
chown -R www-data:www-data /var/www/clementcastex.art/portfolio-backend/var/
```

**Erreur CORS**
```bash
# Vérifier la configuration CORS
grep -r "CORS_ALLOW_ORIGIN" portfolio-backend/

# Vérifier que l'URL est correcte dans .env.local
```

**Base de données inaccessible**
```bash
# Tester la connexion
mysql -u portfolio_user -p db_portfolio

# Vérifier les credentials dans .env.local
```

### 13.2 Commandes de diagnostic
```bash
# Status des services
systemctl status nginx
systemctl status php8.2-fpm
systemctl status mysql

# Espace disque
df -h

# Processus
ps aux | grep nginx
ps aux | grep php-fpm

# Ports ouverts
netstat -tlnp
```

---

## 📱 Étape 14 : Fonctionnalités Spécifiques Production

### 14.1 Configuration email (optionnel)
Pour les notifications futures :
```bash
apt install postfix

# Configuration SMTP dans Symfony
# .env.local :
MAILER_DSN=smtp://localhost:587
```

### 14.2 Analytics (optionnel)
Ajouter Google Analytics dans le frontend :
```javascript
// Dans public/index.html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## 🎯 Étape 15 : Checklist Finale

### 15.1 Avant le lancement
- [ ] ✅ DNS configuré et propagé
- [ ] ✅ SSL installé et fonctionnel
- [ ] ✅ Base de données migrée
- [ ] ✅ Utilisateur admin créé
- [ ] ✅ Uploads fonctionnels
- [ ] ✅ Sauvegarde configurée
- [ ] ✅ Monitoring en place

### 15.2 Après le lancement
- [ ] ✅ Test complet de toutes les fonctionnalités
- [ ] ✅ Performance vérifiée
- [ ] ✅ Sécurité validée
- [ ] ✅ Sauvegarde testée
- [ ] ✅ Certificat SSL vérifié

---

## 🚀 Commandes de Déploiement Rapide

### Une fois la configuration initiale faite

```bash
# Déploiement rapide (à partir de la 2ème fois)
cd /var/www/clementcastex.art
git pull origin DEV
cd portfolio-backend && composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction --env=prod
php bin/console cache:clear --env=prod
cd ../portfolio-frontend && npm ci --production && npm run build
systemctl reload nginx && systemctl restart php8.2-fpm
```

---

## 📞 Support et Ressources

### Logs importants à surveiller
- `/var/log/nginx/error.log` - Erreurs Nginx
- `/var/www/clementcastex.art/portfolio-backend/var/log/prod.log` - Erreurs Symfony
- `/var/log/mysql/error.log` - Erreurs MySQL

### Commandes utiles
```bash
# Redémarrage complet
systemctl restart nginx php8.2-fpm mysql

# Vérification de l'état
./monitor.sh

# Déploiement
./deploy.sh
```

---

**🎉 Votre Portfolio v3 sera maintenant accessible sur https://clementcastex.art avec toutes les fonctionnalités Notes et Kanban opérationnelles !**

**📝 Ce guide vous permettra de déployer et maintenir votre portfolio en production de manière professionnelle.**
