# 🐾 WildWatch

Application React Native (Expo + Expo Router) avec Mapbox pour enregistrer des observations géolocalisées.

## 🚀 Démarrage rapide

### Prérequis
- Node.js
- iOS Simulator ou appareil iOS/Android
- Compte Mapbox (tokens requis)

### Configuration
1) Créer un fichier `.env` à la racine:
```bash
EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN=YOUR_MAPBOX_PUBLIC_TOKEN
MAPBOX_DOWNLOAD_TOKEN=YOUR_MAPBOX_DOWNLOAD_TOKEN
```
2) Installer les dépendances:
```bash
npm install
```
3) Lancer le projet:
```bash
# Dev server
npm start

# iOS (build local via Dev Client)
npm run ios

# Android (build local via Dev Client)
npm run android

# Web (optionnel)
npm run web
```

## 📦 Scripts utiles
- `npm start` : démarre Metro/Expo
- `npm run ios` / `npm run android` : build natif + lancement
- `npm run lint` : lint du projet
- `npm run prebuild` : régénérer iOS/Android (si config native a changé)

## 🗂️ Structure du projet
```
src/
  app/                       # Expo Router (_layout.tsx, index.tsx)
  components/                # UI réutilisable
  features/
    map/                     # Carte Mapbox (écran, hooks, styles, config)
    marker/                  # Modale marqueur (form, hooks, types)
    splash/                  # Écran de splash
    error/                   # Écran d’erreur
```

## ✨ Fonctionnalités principales
- Carte Mapbox, position en temps réel
- Ajouter/éditer/supprimer des marqueurs (titre, observation, image, date)
- DatePicker natif (`@react-native-community/datetimepicker`)
- Haptique à l’ajout/enregistrement (expo-haptics)
- Partage natif (React Native `Share`)
- Recentrage sur la position utilisateur
- Persistance locale (AsyncStorage)

## 🔐 Notes Mapbox
- `EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN` est utilisé côté app
- `MAPBOX_DOWNLOAD_TOKEN` est lu au build natif (plugin `@rnmapbox/maps`)

---
Minimal, à jour et prêt à l’emploi. ✅