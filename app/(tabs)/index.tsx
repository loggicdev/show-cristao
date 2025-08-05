import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BookOpen, Play, Star } from 'lucide-react-native';

export default function HomeScreen() {
  const startQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  return (
    <LinearGradient colors={['#1e3a8a', '#3730a3', '#1e40af']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <BookOpen size={60} color="#fbbf24" />
          <Text style={styles.title}>Quiz Bíblico</Text>
          <Text style={styles.subtitle}>Teste seus conhecimentos das Escrituras</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Star size={24} color="#fbbf24" />
            <Text style={styles.featureText}>Perguntas desafiadoras</Text>
          </View>
          <View style={styles.feature}>
            <BookOpen size={24} color="#fbbf24" />
            <Text style={styles.featureText}>Referências bíblicas</Text>
          </View>
          <View style={styles.feature}>
            <Play size={24} color="#fbbf24" />
            <Text style={styles.featureText}>Jogue sem cadastro</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.buttonGradient}>
            <Play size={24} color="#1e3a8a" />
            <Text style={styles.startButtonText}>Começar Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho." - Salmos 119:105
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e2e8f0',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#e2e8f0',
    marginLeft: 12,
  },
  startButton: {
    width: '80%',
    marginBottom: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});