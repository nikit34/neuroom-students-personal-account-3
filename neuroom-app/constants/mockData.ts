import { Assignment, Feedback, Quiz, Achievement, Grade, ChatMessage } from '../types';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Решение уравнений с одной переменной',
    description: 'Решить уравнения №245-250 из учебника. Показать все шаги решения.',
    subject: 'math',
    status: 'resubmit',
    createdAt: '2026-02-08',
    deadline: '2026-02-12',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=1',
        uploadedAt: '2026-02-09T14:30:00',
        parentApproved: true,
        parentApprovedAt: '2026-02-09T15:00:00',
      },
    ],
    currentVersion: 0,
    hasPhoto: true,
  },
  {
    id: '2',
    title: 'Приставки "при-" и "пре-"',
    description: 'Упражнение 134. Вставить пропущенные буквы, объяснить выбор приставки.',
    subject: 'russian',
    status: 'new',
    createdAt: '2026-02-09',
    deadline: '2026-02-13',
    versions: [],
    hasPhoto: false,
  },
  {
    id: '3',
    title: 'Площади треугольников',
    description: 'Задачи на вычисление площади треугольника разными способами. №301-305.',
    subject: 'math',
    status: 'in_progress',
    createdAt: '2026-02-07',
    deadline: '2026-02-11',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=2',
        uploadedAt: '2026-02-10T10:00:00',
        parentApproved: false,
      },
    ],
    currentVersion: 0,
    hasPhoto: true,
  },
  {
    id: '4',
    title: 'Сложноподчинённые предложения',
    description: 'Найти главное и придаточное предложения, определить вид связи.',
    subject: 'russian',
    status: 'parent_review',
    createdAt: '2026-02-06',
    deadline: '2026-02-10',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=3',
        uploadedAt: '2026-02-08T16:00:00',
        parentApproved: false,
      },
    ],
    currentVersion: 0,
    parentLink: 'https://neuroom.app/parent/abc123',
    hasPhoto: true,
  },
  {
    id: '5',
    title: 'Дроби и проценты',
    description: 'Задачи на проценты из повседневной жизни. №178-183.',
    subject: 'math',
    status: 'teacher_review',
    createdAt: '2026-02-05',
    deadline: '2026-02-09',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=4',
        uploadedAt: '2026-02-07T11:00:00',
        parentApproved: true,
        parentApprovedAt: '2026-02-07T12:30:00',
      },
    ],
    currentVersion: 0,
    hasPhoto: true,
  },
  {
    id: '6',
    title: 'Причастный оборот',
    description: 'Упражнение 89. Расставить знаки препинания в предложениях с причастным оборотом.',
    subject: 'russian',
    status: 'reviewed',
    createdAt: '2026-02-03',
    deadline: '2026-02-07',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=5',
        uploadedAt: '2026-02-05T09:00:00',
        parentApproved: true,
        parentApprovedAt: '2026-02-05T10:00:00',
      },
    ],
    currentVersion: 0,
    hasPhoto: true,
  },
  {
    id: '7',
    title: 'Системы линейных уравнений',
    description: 'Решить системы уравнений методом подстановки. №267-272.',
    subject: 'math',
    status: 'reviewed',
    createdAt: '2026-02-01',
    deadline: '2026-02-05',
    versions: [
      {
        id: 'v1',
        photoUri: 'https://picsum.photos/400/600?random=6',
        uploadedAt: '2026-02-03T14:00:00',
        parentApproved: true,
        parentApprovedAt: '2026-02-03T15:00:00',
      },
    ],
    currentVersion: 0,
    hasPhoto: true,
  },
];

