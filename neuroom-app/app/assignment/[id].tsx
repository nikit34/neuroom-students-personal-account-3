import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PhotoUploader } from '../../components/PhotoUploader';
import { Colors } from '../../constants/colors';
import { subjectNames, statusLabels, statusColors } from '../../constants/mockData';
import { formatDate, formatDateTime, generateParentLink, getDaysLeft } from '../../utils/helpers';

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const router = useRouter();

  const assignment = state.assignments.find((a) => a.id === id);
  const [photoUri, setPhotoUri] = useState<string | null>(
    assignment?.versions[assignment.versions.length - 1]?.photoUri || null,
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [sending, setSending] = useState(false);

  if (!assignment) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Задание не найдено</Text>
      </View>
    );
  }

  const daysLeft = getDaysLeft(assignment.deadline);
  const statusColor = statusColors[assignment.status];
  const lastVersion = assignment.versions[assignment.versions.length - 1];

  const handlePhotoSelected = (uri: string) => {
    setPhotoUri(uri);
    const updatedAssignment = {
      ...assignment,
      hasPhoto: true,
      status: assignment.status === 'new' ? ('in_progress' as const) : assignment.status,
      versions: [
        ...assignment.versions,
        {
          id: `v${assignment.versions.length + 1}`,
          photoUri: uri,
          uploadedAt: new Date().toISOString(),
          parentApproved: false,
        },
      ],
    };
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
  };

  const handlePhotoRemoved = () => {
    setPhotoUri(null);
  };

  const handleSendToParent = async () => {
    const link = generateParentLink();
    const updatedAssignment = {
      ...assignment,
      status: 'parent_review' as const,
      parentLink: link,
    };
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
  };

  const handleCopyLink = async () => {
    if (assignment.parentLink) {
      await Clipboard.setStringAsync(assignment.parentLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleSendToTeacher = () => {
    setSending(true);
    setTimeout(() => {
      const updatedAssignment = {
        ...assignment,
        status: 'teacher_review' as const,
      };
      dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
      setSending(false);
      Alert.alert('Отправлено!', 'Задание отправлено учителю на проверку', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header info */}
      <Card>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.subjectDot,
              { backgroundColor: assignment.subject === 'math' ? Colors.primary : Colors.secondary },
            ]}
          />
          <Text style={styles.subject}>{subjectNames[assignment.subject]}</Text>
          <Badge label={statusLabels[assignment.status]} color={statusColor} />
        </View>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.description}>{assignment.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textTertiary} />
            <Text style={styles.metaText}>Выдано: {formatDate(assignment.createdAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={daysLeft < 0 ? Colors.error : Colors.textTertiary}
            />
            <Text style={[styles.metaText, daysLeft < 0 && { color: Colors.error }]}>
              {daysLeft < 0
                ? 'Просрочено'
                : daysLeft === 0
                  ? 'Дедлайн сегодня!'
                  : `Осталось ${daysLeft} дн.`}
            </Text>
          </View>
        </View>
      </Card>

      {/* Photo Upload */}
      {(assignment.status === 'new' ||
        assignment.status === 'in_progress' ||
        assignment.status === 'resubmit') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Твоё решение</Text>
          <PhotoUploader
            photoUri={photoUri}
            onPhotoSelected={handlePhotoSelected}
            onPhotoRemoved={handlePhotoRemoved}
          />
        </View>
      )}

      {/* Version history */}
      {assignment.versions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>История версий</Text>
          {assignment.versions.map((v, i) => (
            <Card key={v.id} padding={12}>
              <View style={styles.versionRow}>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionNumber}>v{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.versionDate}>{formatDateTime(v.uploadedAt)}</Text>
                  {v.parentApproved && (
                    <View style={styles.approvedRow}>
                      <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                      <Text style={styles.approvedText}>
                        Одобрено родителем {v.parentApprovedAt ? formatDateTime(v.parentApprovedAt) : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Send to parent */}
      {photoUri &&
        (assignment.status === 'in_progress' || assignment.status === 'resubmit') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Отправить на проверку</Text>
            <Card>
              <Text style={styles.parentHint}>
                Отправь задание родителю на проверку перед отправкой учителю
              </Text>
              <Button
                title="Отправить родителю"
                onPress={handleSendToParent}
                variant="secondary"
                icon={<Ionicons name="people-outline" size={20} color={Colors.primary} />}
                style={{ marginBottom: 8 }}
              />
            </Card>
          </View>
        )}

      {/* Parent link */}
      {assignment.parentLink && assignment.status === 'parent_review' && (
        <View style={styles.section}>
          <Card>
            <View style={styles.linkHeader}>
              <Ionicons name="link-outline" size={20} color={Colors.primary} />
              <Text style={styles.linkTitle}>Ссылка для родителя</Text>
            </View>
            <Text style={styles.linkUrl} numberOfLines={1}>
              {assignment.parentLink}
            </Text>
            <Button
              title={linkCopied ? 'Скопировано!' : 'Копировать ссылку'}
              onPress={handleCopyLink}
              variant={linkCopied ? 'primary' : 'outline'}
              icon={
                <Ionicons
                  name={linkCopied ? 'checkmark' : 'copy-outline'}
                  size={18}
                  color={linkCopied ? '#FFF' : Colors.primary}
                />
              }
              size="small"
            />
            <Text style={styles.linkHint}>Отправь ссылку в Telegram или WhatsApp</Text>
          </Card>
        </View>
      )}

      {/* Send to teacher */}
      {assignment.status === 'parent_approved' && (
        <View style={styles.section}>
          <Button
            title="Отправить учителю"
            onPress={handleSendToTeacher}
            variant="gradient"
            size="large"
            loading={sending}
            icon={<Ionicons name="send" size={20} color="#FFF" />}
          />
        </View>
      )}

      {/* Status info for teacher_review */}
      {assignment.status === 'teacher_review' && (
        <Card>
          <View style={styles.statusInfo}>
            <Ionicons name="hourglass-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.statusInfoText}>Задание на проверке у учителя. Ожидай результат!</Text>
          </View>
        </Card>
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
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subject: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  versionDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  approvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  approvedText: {
    fontSize: 12,
    color: Colors.success,
  },
  parentHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  linkUrl: {
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 12,
    backgroundColor: Colors.surfaceSecondary,
    padding: 8,
    borderRadius: 8,
  },
  linkHint: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusInfoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
});
