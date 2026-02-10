export const Colors = {
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  secondary: '#EC4899',
  secondaryLight: '#F472B6',

  background: '#FAF5FF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F3FF',

  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  shadow: 'rgba(0, 0, 0, 0.08)',

  gradientStart: '#8B5CF6',
  gradientEnd: '#EC4899',

  // Grade colors
  gradeExcellent: '#10B981',
  gradeGood: '#3B82F6',
  gradeSatisfactory: '#F59E0B',
  gradeUnsatisfactory: '#EF4444',

  // Difficulty
  difficultyEasy: '#10B981',
  difficultyMedium: '#F59E0B',
  difficultyHard: '#EF4444',
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
