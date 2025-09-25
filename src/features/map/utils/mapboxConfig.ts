import Mapbox from '@rnmapbox/maps';

export const initializeMapbox = () => {
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN!);

  if (__DEV__) {
    Mapbox.setTelemetryEnabled(false);
  }
};

export const filterMapboxLogs = () => {
  if (__DEV__) {
    const originalError = console.error;
    const originalWarn = console.warn;

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