export const mockFeedback: Record<string, Feedback> = {
  '6': {
    assignmentId: '6',
    grade: 4,
    errors: [
      {
        studentAnswer: 'Листья, кружащиеся в воздухе опускались на землю.',
        correctAnswer: 'Листья, кружащиеся в воздухе, опускались на землю.',
        explanation: 'Причастный оборот "кружащиеся в воздухе" стоит после определяемого слова "листья", поэтому выделяется запятыми с обеих сторон.',
        location: 'Предложение 3',
      },
      {
        studentAnswer: 'Написанное учеником, сочинение было интересным.',
        correctAnswer: 'Написанное учеником сочинение было интересным.',
        explanation: 'Причастный оборот "написанное учеником" стоит перед определяемым словом "сочинение", поэтому запятая не нужна.',
        location: 'Предложение 7',
      },
    ],
    recommendations: [
      'Повтори правило: причастный оборот выделяется запятыми, только если стоит ПОСЛЕ определяемого слова.',
      'Потренируйся находить определяемое слово — это ключ к правильной расстановке запятых.',
      'Обрати внимание на случаи, когда причастный оборот стоит перед определяемым словом — запятая не нужна.',
    ],
    teacherSummary: 'Хорошая работа! Ты верно определяешь причастные обороты, но иногда путаешь, когда ставить запятую. Главное правило: запятая нужна, только если оборот стоит ПОСЛЕ определяемого слова. Продолжай практиковаться!',
  },
  '7': {
    assignmentId: '7',
    grade: 5,
    errors: [],
    recommendations: [
      'Отличная работа! Все системы решены верно.',
      'Попробуй также освоить метод сложения — он иногда удобнее подстановки.',
    ],
    teacherSummary: 'Превосходно! Все задания выполнены правильно. Ты отлично владеешь методом подстановки. Рекомендую попробовать решить те же системы методом сложения для расширения кругозора.',
  },
  '1': {
    assignmentId: '1',
    grade: 3,
    errors: [
      {
        studentAnswer: '3x + 5 = 20 → 3x = 25 → x = 8.3',
        correctAnswer: '3x + 5 = 20 → 3x = 15 → x = 5',
        explanation: 'При переносе числа через знак равенства нужно менять знак. 20 - 5 = 15, а не 20 + 5 = 25.',
        location: 'Задача №247',
      },
      {
        studentAnswer: '2(x - 3) = 10 → 2x - 3 = 10',
        correctAnswer: '2(x - 3) = 10 → 2x - 6 = 10',
        explanation: 'При раскрытии скобок нужно умножить КАЖДОЕ слагаемое внутри скобок на множитель: 2 × (-3) = -6, а не просто -3.',
        location: 'Задача №249',
      },
    ],
    recommendations: [
      'Внимательно выполняй перенос слагаемых — при переносе через "=" знак меняется на противоположный.',
      'При раскрытии скобок умножай множитель на КАЖДЫЙ член в скобках.',
      'Делай проверку: подставь найденный x обратно в уравнение.',
    ],
    teacherSummary: 'Есть ошибки в базовых операциях с уравнениями. Нужно повторить правила переноса и раскрытия скобок. Обязательно делай проверку подстановкой!',
  },
};

export const mockQuizzes: Record<string, Quiz> = {
  '6': {
    assignmentId: '6',
    topic: 'Причастный оборот',
    questions: [
      {
        id: 'q1',
        text: 'В каком предложении причастный оборот выделяется запятыми?',
        options: [
          'Написанная учеником работа была отличной.',
          'Работа написанная учеником была отличной.',
          'Написанная работа учеником была отличной.',
          'Учеником написанная работа была отличной.',
        ],
        correctIndex: 1,
        difficulty: 'easy',
        explanation: 'Причастный оборот "написанная учеником" стоит после определяемого слова "работа", поэтому выделяется запятыми: "Работа, написанная учеником, была отличной."',
      },
      {
        id: 'q2',
        text: 'Найди причастный оборот: "Солнце, скрывшееся за тучами, снова выглянуло."',
        options: [
          'Солнце скрывшееся',
          'скрывшееся за тучами',
          'за тучами снова',
          'снова выглянуло',
        ],
        correctIndex: 1,
        difficulty: 'easy',
        explanation: '"Скрывшееся за тучами" — это причастный оборот (причастие + зависимое слово). Определяемое слово — "солнце".',
      },
      {
        id: 'q3',
        text: 'Где нужно поставить запятую? "Дети игравшие во дворе побежали домой."',
        options: [
          'Дети, игравшие во дворе побежали домой.',
          'Дети игравшие во дворе, побежали домой.',
          'Дети, игравшие во дворе, побежали домой.',
          'Запятые не нужны.',
        ],
        correctIndex: 2,
        difficulty: 'medium',
        explanation: 'Причастный оборот "игравшие во дворе" стоит после определяемого слова "дети", поэтому выделяется запятыми с обеих сторон.',
      },
      {
        id: 'q4',
        text: 'В каком случае запятая НЕ нужна?',
        options: [
          'Книга прочитанная мной была интересной.',
          'Прочитанная мной книга была интересной.',
          'Книга была интересной прочитанная мной.',
          'Мной прочитанная книга лежала на столе.',
        ],
        correctIndex: 1,
        difficulty: 'medium',
        explanation: 'Если причастный оборот стоит ПЕРЕД определяемым словом ("прочитанная мной книга"), запятая не нужна.',
      },
      {
        id: 'q5',
        text: 'Расставь знаки препинания: "Ветер дувший с моря принёс прохладу а волны набегавшие на берег оставляли пену."',
        options: [
          'Нужны 2 запятые',
          'Нужны 3 запятые',
          'Нужны 4 запятые',
          'Нужны 5 запятых',
        ],
        correctIndex: 2,
        difficulty: 'hard',
        explanation: '"Ветер, дувший с моря, принёс прохладу, а волны, набегавшие на берег, оставляли пену." — два причастных оборота после определяемых слов (по 2 запятые) + запятая перед "а" = 5. Но ответ 4, т.к. "а" разделяет части сложного предложения.',
      },
    ],
  },
  '1': {
    assignmentId: '1',
    topic: 'Решение уравнений с одной переменной',
    questions: [
      {
        id: 'q1',
        text: 'Реши уравнение: 2x + 4 = 10',
        options: ['x = 3', 'x = 7', 'x = 5', 'x = 2'],
        correctIndex: 0,
        difficulty: 'easy',
        explanation: '2x + 4 = 10 → 2x = 10 - 4 → 2x = 6 → x = 3',
      },
      {
        id: 'q2',
        text: 'Реши уравнение: 5x - 3 = 2x + 9',
        options: ['x = 2', 'x = 4', 'x = 6', 'x = 3'],
        correctIndex: 1,
        difficulty: 'easy',
        explanation: '5x - 3 = 2x + 9 → 5x - 2x = 9 + 3 → 3x = 12 → x = 4',
      },
      {
        id: 'q3',
        text: 'Реши уравнение: 3(x + 2) = 21',
        options: ['x = 5', 'x = 7', 'x = 9', 'x = 3'],
        correctIndex: 0,
        difficulty: 'medium',
        explanation: '3(x + 2) = 21 → 3x + 6 = 21 → 3x = 15 → x = 5',
      },
      {
        id: 'q4',
        text: 'Реши уравнение: 4(2x - 1) - 3(x + 2) = 5',
        options: ['x = 3', 'x = 2', 'x = 15', 'x = 1'],
        correctIndex: 0,
        difficulty: 'hard',
        explanation: '8x - 4 - 3x - 6 = 5 → 5x - 10 = 5 → 5x = 15 → x = 3',
      },
    ],
  },
};

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    topic: 'Причастный оборот',
    subject: 'russian',
    earnedAt: '2026-02-06',
    correctAnswers: 4,
    totalQuestions: 5,
  },
  {
    id: 'a2',
    topic: 'Системы линейных уравнений',
    subject: 'math',
    earnedAt: '2026-02-04',
    correctAnswers: 4,
    totalQuestions: 4,
  },
  {
    id: 'a3',
    topic: 'Решение уравнений',
    subject: 'math',
    earnedAt: undefined,
    correctAnswers: 0,
    totalQuestions: 4,
  },
  {
    id: 'a4',
    topic: 'Приставки "при-" и "пре-"',
    subject: 'russian',
    earnedAt: undefined,
    correctAnswers: 0,
    totalQuestions: 5,
  },
];

