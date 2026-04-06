'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  DiagnosisSession,
  BasicInfo,
  QuestionAnswer,
  FreeTextAnswer,
  DiagnosisScores,
  DiagnosisResult,
} from '@/types/diagnosis';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface DiagnosisState {
  session: DiagnosisSession | null;
}

const initialState: DiagnosisState = {
  session: null,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type DiagnosisAction =
  | { type: 'SET_BASIC_INFO'; payload: BasicInfo }
  | { type: 'ADD_ANSWER'; payload: QuestionAnswer }
  | { type: 'SET_FREE_TEXT'; payload: FreeTextAnswer }
  | { type: 'SET_SCORES'; payload: DiagnosisScores }
  | { type: 'SET_RESULT'; payload: DiagnosisResult }
  | { type: 'RESET' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function diagnosisReducer(
  state: DiagnosisState,
  action: DiagnosisAction
): DiagnosisState {
  switch (action.type) {
    case 'SET_BASIC_INFO': {
      const session: DiagnosisSession = state.session ?? {
        sessionId: crypto.randomUUID(),
        basicInfo: action.payload,
        answers: [],
        freeTexts: [],
        scores: null,
        result: null,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        session: {
          ...session,
          basicInfo: action.payload,
        },
      };
    }

    case 'ADD_ANSWER': {
      if (!state.session) return state;
      const existing = state.session.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      const answers =
        existing === -1
          ? [...state.session.answers, action.payload]
          : state.session.answers.map((a, i) =>
              i === existing ? action.payload : a
            );
      return {
        ...state,
        session: { ...state.session, answers },
      };
    }

    case 'SET_FREE_TEXT': {
      if (!state.session) return state;
      const existing = state.session.freeTexts.findIndex(
        (f) => f.questionId === action.payload.questionId
      );
      const freeTexts =
        existing === -1
          ? [...state.session.freeTexts, action.payload]
          : state.session.freeTexts.map((f, i) =>
              i === existing ? action.payload : f
            );
      return {
        ...state,
        session: { ...state.session, freeTexts },
      };
    }

    case 'SET_SCORES': {
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, scores: action.payload },
      };
    }

    case 'SET_RESULT': {
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, result: action.payload },
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DiagnosisContextValue {
  state: DiagnosisState;
  dispatch: React.Dispatch<DiagnosisAction>;
}

const DiagnosisContext = createContext<DiagnosisContextValue | undefined>(
  undefined
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface DiagnosisProviderProps {
  children: ReactNode;
}

export function DiagnosisProvider({ children }: DiagnosisProviderProps) {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState);

  return (
    <DiagnosisContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagnosisContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Custom hook
// ---------------------------------------------------------------------------

export function useDiagnosis(): DiagnosisContextValue {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) {
    throw new Error('useDiagnosis must be used within a DiagnosisProvider');
  }
  return ctx;
}
