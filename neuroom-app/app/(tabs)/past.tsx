import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { AssignmentCard } from '../../components/AssignmentCard';
import { Colors } from '../../constants/colors';
import { isPastAssignment } from '../../utils/helpers';
import { subjectNames } from '../../constants/mockData';
import { Subject } from '../../types';

export default function PastHomeworkScreen() {
  const { state } = useApp();
  const [filter, setFilter] = useState<Subject | 'all'>('all');

  const pastAssignments = state.assignments.filter((a) => isPastAssignment(a.status));

  const filtered =
    filter === 'all' ? pastAssignments : pastAssignments.filter((a) => a.subject === filter);

  const subjects = [...new Set(pastAssignments.map((a) => a.subject))];

  // Group by subject
  const grouped = filtered.reduce(
    (acc, a) => {
      if (!acc[a.subject]) acc[a.subject] = [];
      acc[a.subject].push(a);
      return acc;
    },
    {} as Record<string, typeof filtered>,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Все</Text>
        </TouchableOpacity>
        {subjects.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterButton, filter === s && styles.filterActive]}
            onPress={() => setFilter(s)}
          >
            <Text style={[styles.filterText, filter === s && styles.filterTextActive]}>
              {subjectNames[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {Object.entries(grouped).map(([subject, assignments]) => (
        <View key={subject} style={styles.group}>
          <View style={styles.groupHeader}>
            <View
              style={[
                styles.groupDot,
                { backgroundColor: subject === 'math' ? Colors.primary : Colors.secondary },
              ]}
            />
            <Text style={styles.groupTitle}>{subjectNames[subject]}</Text>
            <Text style={styles.groupCount}>{assignments.length}</Text>
          </View>
          {assignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </View>
      ))}

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Пока нет проверенных заданий</Text>
          <Text style={styles.emptySubtext}>Сдай задание и получи обратную связь</Text>
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  groupCount: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
