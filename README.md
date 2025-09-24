# 🐾 WildWatch - Application de Suivi Géolocalisé

Application React Native avec MapBox permettant de sauvegarder des points d'intérêt avec photos et observations.

## 🚀 Installation et lancement

### Prérequis
- Node.js
- iOS Simulator ou iPhone physique
- Compte MapBox (pour le token)

### Configuration
1. Créer un fichier `.env` à la racine :
```bash
EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN=your_mapbox_token_here
```

2. Installer les dépendances :
```bash
npm install
```

### Lancement
```bash
# iOS Simulator
npm run ios

# Android
npm run android

# Web (développement)
npm run web
```

## 📱 Fonctionnalités

- **Géolocalisation** : Position GPS en temps réel
- **Marqueurs personnalisés** : Ajout de points avec nom, observation et photo
- **Navigation** : Gestion des écrans avec expo-router
- **Persistance** : Sauvegarde locale des marqueurs
- **Permissions** : Gestion native des autorisations de localisation

## 🏗️ Architecture

```
├── app/                    # Navigation (expo-router)
├── screens/               # Écrans principaux
├── components/            # Composants réutilisables
├── hooks/                 # Hooks personnalisés
├── types/                 # Types TypeScript
└── utils/                 # Utilitaires
```

## 🔧 Scripts disponibles

- `npm start` - Démarrer le serveur Expo
- `npm run ios` - Lancer sur iOS
- `npm run android` - Lancer sur Android
- `npm run lint` - Vérifier le code
- `npx tsc` - Vérifier TypeScript