import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Appbar, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { projectsAPI } from './../services/api';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectsAPI.get(parseInt(id));
      setProject(data);
      
      // Combine HTML, CSS, and JS into a single HTML file
      const combinedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${data.css || ''}
          </style>
        </head>
        <body>
          ${data.html || ''}
          <script>
            ${data.js || ''}
          </script>
        </body>
        </html>
      `;
      setHtml(combinedHtml);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await projectsAPI.export(parseInt(id));
      alert('Website exported successfully!');
    } catch (error) {
      alert('Failed to export website');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Preview" />
        <Appbar.Action icon="download" onPress={handleExport} />
      </Appbar.Header>
      <WebView
        source={{ html }}
        style={styles.webview}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});
