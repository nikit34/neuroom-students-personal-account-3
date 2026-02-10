import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

function FadeInView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

function BounceInView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>;
}
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Colors } from '../../constants/colors';
import { mockQuizzes } from '../../constants/mockData';
import { useApp } from '../../contexts/AppContext';
import { trackEvent, trackScreen } from '../../utils/analytics';

type QuizState = 'question' | 'explanation' | 'results';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useApp();

  const quiz = mockQuizzes[id!];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    trackScreen('quiz');
    trackEvent('quiz_started', { topic: quiz?.topic ?? '', assignmentId: id! });
  }, []);

  if (!quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text>Квиз не найден</Text>
          <Button title="Назад" onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const question = quiz.questions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;
  const progress = (currentIndex + 1) / quiz.questions.length;

  const difficultyColors: Record<string, string> = {
    easy: Colors.difficultyEasy,
    medium: Colors.difficultyMedium,
    hard: Colors.difficultyHard,
  };
  const difficultyLabels: Record<string, string> = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const correct = index === question.correctIndex;
    trackEvent('quiz_answer', { correct, difficulty: question.difficulty, questionIndex: currentIndex });
    if (correct) setCorrectCount((c) => c + 1);
    setAnswers([...answers, correct]);

    setTimeout(() => {
      setQuizState('explanation');
    }, 600);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setQuizState('question');
    } else {
      setQuizState('results');
      trackEvent('quiz_completed', { topic: quiz.topic, correctCount, total: quiz.questions.length });

      // Earn achievement if 60%+ correct
      const achievement = state.achievements.find(
        (a) => a.topic === quiz.topic && !a.earnedAt,
      );
      if (achievement && correctCount / quiz.questions.length >= 0.6) {
        trackEvent('achievement_earned', { topic: quiz.topic });
        dispatch({
          type: 'UPDATE_ACHIEVEMENT',
          payload: {
            ...achievement,
            earnedAt: new Date().toISOString(),
            correctAnswers: correctCount,
          },
        });
      }
    }
  };

  // Results screen
  if (quizState === 'results') {
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <BounceInView delay={200}>
            {passed ? (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.resultIcon}
              >
                <Ionicons name="trophy" size={48} color="#FFF" />
              </LinearGradient>
            ) : (
              <View style={[styles.resultIcon, { backgroundColor: Colors.warningLight }]}>
                <Ionicons name="refresh" size={48} color={Colors.warning} />
              </View>
            )}
          </BounceInView>

          <FadeInView delay={400}>
            <Text style={styles.resultTitle}>
              {passed ? `${quiz.topic} done!` : 'Попробуй ещё раз!'}
            </Text>
          </FadeInView>

          <FadeInView delay={500}>
            <Text style={styles.resultStats}>
              {correctCount} из {quiz.questions.length} правильных ответов ({percentage}%)
            </Text>
          </FadeInView>

          <FadeInView delay={600} style={styles.answersGrid}>
            {answers.map((correct, i) => (
              <View
                key={i}
                style={[
                  styles.answerDot,
                  { backgroundColor: correct ? Colors.success : Colors.error },
                ]}
              >
                <Ionicons
                  name={correct ? 'checkmark' : 'close'}
                  size={12}
                  color="#FFF"
                />
              </View>
            ))}
          </FadeInView>

          <FadeInView delay={700} style={{ width: '100%', gap: 12 }}>
            {passed && (
              <Card>
                <View style={styles.achievementEarned}>
                  <Ionicons name="star" size={24} color={Colors.warning} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.achievementTitle}>Достижение получено!</Text>
                    <Text style={styles.achievementTopic}>{quiz.topic}</Text>
                  </View>
                </View>
              </Card>
            )}
            <Button
              title="Вернуться"
              onPress={() => router.back()}
              variant="primary"
              size="large"
            />
          </FadeInView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{quiz.topic}</Text>
          <Text style={styles.headerProgress}>
            Вопрос {currentIndex + 1} из {quiz.questions.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={6} />
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <FadeInView key={currentIndex}>
          <Badge
            label={difficultyLabels[question.difficulty]}
            color={difficultyColors[question.difficulty]}
          />

          <Text style={styles.questionText}>{question.text}</Text>

          {/* Options */}
          <View style={styles.options}>
            {question.options.map((option, index) => {
              const isCorrectOption = selectedOption !== null && index === question.correctIndex;
              const isWrongOption = selectedOption !== null && index === selectedOption && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    isCorrectOption && styles.optionCorrect,
                    isWrongOption && styles.optionWrong,
                  ]}
                  onPress={() => handleAnswer(index)}
                  activeOpacity={0.7}
                  disabled={selectedOption !== null}
                >
                  <View style={styles.optionLetter}>
                    <Text style={styles.optionLetterText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    { flex: 1 },
                    isCorrectOption && { color: Colors.success },
                    isWrongOption && { color: Colors.error },
                  ]}>{option}</Text>
                  {selectedOption !== null && index === question.correctIndex && (
                    <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
                  )}
                  {selectedOption !== null &&
                    index === selectedOption &&
                    index !== question.correctIndex && (
                      <Ionicons name="close-circle" size={22} color={Colors.error} />
                    )}
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeInView>

        {/* Explanation */}
        {quizState === 'explanation' && (
          <FadeInView style={styles.explanationBlock}>
            <Card style={{ backgroundColor: isCorrect ? Colors.successLight : Colors.warningLight }}>
              <View style={styles.explanationHeader}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                  size={20}
                  color={isCorrect ? Colors.success : Colors.warning}
                />
                <Text
                  style={[
                    styles.explanationTitle,
                    { color: isCorrect ? Colors.success : Colors.warning },
                  ]}
                >
                  {isCorrect ? 'Правильно!' : 'Не совсем...'}
                </Text>
              </View>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </Card>
            <Button
              title={currentIndex < quiz.questions.length - 1 ? 'Следующий вопрос' : 'Результаты'}
              onPress={handleNext}
              variant="primary"
              size="large"
            />
          </FadeInView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  headerProgress: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 24,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 21,
  },
  explanationBlock: {
    marginTop: 20,
    gap: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  // Results
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  resultIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  resultStats: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  answersGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  answerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  achievementTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
