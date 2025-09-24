import Mapbox from '@rnmapbox/maps';

// Configuration MapBox
export const initializeMapbox = () => {
  // Définir le token d'accès
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN!);
  
  // Désactiver les logs MapBox en développement pour éviter les warnings inutiles
  if (__DEV__) {
    // Réduire la verbosité des logs
    Mapbox.setTelemetryEnabled(false);
  }
};

// Filtrer les erreurs connues de MapBox
export const filterMapboxLogs = () => {
  if (__DEV__) {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (
        message.includes('MapLoad error Source RNMBX-mapview-point-annotations_drag') ||
        message.includes('RNMBX-mapview-point-annotations_drag is not in style')
      ) {
        return; // Ignorer ces erreurs spécifiques
      }
      originalError.apply(console, args);
    };
    
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (
        message.includes('MapLoad error Source RNMBX-mapview-point-annotations_drag') ||
        message.includes('RNMBX-mapview-point-annotations_drag is not in style')
      ) {
        return; // Ignorer ces warnings spécifiques
      }
      originalWarn.apply(console, args);
    };
  }
};
