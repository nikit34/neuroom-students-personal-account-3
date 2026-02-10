import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { subjectNames } from '../../constants/mockData';
import { formatDate, getGradeLabel, getGradeCategory } from '../../utils/helpers';
import { Grade, Subject } from '../../types';
import Svg, { Path, Circle as SvgCircle, Line } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

function MiniChart({ grades }: { grades: Grade[] }) {
  const sorted = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const w = screenWidth - 80;
  const h = 80;
  const padding = 16;

  if (sorted.length < 2) return null;

  const xStep = (w - padding * 2) / (sorted.length - 1);
  const yMin = 1;
  const yMax = 5;
  const yScale = (v: number) => h - padding - ((v - yMin) / (yMax - yMin)) * (h - padding * 2);

  const points = sorted.map((g, i) => ({
    x: padding + i * xStep,
    y: yScale(g.value),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <Svg width={w} height={h}>
      {/* Grid lines */}
      {[2, 3, 4, 5].map((v) => (
        <Line
          key={v}
          x1={padding}
          x2={w - padding}
          y1={yScale(v)}
          y2={yScale(v)}
          stroke={Colors.borderLight}
          strokeWidth={1}
        />
      ))}
      <Path d={pathD} fill="none" stroke={Colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <SvgCircle key={i} cx={p.x} cy={p.y} r={4} fill={Colors.primary} stroke="#FFF" strokeWidth={2} />
      ))}
    </Svg>
  );
}

export default function GradesScreen() {
  const { state, dispatch } = useApp();

  // Switch to parent mode
  React.useEffect(() => {
    if (state.mode !== 'parent') {
      dispatch({ type: 'TOGGLE_MODE' });
    }
  }, []);

  const grades = state.grades;
  const subjects = [...new Set(grades.map((g) => g.subject))] as Subject[];

  // Overall stats
  const avgGrade = grades.length > 0 ? (grades.reduce((s, g) => s + g.value, 0) / grades.length).toFixed(1) : '0';
  const excellent = grades.filter((g) => g.value === 5).length;
  const good = grades.filter((g) => g.value === 4).length;
  const satisfactory = grades.filter((g) => g.value === 3).length;
  const unsatisfactory = grades.filter((g) => g.value <= 2).length;

  const gradeColors: Record<string, string> = {
    excellent: Colors.gradeExcellent,
    good: Colors.gradeGood,
    satisfactory: Colors.gradeSatisfactory,
    unsatisfactory: Colors.gradeUnsatisfactory,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.modeBar}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modeBadge}
        >
          <Ionicons name="person" size={14} color="#FFF" />
          <Text style={styles.modeText}>Режим родителя</Text>
        </LinearGradient>
        <TouchableOpacity
          onPress={() => dispatch({ type: 'TOGGLE_MODE' })}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>Режим ученика</Text>
        </TouchableOpacity>
      </View>

      {/* Overall Stats */}
      <Card style={{ marginBottom: 20 }}>
        <Text style={styles.cardTitle}>Общая статистика</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgGrade}</Text>
            <Text style={styles.statLabel}>Средний балл</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{grades.length}</Text>
            <Text style={styles.statLabel}>Оценок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{subjects.length}</Text>
            <Text style={styles.statLabel}>Предметов</Text>
          </View>
        </View>

        <View style={styles.breakdownRow}>
          {[
            { label: 'Отлично', count: excellent, color: gradeColors.excellent },
            { label: 'Хорошо', count: good, color: gradeColors.good },
            { label: 'Удовл.', count: satisfactory, color: gradeColors.satisfactory },
            { label: 'Неуд.', count: unsatisfactory, color: gradeColors.unsatisfactory },
          ].map((item) => (
            <View key={item.label} style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
              <Text style={styles.breakdownCount}>{item.count}</Text>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Per subject */}
      {subjects.map((subject) => {
        const subjectGrades = grades.filter((g) => g.subject === subject);
        const avg = (subjectGrades.reduce((s, g) => s + g.value, 0) / subjectGrades.length).toFixed(1);
        const sorted = [...subjectGrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const trend = sorted.length >= 2 ? sorted[0].value - sorted[1].value : 0;

        return (
          <Card key={subject} style={{ marginBottom: 16 }}>
            <View style={styles.subjectHeader}>
              <View style={styles.subjectInfo}>
                <View
                  style={[
                    styles.subjectDot,
                    { backgroundColor: subject === 'math' ? Colors.primary : Colors.secondary },
                  ]}
                />
                <Text style={styles.subjectName}>{subjectNames[subject]}</Text>
              </View>
              <View style={styles.subjectStats}>
                <Text style={styles.subjectAvg}>{avg}</Text>
                {trend !== 0 && (
                  <Ionicons
                    name={trend > 0 ? 'trending-up' : 'trending-down'}
                    size={18}
                    color={trend > 0 ? Colors.success : Colors.error}
                  />
                )}
              </View>
            </View>

            <MiniChart grades={subjectGrades} />

            <View style={styles.gradeList}>
              {sorted.map((g) => {
                const cat = getGradeCategory(g.value);
                return (
                  <View key={g.id} style={styles.gradeItem}>
                    <View style={[styles.gradeValue, { backgroundColor: gradeColors[cat] + '20' }]}>
                      <Text style={[styles.gradeValueText, { color: gradeColors[cat] }]}>{g.value}</Text>
                    </View>
                    <View style={styles.gradeInfo}>
                      <Text style={styles.gradeTitle} numberOfLines={1}>{g.assignmentTitle}</Text>
                      <Text style={styles.gradeDate}>{formatDate(g.date)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        );
      })}

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
  modeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  breakdownCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  breakdownLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectAvg: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  gradeList: {
    marginTop: 12,
    gap: 8,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradeValue: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeValueText: {
    fontSize: 16,
    fontWeight: '700',
  },
  gradeInfo: {
    flex: 1,
  },
  gradeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  gradeDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
