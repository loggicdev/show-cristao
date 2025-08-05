import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, SkipForward, X, Users, CircleCheck as CheckCircle, Chrome as Home, ArrowRight, BookOpen, Zap, Heart, Crown } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  reference: string;
  explanation: string;
}

interface Character {
  name: string;
  hint: string;
  verse: string;
  emoji: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quem foi o primeiro homem criado por Deus?",
    options: ["Abel", "Adão", "Noé", "Abraão"],
    correctAnswer: 1,
    reference: "Gênesis 2:7",
    explanation: "Deus formou o homem do pó da terra e soprou em suas narinas o fôlego da vida."
  },
  {
    id: 2,
    question: "Quantos dias Jesus ficou no deserto?",
    options: ["30 dias", "40 dias", "50 dias", "70 dias"],
    correctAnswer: 1,
    reference: "Mateus 4:2",
    explanation: "Jesus jejuou quarenta dias e quarenta noites no deserto sendo tentado pelo diabo."
  },
  {
    id: 3,
    question: "Qual o nome da mãe de Jesus?",
    options: ["Maria", "Marta", "Miriã", "Rebeca"],
    correctAnswer: 0,
    reference: "Lucas 1:27",
    explanation: "O anjo Gabriel foi enviado por Deus a uma virgem chamada Maria."
  },
  {
    id: 4,
    question: "Quantos discípulos Jesus escolheu?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1,
    reference: "Marcos 3:14",
    explanation: "Jesus escolheu doze discípulos para estarem com Ele e para enviá-los a pregar."
  },
  {
    id: 5,
    question: "Em que cidade Jesus nasceu?",
    options: ["Nazaré", "Jerusalém", "Belém", "Cafarnaum"],
    correctAnswer: 2,
    reference: "Lucas 2:4-7",
    explanation: "José subiu da Galileia, da cidade de Nazaré, à Judeia, à cidade de Davi, chamada Belém."
  }
];

const characters: Character[] = [
  {
    name: "Moisés",
    hint: "Lembre-se das Escrituras que estudamos sobre as origens da humanidade...",
    verse: "No princípio Deus criou os céus e a terra.",
    emoji: "⚡"
  },
  {
    name: "Paulo",
    hint: "Considere os ensinamentos sobre provação, jejum e preparação espiritual...",
    verse: "Em tudo somos atribulados, mas não angustiados.",
    emoji: "✍️"
  },
  {
    name: "João",
    hint: "Relembre a história da anunciação do anjo e o nascimento do Salvador...",
    verse: "E o Verbo se fez carne e habitou entre nós.",
    emoji: "❤️"
  },
  {
    name: "Pedro",
    hint: "Pense nos ensinamentos sobre liderança e os escolhidos do Senhor...",
    verse: "Tu és o Cristo, o Filho do Deus vivo.",
    emoji: "🗝️"
  },
  {
    name: "Davi",
    hint: "Lembre-se das profecias sobre o local do nascimento do Messias...",
    verse: "O Senhor é o meu pastor e nada me faltará.",
    emoji: "👑"
  }
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCharacters, setShowCharacters] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [helpUsed, setHelpUsed] = useState({
    skip: false,
    eliminate: false,
    characters: false
  });

  // Animações
  const timerAnim = useRef(new Animated.Value(1)).current;
  const optionAnims = useRef([...Array(4)].map(() => new Animated.Value(1))).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      
      // Animação de urgência quando restam 10 segundos
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
  }, [timeLeft, showResult]);

  useEffect(() => {
    if (showResult) {
      Animated.spring(resultAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      if (isCorrect) {
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [showResult]);

  const resetTimer = () => {
    setTimeLeft(30);
    timerAnim.setValue(1);
  };

  const handleOptionPress = (index: number) => {
    setSelectedAnswer(index);
    
    // Animação de seleção
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
    setIsCorrect(correct);
    setShowResult(true);
  };

  const skipQuestion = () => {
    if (!helpUsed.skip) {
      setHelpUsed({ ...helpUsed, skip: true });
      nextQuestion();
    }
  };

  const eliminateOption = () => {
    if (!helpUsed.eliminate && eliminatedOptions.length < 2) {
      const correctAnswer = questions[currentQuestion].correctAnswer;
      const availableOptions = [0, 1, 2, 3].filter(
        (index) => index !== correctAnswer && !eliminatedOptions.includes(index)
      );
      
      if (availableOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableOptions.length);
        const optionToEliminate = availableOptions[randomIndex];
        setEliminatedOptions([...eliminatedOptions, optionToEliminate]);
        
        if (eliminatedOptions.length === 1) {
          setHelpUsed({ ...helpUsed, eliminate: true });
        }
      }
    }
  };

  const showCharacterHelp = () => {
    if (!helpUsed.characters) {
      setHelpUsed({ ...helpUsed, characters: true });
      setShowCharacters(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setEliminatedOptions([]);
      resetTimer();
      setHelpUsed({ skip: false, eliminate: false, characters: false });
      resultAnim.setValue(0);
      confettiAnim.setValue(0);
      optionAnims.forEach(anim => anim.setValue(1));
    } else {
      router.push('/(tabs)/');
    }
  };

  const goHome = () => {
    router.push('/(tabs)/');
  };

  const question = questions[currentQuestion];
  const character = characters[currentQuestion];
  const timerProgress = timeLeft / 30;

  if (showResult) {
    return (
      <LinearGradient 
        colors={isCorrect ? ['#059669', '#10b981', '#34d399'] : ['#dc2626', '#ef4444', '#f87171']} 
        style={styles.container}
      >
        {/* Confetti animation para acerto */}
        {isCorrect && (
          <Animated.View style={[styles.confettiContainer, { opacity: confettiAnim }]}>
            <View style={[styles.confetti, styles.confetti1]} />
            <View style={[styles.confetti, styles.confetti2]} />
            <View style={[styles.confetti, styles.confetti3]} />
            <View style={[styles.confetti, styles.confetti4]} />
            <View style={[styles.confetti, styles.confetti5]} />
          </Animated.View>
        )}

        <Animated.View style={[styles.resultContainer, { 
          transform: [{ 
            scale: resultAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }] 
        }]}>
          <View style={styles.resultIcon}>
            {isCorrect ? (
              <CheckCircle size={100} color="#ffffff" />
            ) : (
              <X size={100} color="#ffffff" />
            )}
          </View>
          
          <Text style={styles.resultTitle}>
            {isCorrect ? '🎉 PARABÉNS! 🎉' : '😔 Ops! Não foi dessa vez'}
          </Text>
          
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
                <Home size={24} color="#1e40af" />
                <Text style={styles.resultButtonText}>Início</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultButton} onPress={nextQuestion}>
              <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.resultButtonGradient}>
                <ArrowRight size={24} color="#1e40af" />
                <Text style={[styles.resultButtonText, { color: '#1e40af' }]}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

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
            <View style={[styles.timerProgress, { 
              transform: [{ 
                rotate: `${(1 - timerProgress) * 360}deg` 
              }] 
            }]} />
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
          onPress={skipQuestion}
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
          onPress={eliminateOption}
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
          onPress={showCharacterHelp}
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
});