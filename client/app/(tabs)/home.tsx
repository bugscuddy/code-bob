import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Card, Chip, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { projectsAPI, templatesAPI } from './../services/api';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [style, setStyle] = useState('modern');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  
  const router = useRouter();

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templatesAPI.list();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a description for your website');
      return;
    }

    setLoading(true);
    try {
      const project = await projectsAPI.generate(
        prompt,
        selectedTemplate || undefined,
        style,
        industry || undefined
      );
      router.push(`/preview/${project.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  const styles_list = ['modern', 'minimal', 'corporate', 'creative', 'dark'];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Generate Website</Title>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.label}>Describe your website</Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="e.g., A landing page for a coffee shop with a hero section, menu, and contact form..."
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.label}>Select Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            <Chip
              selected={selectedTemplate === null}
              onPress={() => setSelectedTemplate(null)}
              style={styles.chip}
            >
              None
            </Chip>
            {templates.map((template) => (
              <Chip
                key={template.id}
                selected={selectedTemplate === template.id}
                onPress={() => setSelectedTemplate(template.id)}
                style={styles.chip}
              >
                {template.name}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.label}>Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {styles_list.map((s) => (
              <Chip
                key={s}
                selected={style === s}
                onPress={() => setStyle(s)}
                style={styles.chip}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.label}>Industry (Optional)</Text>
          <TextInput
            value={industry}
            onChangeText={setIndustry}
            mode="outlined"
            placeholder="e.g., technology, food, healthcare..."
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleGenerate}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Generate Website
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  chipContainer: {
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
