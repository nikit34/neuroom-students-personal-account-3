import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Colors } from '../../constants/colors';
import { subjectNames } from '../../constants/mockData';
import { formatDate } from '../../utils/helpers';

export default function AchievementsScreen() {
  const { state } = useApp();

  const earned = state.achievements.filter((a) => a.earnedAt);
  const inProgress = state.achievements.filter((a) => !a.earnedAt);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <Ionicons name="trophy" size={32} color="#FFF" />
        <View style={styles.statsText}>
          <Text style={styles.statsNumber}>{earned.length}</Text>
          <Text style={styles.statsLabel}>
            {earned.length === 1 ? 'достижение' : 'достижений'} получено
          </Text>
        </View>
      </LinearGradient>

      {/* Earned */}
      {earned.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Полученные</Text>
          {earned.map((a) => (
            <Card key={a.id}>
              <View style={styles.achievementRow}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTopic}>{a.topic}</Text>
                  <View style={styles.achievementMeta}>
                    <Text style={styles.achievementSubject}>{subjectNames[a.subject]}</Text>
                    <Text style={styles.achievementDot}> · </Text>
                    <Text style={styles.achievementDate}>{formatDate(a.earnedAt!)}</Text>
                  </View>
                  <Text style={styles.achievementScore}>
                    {a.correctAnswers}/{a.totalQuestions} правильных ответов
                  </Text>
                </View>
                <Ionicons name="star" size={24} color={Colors.warning} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>В процессе</Text>
          {inProgress.map((a) => (
            <Card key={a.id}>
              <View style={styles.achievementRow}>
                <View style={[styles.achievementIcon, { opacity: 0.4 }]}>
                  <Ionicons name="ellipse-outline" size={28} color={Colors.textTertiary} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTopic, { color: Colors.textSecondary }]}>
                    {a.topic}
                  </Text>
                  <Text style={styles.achievementSubject}>{subjectNames[a.subject]}</Text>
                  <View style={{ marginTop: 8 }}>
                    <ProgressBar
                      progress={a.correctAnswers / a.totalQuestions}
                      color={Colors.primaryLight}
                      height={6}
                    />
                  </View>
                </View>
              </View>
            </Card>
          ))}
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
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },
  statsText: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  statsLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementSubject: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  achievementDot: {
    color: Colors.textTertiary,
  },
  achievementDate: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  achievementScore: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 4,
    fontWeight: '500',
  },
});
