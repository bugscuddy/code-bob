import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { projectsAPI } from './../services/api';

interface Project {
  id: number;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.list();
      setProjects(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await projectsAPI.delete(id);
              loadProjects();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.detail || 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const handleExport = async (id: number) => {
    try {
      const blob = await projectsAPI.export(id);
      Alert.alert('Export', 'Website files exported successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to export website');
    }
  };


  const renderProject = ({ item }: { item: Project }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.prompt.substring(0, 50)}...</Title>
        <Paragraph style={styles.date}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`/preview/${item.id}`)}>Preview</Button>
        <Button onPress={() => handleExport(item.id)}>Export</Button>
        <Button onPress={() => handleDelete(item.id)} textColor="red">Delete</Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubtext}>Create your first website!</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
});
