import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Card, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Profile</Title>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodyLarge">Logged in user</Text>
          <Text variant="bodyMedium" style={styles.text}>
            Manage your account and settings here.
          </Text>
        </Card.Content>
      </Card>

    </View>
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
    marginBottom: 20,
  },
  text: {
    marginTop: 8,
    color: '#666',
  },
});
