import { StyleSheet } from 'react-native';

export const ErrorStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#F8F8F8',
    },
    errorIcon: {
      fontSize: 80,
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#333',
    },
    description: {
      fontSize: 16,
      color: '#666',
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    instructions: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      textAlign: 'center',
      color: '#333',
    },
    steps: {
      fontSize: 14,
      color: '#555',
      marginBottom: 32,
      textAlign: 'left',
      lineHeight: 20,
      backgroundColor: '#FFF',
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF',
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 12,
    },
  });
  