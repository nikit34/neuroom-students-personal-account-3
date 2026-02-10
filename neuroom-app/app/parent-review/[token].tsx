import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { formatDateTime } from '../../utils/helpers';

type ReviewState = 'pending' | 'approved' | 'returned';

export default function ParentReviewScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [reviewState, setReviewState] = useState<ReviewState>('pending');
  const [approvedAt, setApprovedAt] = useState('');

  const handleApprove = () => {
    const now = new Date().toISOString();
    setApprovedAt(now);
    setReviewState('approved');
  };

  const handleReturn = () => {
    setReviewState('returned');
  };

  if (reviewState === 'approved') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.statusIcon}
          >
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </LinearGradient>
          <Text style={styles.statusTitle}>Задание одобрено!</Text>
          <Text style={styles.statusDate}>{formatDateTime(approvedAt)}</Text>
          <Text style={styles.statusHint}>
            Ученик получит уведомление и сможет отправить задание учителю
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (reviewState === 'returned') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={[styles.statusIcon, { backgroundColor: Colors.warningLight }]}>
            <Ionicons name="arrow-back" size={48} color={Colors.warning} />
          </View>
          <Text style={styles.statusTitle}>Возвращено на доработку</Text>
          <Text style={styles.statusHint}>
            Ученик получит уведомление и сможет внести исправления
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoBar}
          >
            <Text style={styles.logoText}>Нейрум</Text>
          </LinearGradient>
          <Text style={styles.pageTitle}>Проверка домашнего задания</Text>
          <Text style={styles.pageSubtitle}>
            Ваш ребёнок отправил задание на проверку
          </Text>
        </View>

        {/* Assignment info */}
        <Card>
          <Text style={styles.assignmentTitle}>Решение уравнений с одной переменной</Text>
          <Text style={styles.assignmentSubject}>Математика</Text>
        </Card>

        {/* Photo */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Image
            source={{ uri: 'https://picsum.photos/400/600?random=10' }}
            style={styles.photo}
            resizeMode="cover"
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Одобрить"
            onPress={handleApprove}
            variant="gradient"
            size="large"
            icon={<Ionicons name="checkmark-circle" size={22} color="#FFF" />}
          />
          <Button
            title="Вернуть на доработку"
            onPress={handleReturn}
            variant="outline"
            size="large"
            icon={<Ionicons name="arrow-back-circle-outline" size={22} color={Colors.primary} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  logoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  photo: {
    width: '100%',
    height: 300,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  // Status screens
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  statusIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  statusDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusHint: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
