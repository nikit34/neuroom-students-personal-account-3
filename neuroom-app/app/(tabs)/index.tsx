import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { AssignmentCard } from '../../components/AssignmentCard';
import { Colors } from '../../constants/colors';
import { isNeedsAttention, isCurrentAssignment } from '../../utils/helpers';
import { trackScreen } from '../../utils/analytics';

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => { trackScreen('home'); }, []);

  // If parent mode, switch back to student
  React.useEffect(() => {
    if (state.mode === 'parent') {
      dispatch({ type: 'TOGGLE_MODE' });
    }
  }, []);

  const attentionAssignments = state.assignments.filter((a) => isNeedsAttention(a.status));
  const currentAssignments = state.assignments.filter((a) => isCurrentAssignment(a.status));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <Text style={styles.greeting}>Привет! 👋</Text>
      <Text style={styles.subtitle}>Вот твои задания на сегодня</Text>

      {attentionAssignments.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
            </View>
            <Text style={styles.sectionTitle}>Требуют внимания</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{attentionAssignments.length}</Text>
            </View>
          </View>
          {attentionAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
          </View>
          <Text style={styles.sectionTitle}>Текущие задания</Text>
          <View style={[styles.countBadge, { backgroundColor: Colors.surfaceSecondary }]}>
            <Text style={[styles.countText, { color: Colors.primary }]}>{currentAssignments.length}</Text>
          </View>
        </View>
        {currentAssignments.length > 0 ? (
          currentAssignments.map((a) => <AssignmentCard key={a.id} assignment={a} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={Colors.success} />
            <Text style={styles.emptyText}>Все задания выполнены!</Text>
            <Text style={styles.emptySubtext}>Отдохни или попрактикуйся с AI-репетитором</Text>
          </View>
        )}
      </View>

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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: Colors.errorLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
