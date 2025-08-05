import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, SkipForward, X, Users, CircleCheck as CheckCircle, Chrome as Home, ArrowRight, BookOpen } from 'lucide-react-native';

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
  }
];

const characters: Character[] = [
  {
    name: "Moisés",
    hint: "Lembre-se das Escrituras que estudamos sobre as origens...",
    verse: "No princípio Deus criou..."
  },
  {
    name: "Paulo",
    hint: "Considere os ensinamentos sobre provação e jejum...",
    verse: "Em tudo somos atribulados..."
  },
  {
    name: "João",
    hint: "Relembre a história da anunciação do anjo...",
    verse: "E o Verbo se fez carne..."
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

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswer();
    }
  }, [timeLeft, showResult]);

  const resetTimer = () => {
    setTimeLeft(30);
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
    } else {
      router.push('/(tabs)/');
    }
  };

  const goHome = () => {
    router.push('/(tabs)/');
  };

  const question = questions[currentQuestion];
  const character = characters[currentQuestion];

  if (showResult) {
    return (
      <LinearGradient colors={isCorrect ? ['#059669', '#10b981'] : ['#dc2626', '#ef4444']} style={styles.container}>
        <View style={styles.resultContainer}>
          <CheckCircle size={80} color="#ffffff" />
          <Text style={styles.resultTitle}>
            {isCorrect ? 'Parabéns!' : 'Ops! Não foi dessa vez'}
          </Text>
          
          <View style={styles.referenceContainer}>
            <BookOpen size={24} color="#ffffff" />
            <Text style={styles.referenceTitle}>Referência Bíblica:</Text>
            <Text style={styles.reference}>{question.reference}</Text>
            <Text style={styles.explanation}>{question.explanation}</Text>
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.resultButton} onPress={goHome}>
              <Home size={20} color="#1e3a8a" />
              <Text style={styles.resultButtonText}>Início</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultButton} onPress={nextQuestion}>
              <ArrowRight size={20} color="#1e3a8a" />
              <Text style={styles.resultButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1e3a8a', '#3730a3']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Clock size={20} color="#fbbf24" />
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>
        <Text style={styles.questionNumber}>
          Pergunta {currentQuestion + 1} de {questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedAnswer === index && styles.selectedOption,
              eliminatedOptions.includes(index) && styles.eliminatedOption
            ]}
            onPress={() => setSelectedAnswer(index)}
            disabled={eliminatedOptions.includes(index)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === index && styles.selectedOptionText,
              eliminatedOptions.includes(index) && styles.eliminatedOptionText
            ]}>
              {String.fromCharCode(65 + index)}) {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity
          style={[styles.helpButton, helpUsed.skip && styles.helpButtonDisabled]}
          onPress={skipQuestion}
          disabled={helpUsed.skip}
        >
          <SkipForward size={20} color={helpUsed.skip ? "#94a3b8" : "#fbbf24"} />
          <Text style={[styles.helpButtonText, helpUsed.skip && styles.helpButtonTextDisabled]}>
            Pular
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.helpButton, helpUsed.eliminate && styles.helpButtonDisabled]}
          onPress={eliminateOption}
          disabled={helpUsed.eliminate}
        >
          <X size={20} color={helpUsed.eliminate ? "#94a3b8" : "#fbbf24"} />
          <Text style={[styles.helpButtonText, helpUsed.eliminate && styles.helpButtonTextDisabled]}>
            Eliminar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.helpButton, helpUsed.characters && styles.helpButtonDisabled]}
          onPress={showCharacterHelp}
          disabled={helpUsed.characters}
        >
          <Users size={20} color={helpUsed.characters ? "#94a3b8" : "#fbbf24"} />
          <Text style={[styles.helpButtonText, helpUsed.characters && styles.helpButtonTextDisabled]}>
            Ajuda
          </Text>
        </TouchableOpacity>
      </View>

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
          <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.answerButtonGradient}>
            <Text style={styles.answerButtonText}>Responder</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCharacters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCharacters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.characterModal}>
            <Text style={styles.characterModalTitle}>Conselho dos Sábios</Text>
            
            <ScrollView style={styles.characterContent}>
              <View style={styles.characterCard}>
                <Text style={styles.characterName}>{character.name}</Text>
                <Text style={styles.characterHint}>"{character.hint}"</Text>
                <Text style={styles.characterVerse}>{character.verse}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCharacters(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginLeft: 8,
  },
  questionNumber: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: '#fbbf24',
  },
  eliminatedOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  eliminatedOptionText: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  helpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  helpButtonDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  helpButtonText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  helpButtonTextDisabled: {
    color: '#94a3b8',
  },
  answerButton: {
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  answerButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  characterModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  characterModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterContent: {
    maxHeight: 200,
  },
  characterCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  characterHint: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 22,
  },
  characterVerse: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  referenceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  referenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 8,
  },
  reference: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 12,
  },
  explanation: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  resultButton: {
    backgroundColor: '#fbbf24',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
});