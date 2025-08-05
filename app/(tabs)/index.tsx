import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Play, Star, Crown, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de pulso para o botão principal
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animação de brilho
    const sparkleAnimation = Animated.loop(
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Animação de flutuação
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    sparkleAnimation.start();
    floatAnimation.start();

    return () => {
      pulseAnimation.stop();
      sparkleAnimation.stop();
      floatAnimation.stop();
    };
  }, []);

  const startQuiz = () => {
    router.push('/(tabs)/quiz');
  };

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <LinearGradient 
      colors={['#1e40af', '#3b82f6', '#60a5fa']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Elementos decorativos de fundo */}
      <View style={styles.backgroundElements}>
        <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity }]}>
          <Sparkles size={20} color="#fbbf24" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity }]}>
          <Star size={16} color="#fbbf24" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity }]}>
          <Crown size={18} color="#fbbf24" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle4, { opacity: sparkleOpacity }]}>
          <Sparkles size={14} color="#fbbf24" />
        </Animated.View>
      </View>

      <View style={styles.content}>
        {/* Header com logo e título */}
        <Animated.View style={[styles.header, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b', '#d97706']}
              style={styles.logoCircle}
            >
              <Crown size={50} color="#1e40af" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Show do Cristão</Text>
          <Text style={styles.subtitle}>O quiz bíblico mais divertido!</Text>
        </Animated.View>

        {/* Estatísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Star size={24} color="#fbbf24" />
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Perguntas</Text>
          </View>
          <View style={styles.statCard}>
            <Crown size={24} color="#fbbf24" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Ajudas</Text>
          </View>
          <View style={styles.statCard}>
            <Sparkles size={24} color="#fbbf24" />
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Diversão</Text>
          </View>
        </View>

        {/* Botão principal de jogar */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.playButton} onPress={startQuiz}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b', '#d97706']}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Play size={32} color="#1e40af" />
              <Text style={styles.playButtonText}>JOGAR AGORA!</Text>
              <View style={styles.playButtonShine} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Versículo inspiracional */}
        <View style={styles.verseContainer}>
          <Text style={styles.verseText}>
            "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."
          </Text>
          <Text style={styles.verseReference}>Salmos 119:105</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  sparkle2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  sparkle3: {
    top: height * 0.7,
    left: width * 0.2,
  },
  sparkle4: {
    top: height * 0.8,
    right: width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0f2fe',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#e0f2fe',
    marginTop: 4,
    fontWeight: '600',
  },
  playButton: {
    width: width * 0.8,
    marginBottom: 40,
    borderRadius: 30,
    elevation: 15,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e40af',
    marginLeft: 12,
    letterSpacing: 1,
  },
  playButtonShine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  verseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  verseText: {
    fontSize: 16,
    color: '#e0f2fe',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
});