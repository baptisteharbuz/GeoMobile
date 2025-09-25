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
    
    // Patterns d'erreurs MapBox à ignorer
    const ignoredPatterns = [
      'MapLoad error Source RNMBX-mapview-point-annotations_drag',
      'RNMBX-mapview-point-annotations_drag is not in style',
      'MapLoad error Source RNMBX-mapview-callouts_drag',
      'RNMBX-mapview-callouts_drag is not in style'
    ];
    
    const shouldIgnoreMessage = (message: string): boolean => {
      return ignoredPatterns.some(pattern => message.includes(pattern));
    };
    
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldIgnoreMessage(message)) {
        originalError.apply(console, args);
      }
    };
    
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldIgnoreMessage(message)) {
        originalWarn.apply(console, args);
      }
    };
  }
};
