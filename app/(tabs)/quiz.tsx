import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Clock, SkipForward, X, Users, Zap, Crown, BookOpen } from 'lucide-react-native';
import questions from '../../data/questions';
import characters from '../../data/characters';

const { height } = Dimensions.get('window');

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    if (params && params.questionIndex) {
      const idx = parseInt(params.questionIndex as string, 10);
      if (!isNaN(idx)) return idx;
    }
    return 0;
  });
  const question = questions[currentQuestion];
  const character = characters[currentQuestion % characters.length];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCharacters, setShowCharacters] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [helpUsed, setHelpUsed] = useState({
    skip: false,
    eliminate: false,
    characters: false
  });
  // Feedback de resultado removido, agora só nas telas de sucesso/erro
  const router = useRouter();
  const timerAnim = useRef(new Animated.Value(1)).current;
  const optionAnims = useRef([...Array(4)].map(() => new Animated.Value(1))).current;
  // ...

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setEliminatedOptions([]);
    setHelpUsed({ skip: false, eliminate: false, characters: false });
    setTimeLeft(30);
    timerAnim.setValue(1);
    optionAnims.forEach(anim => anim.setValue(1));
    // Removido: estados e animações de feedback de resultado
  }, [optionAnims, timerAnim]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      if (timeLeft <= 10) {
        Animated.sequence([
          Animated.timing(timerAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(timerAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswer();
    }
  }, [timeLeft]);

  // ...

  const handleOptionPress = (index: number) => {
    setSelectedAnswer(index);
    Animated.sequence([
      Animated.timing(optionAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(optionAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = () => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    const nextIndex = currentQuestion + 1;
    if (correct) {
      if (nextIndex >= questions.length) {
        router.replace('/QuizCompleteScreen');
      } else {
        router.replace(`/QuizSuccessScreen?questionIndex=${nextIndex}`);
      }
    } else {
      router.replace('/QuizErrorScreen');
    }
  };

  // Feedback de resultado removido, agora só nas telas de sucesso/erro

  return (
    <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.container}>
      {/* Header com timer e progresso */}
      <View style={styles.quizHeader}>
        <View style={styles.progressContainer}>
          <Text style={styles.questionCounter}>
            {currentQuestion + 1}/{questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
          </View>
        </View>
        <Animated.View style={[styles.timerContainer, { transform: [{ scale: timerAnim }] }]}> 
          <View style={styles.timerCircle}>
            <View style={styles.timerProgress} />
            <View style={styles.timerInner}>
              <Clock size={20} color="#1e40af" />
              <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Pergunta */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Opções de resposta */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <Animated.View key={index} style={{ transform: [{ scale: optionAnims[index] }] }}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                eliminatedOptions.includes(index) && styles.eliminatedOption
              ]}
              onPress={() => handleOptionPress(index)}
              disabled={eliminatedOptions.includes(index)}
            >
              <LinearGradient
                colors={
                  selectedAnswer === index
                    ? ['#fbbf24', '#f59e0b']
                    : eliminatedOptions.includes(index)
                    ? ['#94a3b8', '#64748b']
                    : ['#ffffff', '#f8fafc']
                }
                style={styles.optionGradient}
              >
                <View style={styles.optionLetter}>
                  <Text style={[
                    styles.optionLetterText,
                    selectedAnswer === index && styles.selectedOptionLetterText,
                    eliminatedOptions.includes(index) && styles.eliminatedOptionLetterText
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                  eliminatedOptions.includes(index) && styles.eliminatedOptionText
                ]}>
                  {option}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Botões de ajuda */}
      <View style={styles.helpContainer}>
        <TouchableOpacity
          style={[styles.helpButton, helpUsed.skip && styles.helpButtonDisabled]}
          onPress={() => {
            setHelpUsed(prev => ({ ...prev, skip: true }));
            setCurrentQuestion(q => (q + 1 < questions.length ? q + 1 : q));
            setSelectedAnswer(null);
            setTimeLeft(30);
            optionAnims.forEach(anim => anim.setValue(1));
          }}
          disabled={helpUsed.skip}
        >
          <LinearGradient
            colors={helpUsed.skip ? ['#94a3b8', '#64748b'] : ['#8b5cf6', '#7c3aed']}
            style={styles.helpButtonGradient}
          >
            <SkipForward size={20} color="#ffffff" />
            <Text style={styles.helpButtonText}>Pular</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.helpButton, helpUsed.eliminate && styles.helpButtonDisabled]}
          onPress={() => {
            if (!helpUsed.eliminate) {
              // Elimina uma opção incorreta
              const incorrectOptions = question.options.map((_, idx) => idx).filter(idx => idx !== question.correctAnswer && !eliminatedOptions.includes(idx));
              if (incorrectOptions.length > 0) {
                const toEliminate = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
                setEliminatedOptions(prev => [...prev, toEliminate]);
                setHelpUsed(prev => ({ ...prev, eliminate: true }));
              }
            }
          }}
          disabled={helpUsed.eliminate}
        >
          <LinearGradient
            colors={helpUsed.eliminate ? ['#94a3b8', '#64748b'] : ['#ef4444', '#dc2626']}
            style={styles.helpButtonGradient}
          >
            <X size={20} color="#ffffff" />
            <Text style={styles.helpButtonText}>Eliminar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.helpButton, helpUsed.characters && styles.helpButtonDisabled]}
          onPress={() => {
            setShowCharacters(true);
            setHelpUsed(prev => ({ ...prev, characters: true }));
          }}
          disabled={helpUsed.characters}
        >
          <LinearGradient
            colors={helpUsed.characters ? ['#94a3b8', '#64748b'] : ['#10b981', '#059669']}
            style={styles.helpButtonGradient}
          >
            <Users size={20} color="#ffffff" />
            <Text style={styles.helpButtonText}>Ajuda</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Botão de responder */}
      {selectedAnswer !== null && (
        <View style={styles.answerButtonContainer}>
          <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
            <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.answerButtonGradient}>
              <Zap size={24} color="#1e40af" />
              <Text style={styles.answerButtonText}>RESPONDER!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de personagens */}
      <Modal
        visible={showCharacters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCharacters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.characterModal}>
            <View style={styles.characterModalHeader}>
              <Crown size={32} color="#fbbf24" />
              <Text style={styles.characterModalTitle}>Conselho dos Sábios</Text>
            </View>
            <ScrollView style={styles.characterContent} showsVerticalScrollIndicator={false}>
              <View style={styles.characterCard}>
                <View style={styles.characterHeader}>
                  <Text style={styles.characterEmoji}>{character.emoji}</Text>
                  <Text style={styles.characterName}>{character.name}</Text>
                </View>
                <View style={styles.characterHintContainer}>
                  <Text style={styles.characterHint}>"{character.hint}"</Text>
                  <View style={styles.verseDivider} />
                  <Text style={styles.characterVerse}>"{character.verse}"</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCharacters(false)}
            >
              <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.closeButtonGradient}>
                <Text style={styles.closeButtonText}>Entendi! 🙏</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quizHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e0f2fe',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerProgress: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#ef4444',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 2,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 25,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    elevation: 8,
    shadowOpacity: 0.3,
  },
  eliminatedOption: {
    elevation: 1,
    shadowOpacity: 0.05,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionLetterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  selectedOptionLetterText: {
    color: '#1e40af',
  },
  eliminatedOptionLetterText: {
    color: '#ffffff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    flex: 1,
  },
  selectedOptionText: {
    color: '#1e40af',
  },
  eliminatedOptionText: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  helpButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  helpButtonDisabled: {
    elevation: 1,
    shadowOpacity: 0.1,
  },
  helpButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  helpButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  answerButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  answerButton: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  answerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  answerButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e40af',
    marginLeft: 8,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  characterModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: height * 0.7,
  },
  characterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  characterModalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e40af',
    marginLeft: 12,
  },
  characterContent: {
    maxHeight: height * 0.4,
  },
  characterCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  characterHintContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  characterHint: {
    fontSize: 18,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 12,
  },
  verseDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  characterVerse: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos para feedback animado
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#fbbf24',
  },
  confetti1: {
    top: '20%',
    left: '10%',
    transform: [{ rotate: '45deg' }],
  },
  confetti2: {
    top: '30%',
    right: '15%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  confetti3: {
    top: '25%',
    left: '70%',
    backgroundColor: '#10b981',
    transform: [{ rotate: '30deg' }],
  },
  confetti4: {
    top: '40%',
    left: '20%',
    backgroundColor: '#ef4444',
    borderRadius: 5,
  },
  confetti5: {
    top: '35%',
    right: '25%',
    backgroundColor: '#8b5cf6',
    transform: [{ rotate: '60deg' }],
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

