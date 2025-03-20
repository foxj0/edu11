export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      grades: {
        Row: {
          id: number
          name: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      semesters: {
        Row: {
          id: string
          grade_id: number
          name: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          grade_id: number
          name: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          grade_id?: number
          name?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          semester_id: string
          name: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          semester_id: string
          name: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          semester_id?: string
          name?: string
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {          id: string
          subject_id: string
          name: string
          description: string | null
          video_url: string | null
          enabled: boolean
          order_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          name: string
          description?: string | null
          video_url?: string | null
          enabled?: boolean
          order_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          name?: string
          description?: string | null
          video_url?: string | null
          enabled?: boolean
          order_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          lesson_id: string
          question_text: string
          options: Json
          correct_answer: number
          explanation: string | null
          enabled: boolean
          created_at: string
          updated_at: string
          image_url: string | null
          optionTypes: ('text' | 'image')[] | null
        }
        Insert: {
          id?: string
          lesson_id: string
          question_text: string
          options: Json
          correct_answer: number
          explanation?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string | null
          optionTypes?: ('text' | 'image')[] | null
        }
        Update: {
          id?: string
          lesson_id?: string
          question_text?: string
          options?: Json
          correct_answer?: number
          explanation?: string | null
          enabled?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string | null
          optionTypes?: ('text' | 'image')[] | null
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
