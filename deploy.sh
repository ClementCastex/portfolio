#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT PRODUCTION
# Portfolio Clément Castex - clementcastex.art

set -e  # Arrêter en cas d'erreur

echo "🚀 DÉPLOIEMENT PRODUCTION - Portfolio Clément Castex"
echo "=================================================="

# Vérifications préalables
echo "📋 Vérifications préalables..."

# Vérifier que nous sommes sur la branche PROD
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "PROD" ]; then
    echo "❌ Erreur: Vous devez être sur la branche PROD"
    echo "   Utilisez: git checkout PROD"
    exit 1
fi

# Vérifier que .env.prod existe
if [ ! -f "portfolio-backend/.env.prod" ]; then
    echo "❌ Erreur: .env.prod manquant"
    echo "   Copiez ENV_PROD_TEMPLATE.md vers portfolio-backend/.env.prod"
    echo "   Et configurez avec vos vraies valeurs"
    exit 1
fi

echo "✅ Vérifications OK"

# Build frontend
echo "🔨 Build frontend..."
cd portfolio-frontend
npm ci --production
npm run build
echo "✅ Frontend buildé"

# Cache backend
echo "🧹 Nettoyage cache backend..."
cd ../portfolio-backend
php bin/console cache:clear --env=prod
echo "✅ Cache vidé"

# Vérification finale
echo "🔍 Vérifications finales..."

# Vérifier que le build frontend existe
if [ ! -d "portfolio-frontend/build" ]; then
    echo "❌ Erreur: Build frontend manquant"
    exit 1
fi

# Vérifier .env.prod
if ! grep -q "APP_ENV=prod" portfolio-backend/.env.prod; then
    echo "❌ Erreur: .env.prod mal configuré"
    exit 1
fi

echo "✅ Vérifications finales OK"

# Création archive
echo "📦 Création archive de déploiement..."
cd ..
ARCHIVE_NAME="portfolio-v3-prod-$(date +%Y%m%d-%H%M).tar.gz"

tar -czf "$ARCHIVE_NAME" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=portfolio-frontend/node_modules \
    --exclude=portfolio-backend/var/cache \
    --exclude=portfolio-backend/var/log \
    --exclude="*.log" \
    --exclude=".DS_Store" \
    portfolio-v3/

echo "✅ Archive créée: $ARCHIVE_NAME"

# Instructions finales
echo ""
echo "🎉 PRÉPARATION TERMINÉE !"
echo "========================="
echo ""
echo "📋 Prochaines étapes:"
echo "1. Uploader l'archive sur votre VPS:"
echo "   scp $ARCHIVE_NAME user@clementcastex.art:/var/www/"
echo ""
echo "2. Sur le VPS, décompresser:"
echo "   cd /var/www/"
echo "   tar -xzf $ARCHIVE_NAME"
echo "   cd portfolio-v3"
echo ""
echo "3. Configurer les permissions:"
echo "   chown -R www-data:www-data portfolio-backend/public/uploads"
echo "   chmod -R 755 portfolio-backend/public/uploads"
echo ""
echo "4. Configurer Nginx/Apache selon DEPLOYMENT_GUIDE.md"
echo ""
echo "5. Démarrer les services:"
echo "   systemctl restart nginx"
echo "   systemctl restart php8.2-fpm"
echo ""
echo "🚀 Votre portfolio sera accessible sur https://clementcastex.art"
echo ""
echo "📚 Documentation complète dans:"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - PRODUCTION_OPTIMIZATIONS.md"
echo "   - ENV_PROD_TEMPLATE.md"
