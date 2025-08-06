import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Home, ArrowRight, BookOpen } from 'lucide-react-native';


export default function QuizSuccessScreen() {
  const params = useLocalSearchParams();
  const nextIndex = params && params.questionIndex ? parseInt(params.questionIndex as string, 10) : 0;

  return (
    <LinearGradient colors={['#059669', '#10b981', '#34d399']} style={styles.container}>
      <View style={styles.resultContainer}>
        <View style={styles.resultIcon}>
          <CheckCircle size={100} color="#ffffff" />
        </View>
        <Text style={styles.resultTitle}>🎉 PARABÉNS! 🎉</Text>
        <View style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <BookOpen size={28} color="#fbbf24" />
            <Text style={styles.referenceTitle}>Referência Bíblica</Text>
          </View>
          <Text style={styles.reference}>Exemplo: João 3:16</Text>
          <Text style={styles.explanation}>"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito..."</Text>
        </View>
        <View style={styles.resultButtons}>
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <LinearGradient colors={['#ffffff', '#f1f5f9']} style={styles.resultButtonGradient}>
              <Home size={24} color="#1e40af" />
              <Text style={styles.resultButtonText}>Início</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => router.replace(`/quiz?questionIndex=${nextIndex}`)}
          >
            <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.resultButtonGradient}>
              <ArrowRight size={24} color="#1e40af" />
              <Text style={[styles.resultButtonText, { color: '#1e40af' }]}>Continuar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  resultIcon: { marginBottom: 20 },
  resultTitle: { fontSize: 32, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 40 },
  referenceCard: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 40 },
  referenceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  referenceTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e40af', marginLeft: 12 },
  reference: { fontSize: 22, fontWeight: 'bold', color: '#fbbf24', marginBottom: 16, textAlign: 'center' },
  explanation: { fontSize: 16, color: '#374151', textAlign: 'center', lineHeight: 24 },
  resultButtons: { flexDirection: 'row', gap: 16 },
  resultButton: { borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  resultButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  resultButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1e40af', marginLeft: 8 },
});
