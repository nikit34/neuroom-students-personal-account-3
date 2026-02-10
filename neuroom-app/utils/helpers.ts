import { AssignmentStatus } from '../types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${day} ${months[date.getMonth()]}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${formatDate(dateStr)}, ${hours}:${minutes}`;
}

export function generateParentLink(): string {
  const token = Math.random().toString(36).substring(2, 10);
  return `https://neuroom.app/parent/${token}`;
}

export function isNeedsAttention(status: AssignmentStatus): boolean {
  return status === 'resubmit';
}

export function isCurrentAssignment(status: AssignmentStatus): boolean {
  return ['new', 'in_progress', 'parent_review', 'parent_approved', 'teacher_review'].includes(status);
}

export function isPastAssignment(status: AssignmentStatus): boolean {
  return status === 'reviewed';
}

export function getDaysLeft(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getGradeLabel(grade: number): string {
  if (grade === 5) return 'Отлично';
  if (grade === 4) return 'Хорошо';
  if (grade === 3) return 'Удовлетворительно';
  return 'Неудовлетворительно';
}

export function getGradeCategory(grade: number): 'excellent' | 'good' | 'satisfactory' | 'unsatisfactory' {
  if (grade === 5) return 'excellent';
  if (grade === 4) return 'good';
  if (grade === 3) return 'satisfactory';
  return 'unsatisfactory';
}
