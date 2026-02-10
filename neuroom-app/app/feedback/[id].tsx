import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { mockFeedback, subjectNames } from '../../constants/mockData';
import { getGradeLabel } from '../../utils/helpers';
import { trackEvent, trackScreen } from '../../utils/analytics';

export default function FeedbackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const router = useRouter();

  const assignment = state.assignments.find((a) => a.id === id);
  const feedback = mockFeedback[id!];

  React.useEffect(() => {
    trackScreen('feedback');
    trackEvent('feedback_viewed', { assignmentId: id!, grade: feedback?.grade ?? 0 });
  }, []);

  if (!assignment || !feedback) {
    return (
      <View style={styles.notFound}>
        <Text>Обратная связь не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Assignment info */}
      <View style={styles.assignmentInfo}>
        <Text style={styles.subject}>{subjectNames[assignment.subject]}</Text>
        <Text style={styles.title}>{assignment.title}</Text>
      </View>

      {/* Main feedback header */}
      <Text style={styles.feedbackHeader}>Что получилось и что улучшить</Text>

      {/* Teacher summary */}
      <Card>
        <View style={styles.summaryHeader}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
          <Text style={styles.summaryTitle}>Резюме от учителя</Text>
        </View>
        <Text style={styles.summaryText}>{feedback.teacherSummary}</Text>
      </Card>

      {/* Errors */}
      {feedback.errors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Разбор ошибок</Text>
          {feedback.errors.map((error, index) => (
            <Card key={index}>
              <Text style={styles.errorLocation}>{error.location}</Text>

              {/* Comparison */}
              <View style={styles.comparisonRow}>
                <View style={[styles.comparisonBlock, { backgroundColor: Colors.errorLight }]}>
                  <Text style={styles.comparisonLabel}>Как было у тебя</Text>
                  <Text style={styles.comparisonText}>{error.studentAnswer}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
                </View>
                <View style={[styles.comparisonBlock, { backgroundColor: Colors.successLight }]}>
                  <Text style={styles.comparisonLabel}>Как должно быть</Text>
                  <Text style={styles.comparisonText}>{error.correctAnswer}</Text>
                </View>
              </View>

              {/* Explanation */}
              <View style={styles.explanation}>
                <Text style={styles.explanationTitle}>Почему так</Text>
                <Text style={styles.explanationText}>{error.explanation}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {feedback.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Рекомендации</Text>
          <Card>
            {feedback.recommendations.map((rec, index) => (
              <View key={index} style={styles.recItem}>
                <View style={styles.recNumber}>
                  <Text style={styles.recNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      {/* AI Tutor CTA */}
      <View style={styles.section}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaBlock}
        >
          <Ionicons name="sparkles" size={32} color="#FFF" />
          <Text style={styles.ctaTitle}>Хочешь разобраться лучше?</Text>
          <Text style={styles.ctaDescription}>
            AI-репетитор поможет тебе понять ошибки и даст дополнительные задания для тренировки
          </Text>
          <Button
            title="Перейти к AI-репетитору"
            onPress={() => { trackEvent('ai_tutor_opened', { assignmentId: id!, source: 'feedback_cta' }); router.push(`/tutor/${id}`); }}
            variant="secondary"
            size="large"
            icon={<Ionicons name="sparkles-outline" size={20} color={Colors.primary} />}
            style={{ backgroundColor: '#FFF' }}
          />
        </LinearGradient>
      </View>

      {/* Grade in footer */}
      {feedback.grade && (
        <View style={styles.gradeFooter}>
          <Text style={styles.gradeLabel}>Оценка</Text>
          <View style={styles.gradeRow}>
            <Text style={styles.gradeValue}>{feedback.grade}</Text>
            <Text style={styles.gradeText}>{getGradeLabel(feedback.grade)}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignmentInfo: {
    marginBottom: 16,
  },
  subject: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  feedbackHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  errorLocation: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  comparisonRow: {
    gap: 8,
    marginBottom: 12,
  },
  comparisonBlock: {
    padding: 12,
    borderRadius: 10,
  },
  comparisonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  comparisonText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  explanation: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: 10,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  recText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    flex: 1,
  },
  ctaBlock: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  gradeFooter: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  gradeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  gradeText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
