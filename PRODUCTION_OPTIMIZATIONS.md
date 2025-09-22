# 🚀 OPTIMISATIONS SPÉCIFIQUES PRODUCTION

## 📋 **CONFIGURATION PRODUCTION FINALE**

### 1. **Variables d'environnement** (.env.prod)
```bash
# Copier depuis ENV_PROD_TEMPLATE.md
cp ENV_PROD_TEMPLATE.md .env.prod

# Variables à personnaliser :
APP_SECRET=GENERATE_NEW_STRONG_SECRET
DATABASE_URL=mysql://user:password@localhost:3306/db_portfolio
JWT_PASSPHRASE=STRONG_PASSPHRASE_HERE
CORS_ALLOW_ORIGIN=https://clementcastex.art
```

### 2. **Build optimisé**
```bash
# Frontend
cd portfolio-frontend
npm run build

# Backend - Cache clear
cd portfolio-backend
php bin/console cache:clear --env=prod
```

### 3. **Sécurité serveur** (Nginx/Apache)
```apache
# Headers sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# HSTS (HTTPS uniquement)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

### 4. **Base de données**
```sql
-- Indexes de performance (optionnel)
CREATE INDEX idx_project_status ON project(status);
CREATE INDEX idx_kanban_owner ON kanban(owner_id);
CREATE INDEX idx_cards_column_id ON kanban_cards(column_id);
```

## 🎯 **CHECKLIST DÉPLOIEMENT**

### **Pré-déploiement**
- [ ] Variables .env.prod configurées
- [ ] Clés JWT générées
- [ ] Build frontend testé (`npm run build`)
- [ ] Cache backend vidé
- [ ] Base de données migrée

### **Déploiement**
- [ ] Fichiers uploadés sur VPS
- [ ] Nginx/Apache configuré
- [ ] SSL/HTTPS activé
- [ ] Permissions fichiers correctes
- [ ] Services démarrés

### **Post-déploiement**
- [ ] Site accessible via HTTPS
- [ ] Uploads fonctionnent
- [ ] Login/register fonctionne
- [ ] Toutes les fonctionnalités testées
- [ ] Monitoring configuré

## 🔧 **COMMANDES DÉPLOIEMENT**

### **1. Préparation locale**
```bash
# Build frontend
cd portfolio-frontend
npm run build

# Cache backend
cd ../portfolio-backend
php bin/console cache:clear --env=prod
```

### **2. Upload VPS**
```bash
# Compresser le projet (sans node_modules, .git, etc.)
tar -czf portfolio-v3-prod.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=portfolio-frontend/node_modules \
  --exclude=portfolio-backend/var/cache \
  portfolio-v3/

# Upload sur VPS
scp portfolio-v3-prod.tar.gz user@clementcastex.art:/var/www/
```

### **3. Configuration VPS**
```bash
# Décompresser
cd /var/www/
tar -xzf portfolio-v3-prod.tar.gz
cd portfolio-v3

# Permissions
chown -R www-data:www-data portfolio-backend/public/uploads
chmod -R 755 portfolio-backend/public/uploads

# Configuration
cp ENV_PROD_TEMPLATE.md portfolio-backend/.env.prod
# Éditer .env.prod avec vraies valeurs

# Cache
cd portfolio-backend
php bin/console cache:clear --env=prod
```

## 📊 **MONITORING PRODUCTION**

### **Logs à surveiller**
```bash
# Logs Symfony
tail -f portfolio-backend/var/log/prod.log

# Logs Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Logs système
journalctl -u nginx -f
```

### **Métriques importantes**
- **Uptime** : > 99.9%
- **Temps de réponse** : < 2s
- **Erreurs 5xx** : < 1%
- **Espace disque** : > 20% libre
- **Mémoire** : < 80% utilisée

## 🚨 **MAINTENANCE**

### **Mises à jour sécurité**
```bash
# Frontend
cd portfolio-frontend
npm audit fix
npm update

# Backend
cd portfolio-backend
composer update
php bin/console doctrine:migrations:migrate
```

### **Sauvegardes**
```bash
# Base de données
mysqldump -u user -p db_portfolio > backup_$(date +%Y%m%d).sql

# Fichiers uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz portfolio-backend/public/uploads/
```

## 🎉 **FÉLICITATIONS !**

Votre portfolio est maintenant prêt pour la production avec :
- ✅ Sécurité renforcée
- ✅ Performance optimisée  
- ✅ Configuration production
- ✅ Documentation complète
- ✅ Monitoring prêt

**Bon déploiement ! 🚀**