export const mockGrades: Grade[] = [
  { id: 'g1', subject: 'math', value: 5, date: '2026-02-04', assignmentTitle: 'Системы линейных уравнений' },
  { id: 'g2', subject: 'russian', value: 4, date: '2026-02-05', assignmentTitle: 'Причастный оборот' },
  { id: 'g3', subject: 'math', value: 3, date: '2026-02-08', assignmentTitle: 'Решение уравнений' },
  { id: 'g4', subject: 'math', value: 4, date: '2026-01-28', assignmentTitle: 'Дроби обыкновенные' },
  { id: 'g5', subject: 'russian', value: 5, date: '2026-01-30', assignmentTitle: 'Деепричастный оборот' },
  { id: 'g6', subject: 'math', value: 5, date: '2026-01-25', assignmentTitle: 'Площади фигур' },
  { id: 'g7', subject: 'russian', value: 3, date: '2026-01-22', assignmentTitle: 'Сложное предложение' },
  { id: 'g8', subject: 'math', value: 4, date: '2026-01-20', assignmentTitle: 'Пропорции' },
  { id: 'g9', subject: 'russian', value: 4, date: '2026-01-18', assignmentTitle: 'Однородные члены' },
  { id: 'g10', subject: 'math', value: 5, date: '2026-01-15', assignmentTitle: 'Степени' },
];

export const mockSuggestedQuestions = [
  'Объясни, как правильно раскрывать скобки в уравнениях?',
  'Почему при переносе через равно знак меняется?',
  'Покажи пример решения уравнения по шагам',
  'Какие типичные ошибки бывают в уравнениях?',
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: 'c1',
    role: 'assistant',
    text: 'Привет! Я твой AI-репетитор. Я посмотрел твою работу и готов помочь разобраться с ошибками. С чего начнём?',
    timestamp: '2026-02-10T10:00:00',
  },
];

export const subjectNames: Record<string, string> = {
  math: 'Математика',
  russian: 'Русский язык',
};

export const statusLabels: Record<string, string> = {
  new: 'Новое',
  in_progress: 'В работе',
  parent_review: 'На проверке у родителя',
  parent_approved: 'Одобрено родителем',
  teacher_review: 'На проверке у учителя',
  reviewed: 'Проверено',
  resubmit: 'Пересдай',
};

export const statusColors: Record<string, string> = {
  new: '#3B82F6',
  in_progress: '#F59E0B',
  parent_review: '#8B5CF6',
  parent_approved: '#10B981',
  teacher_review: '#6B7280',
  reviewed: '#10B981',
  resubmit: '#EF4444',
};
