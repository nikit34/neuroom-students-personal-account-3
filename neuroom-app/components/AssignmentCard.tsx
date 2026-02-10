import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Colors } from '../constants/colors';
import { Assignment } from '../types';
import { subjectNames, statusLabels, statusColors } from '../constants/mockData';
import { formatDate, getDaysLeft } from '../utils/helpers';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();
  const daysLeft = getDaysLeft(assignment.deadline);
  const statusColor = statusColors[assignment.status];

  const handlePress = () => {
    if (assignment.status === 'reviewed') {
      router.push(`/feedback/${assignment.id}`);
    } else {
      router.push(`/assignment/${assignment.id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <View style={styles.subjectRow}>
            <View
              style={[
                styles.subjectDot,
                { backgroundColor: assignment.subject === 'math' ? Colors.primary : Colors.secondary },
              ]}
            />
            <Text style={styles.subject}>{subjectNames[assignment.subject]}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {assignment.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {assignment.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Badge label={statusLabels[assignment.status]} color={statusColor} />
            {assignment.hasPhoto && (
              <Ionicons
                name="attach"
                size={16}
                color={Colors.textTertiary}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
          <View style={styles.footerRight}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textTertiary} />
            <Text style={[styles.dateText, daysLeft < 0 && { color: Colors.error }]}>
              {daysLeft < 0 ? 'Просрочено' : daysLeft === 0 ? 'Сегодня' : `${daysLeft} дн.`}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subject: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
