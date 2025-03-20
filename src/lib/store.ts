import { create } from 'zustand';
import { supabase } from './supabase';
import { Database } from '../types/supabase';
import { User } from '@supabase/supabase-js';

type Grade = Database['public']['Tables']['grades']['Row'];
type Semester = Database['public']['Tables']['semesters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AppState {
  user: User | null;
  profile: Profile | null;
  grades: Grade[];
  semesters: Semester[];
  subjects: Subject[];
  lessons: Lesson[];
  questions: Question[];
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'ar') => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchData: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateUserProfile: (userId: string, updatedProfile: Partial<Profile>) => Promise<void>;
  addGrade: (name: string) => Promise<void>;
  toggleGradeEnabled: (gradeId: number) => Promise<void>;
  addSemester: (gradeId: number, name: string) => Promise<void>;
  removeSemester: (gradeId: number, semesterId: string) => Promise<void>;
  toggleSemesterEnabled: (gradeId: number, semesterId: string) => Promise<void>;
  addSubject: (semesterId: string, name: string) => Promise<void>;
  removeSubject: (semesterId: string, subjectId: string) => Promise<void>;
  toggleSubjectEnabled: (semesterId: string, subjectId: string) => Promise<void>;
  addLesson: (subjectId: string, name: string) => Promise<void>;
  removeLesson: (subjectId: string, lessonId: string) => Promise<void>;
  toggleLessonEnabled: (subjectId: string, lessonId: string) => Promise<void>;
  updateLessonUrl: (lessonId: string, url: string) => Promise<void>;
  addQuestion: (lessonId: string, question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  removeQuestion: (lessonId: string, questionId: string) => Promise<void>;
  updateQuestion: (questionId: string, updatedQuestion: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
}

const initialState = {
  user: null,
  profile: null,
  grades: [],
  semesters: [],
  subjects: [],
  lessons: [],
  questions: [],
  loading: false,
  error: null,
  theme: (localStorage.getItem('theme') || 'light') as 'light' | 'dark',
  language: (localStorage.getItem('language') || 'en') as 'en' | 'ar',
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  setUser: (user: User | null) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  setLanguage: (language: 'en' | 'ar') => {
    localStorage.setItem('language', language);
    set({ language });
  },
  fetchProfile: async () => {
    const { user } = get();
    if (!user) {
      set({ profile: null });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      set({ error: error.message });
      return;
    }

    set({ profile });
  },
  updateUserProfile: async (userId: string, updatedProfile: Partial<Profile>) => {
      const { error } = await supabase
          .from('profiles')
          .update(updatedProfile)
          .eq('id', userId);

      if (error) {
          console.error('Error updating user profile:', error);
          return;
      }

      // Refetch the profile to update the store
      await get().fetchProfile();
  },
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('*');
      if (gradesError) throw gradesError;

      const { data: semesters, error: semestersError } = await supabase
        .from('semesters')
        .select('*');
      if (semestersError) throw semestersError;

      const { data: subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select('*');
      if (subjectsError) throw subjectsError;

      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*');
      if (lessonsError) throw lessonsError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*');
      if (questionsError) throw questionsError;

      set({
        grades: grades || [],
        semesters: semesters || [],
        subjects: subjects || [],
        lessons: lessons || [],
        questions: questions || [],
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  addGrade: async (name: string) => {
    const { data, error } = await supabase
      .from('grades')
      .insert([{ name }])
      .select();

    if (error) {
      console.error('Error adding grade:', error);
      return;
    }
  },
  toggleGradeEnabled: async (gradeId: number) => {
    const { grades } = get();
    const grade = grades.find((g) => g.id === gradeId);
    if (!grade) return;

    const { error } = await supabase
      .from('grades')
      .update({ enabled: !grade.enabled })
      .eq('id', gradeId);

    if (error) {
      console.error('Error toggling grade enabled:', error);
    }
  },
  addSemester: async (gradeId: number, name: string) => {
    const { data, error } = await supabase
      .from('semesters')
      .insert([{ grade_id: gradeId, name }])
      .select();

    if (error) {
      console.error('Error adding semester:', error);
    }
  },
  removeSemester: async (gradeId: number, semesterId: string) => {
    const { error } = await supabase
      .from('semesters')
      .delete()
      .eq('id', semesterId)
      .eq('grade_id', gradeId);

    if (error) {
      console.error('Error removing semester:', error);
    }
  },
  toggleSemesterEnabled: async (gradeId: number, semesterId: string) => {
    const { semesters } = get();
    const semester = semesters.find((s) => s.id === semesterId && s.grade_id === gradeId);
    if (!semester) return;

    const { error } = await supabase
      .from('semesters')
      .update({ enabled: !semester.enabled })
      .eq('id', semesterId);

    if (error) {
      console.error('Error toggling semester enabled:', error);
    }
  },
  addSubject: async (semesterId: string, name: string) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ semester_id: semesterId, name }])
      .select();

    if (error) {
      console.error('Error adding subject:', error);
    }
  },
  removeSubject: async (semesterId: string, subjectId: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId)
      .eq('semester_id', semesterId);

    if (error) {
      console.error('Error removing subject:', error);
    }
  },
  toggleSubjectEnabled: async (semesterId: string, subjectId: string) => {
    const { subjects } = get();
    const subject = subjects.find((s) => s.id === subjectId && s.semester_id === semesterId);
    if (!subject) return;

    const { error } = await supabase
      .from('subjects')
      .update({ enabled: !subject.enabled })
      .eq('id', subjectId);

    if (error) {
      console.error('Error toggling subject enabled:', error);
    }
  },
  addLesson: async (subjectId: string, name: string) => {
    const { data, error } = await supabase
      .from('lessons')
      .insert([{ subject_id: subjectId, name }])
      .select();

    if (error) {
      console.error('Error adding lesson:', error);
    }
  },
  removeLesson: async (subjectId: string, lessonId: string) => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error removing lesson:', error);
    }
  },
  toggleLessonEnabled: async (subjectId: string, lessonId: string) => {
    const { lessons } = get();
    const lesson = lessons.find((l) => l.id === lessonId && l.subject_id === subjectId);
    if (!lesson) return;

    const { error } = await supabase
      .from('lessons')
      .update({ enabled: !lesson.enabled })
      .eq('id', lessonId);

    if (error) {
      console.error('Error toggling lesson enabled:', error);
    }
  },
  updateLessonUrl: async (lessonId: string, url: string) => {
    const { error } = await supabase
      .from('lessons')
      .update({ video_url: url })
      .eq('id', lessonId);

    if (error) {
      console.error('Error updating lesson URL:', error);
    }
  },
  addQuestion: async (lessonId: string, question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('questions')
      .insert([{ lesson_id: lessonId, ...question }])
      .select();

    if (error) {
      console.error('Error adding question:', error);
    }
  },
  removeQuestion: async (lessonId: string, questionId: string) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId)
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('Error removing question:', error);
    }
  },
  updateQuestion: async (questionId: string, updatedQuestion: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>) => {
    const { error } = await supabase
      .from('questions')
      .update(updatedQuestion)
      .eq('id', questionId);

    if (error) {
      console.error('Error updating question:', error);
    }
  }
}));

supabase
  .channel('public:grades')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, payload => {
    useAppStore.getState().fetchData();
  })
  .subscribe()

supabase
  .channel('public:semesters')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'semesters' }, payload => {
    useAppStore.getState().fetchData();
  })
  .subscribe()

supabase
  .channel('public:subjects')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, payload => {
    useAppStore.getState().fetchData();
  })
  .subscribe()

supabase
  .channel('public:lessons')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, payload => {
    useAppStore.getState().fetchData();
  })
  .subscribe()

supabase
  .channel('public:questions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, payload => {
    useAppStore.getState().fetchData();
  })
  .subscribe();

// Subscribe to changes in the profiles table
supabase
  .channel('public:profiles')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, payload => {
    useAppStore.getState().fetchProfile();
  })
  .subscribe();
