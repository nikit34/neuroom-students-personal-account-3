import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Assignment, Achievement, Grade, ChatMessage, AppMode } from '../types';
import { mockAssignments, mockAchievements, mockGrades, mockChatHistory } from '../constants/mockData';

interface AppState {
  mode: AppMode;
  assignments: Assignment[];
  achievements: Achievement[];
  grades: Grade[];
  chatMessages: Record<string, ChatMessage[]>;
}

type Action =
  | { type: 'TOGGLE_MODE' }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { assignmentId: string; message: ChatMessage } }
  | { type: 'EARN_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement };

const initialState: AppState = {
  mode: 'student',
  assignments: mockAssignments,
  achievements: mockAchievements,
  grades: mockGrades,
  chatMessages: { '1': mockChatHistory, '6': mockChatHistory },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'student' ? 'parent' : 'student' };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.assignmentId]: [
            ...(state.chatMessages[action.payload.assignmentId] || []),
            action.payload.message,
          ],
        },
      };
    case 'EARN_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.payload ? { ...a, earnedAt: new Date().toISOString() } : a
        ),
      };
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
