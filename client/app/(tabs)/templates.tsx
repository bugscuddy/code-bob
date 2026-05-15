import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, Text } from 'react-native-paper';
import { templatesAPI } from './../services/api';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function TemplatesScreen() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templatesAPI.list();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const renderTemplate = ({ item }: { item: Template }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Chip style={styles.category}>{item.category}</Chip>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Template Library</Title>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Chip>
        ))}
      </View>
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  category: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: {
    color: '#666',
  },
});
