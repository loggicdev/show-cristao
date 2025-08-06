
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { X, Home as Chrome, ArrowRight, BookOpen, Zap, Crown, Clock, Users } from 'lucide-react-native';
import questions from '../../data/questions';
import characters from '../../data/characters';

const { height } = Dimensions.get('window');

export default function QuizErrorScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCharacters, setShowCharacters] = useState(false);
  const [showResult, setShowResult] = useState(true); // já mostra o resultado de erro
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [helpUsed, setHelpUsed] = useState({
    skip: false,
    eliminate: false,
    characters: false
  });
  const resultAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showResult) {
      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [showResult]);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setEliminatedOptions([]);
      setHelpUsed({ skip: false, eliminate: false, characters: false });
      resultAnim.setValue(0);
    } else {
      router.replace('/');
    }
  };

  const goHome = () => {
    router.replace('/(tabs)');
  };

  const question = questions[currentQuestion];

  return (
    <LinearGradient colors={['#dc2626', '#ef4444', '#f87171']} style={styles.container}>
      <Animated.View style={[styles.resultContainer, {
        transform: [{
          scale: resultAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          })
        }]
      }]}
      >
        <View style={styles.resultIcon}>
          <X size={100} color="#ffffff" />
        </View>
        <Text style={styles.resultTitle}>😔 Ops! Não foi dessa vez</Text>
        <View style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <BookOpen size={28} color="#fbbf24" />
            <Text style={styles.referenceTitle}>Referência Bíblica</Text>
          </View>
          <Text style={styles.reference}>{question.reference}</Text>
          <Text style={styles.explanation}>{question.explanation}</Text>
        </View>
        <View style={styles.resultButtons}>
          <TouchableOpacity style={styles.resultButton} onPress={goHome}>
            <LinearGradient colors={['#ffffff', '#f1f5f9']} style={styles.resultButtonGradient}>
              <Chrome size={24} color="#1e40af" />
              <Text style={styles.resultButtonText}>Início</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultIcon: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  referenceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referenceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginLeft: 12,
  },
  reference: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 16,
    textAlign: 'center',
  },
  explanation: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  resultButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginLeft: 8,
  },
});