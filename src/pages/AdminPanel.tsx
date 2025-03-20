import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash,
  ToggleLeft,
  Edit,
  Save,
  X,
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  FileText,
  User,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Database, Json } from '../types/supabase';
import { supabase } from '../lib/supabase';

type Grade = Database['public']['Tables']['grades']['Row'];
type Semester = Database['public']['Tables']['semesters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminPanel() {
  const { t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newExplanationUrl, setNewExplanationUrl] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newUserRole, setNewUserRole] = useState<string>('user');

  const [newQuestion, setNewQuestion] = useState<{
    question_text: string;
    options: string[];
    correct_answer: number;
    explanation: string | null;
    image_url: string | null;
    optionTypes: ('text' | 'image')[];
  }>({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: null,
    image_url: null,
    optionTypes: ['text', 'text', 'text', 'text'],
  });

  const {
    grades,
    semesters,
    subjects,
    lessons,
    questions,
    addGrade,
    toggleGradeEnabled,
    addSemester,
    removeSemester,
    toggleSemesterEnabled,
    addSubject,
    removeSubject,
    toggleSubjectEnabled,
    addLesson,
    removeLesson,
    toggleLessonEnabled,
    updateLessonUrl,
    addQuestion,
    removeQuestion,
    updateQuestion,
    fetchData,
    updateUserProfile,
  } = useAppStore();

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [fetchData]);

  useEffect(() => {
    if (editingQuestion === null) {
      setNewQuestion({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: null,
        image_url: null,
        optionTypes: ['text', 'text', 'text', 'text'],
      });
    }
  }, [editingQuestion]);

  const handleBack = () => {
    if (selectedLesson !== null) {
      setSelectedLesson(null);
    } else if (selectedSubject !== null) {
      setSelectedSubject(null);
    } else if (selectedSemester !== null) {
      setSelectedSemester(null);
    } else if (selectedGrade !== null) {
      setSelectedGrade(null);
    } else if (selectedUser !== null) {
      setSelectedUser(null);
    }
    setEditMode(false);
    setEditingQuestion(null);
    setNewItemName('');
    setNewExplanationUrl('');
    setNewQuestion({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: null,
      image_url: null,
      optionTypes: ['text', 'text', 'text', 'text'],
    });
  };

  const handleAdd = async () => {
    if (!newItemName.trim() && !newQuestion.question_text.trim()) return;

    if (
      selectedLesson !== null &&
      selectedSubject !== null &&
      selectedSemester !== null &&
      selectedGrade !== null
    ) {
      await addQuestion(selectedLesson, {
        question_text: newQuestion.question_text,
        options: newQuestion.options,
        correct_answer: newQuestion.correct_answer,
        explanation: newQuestion.explanation,
        image_url: newQuestion.image_url,
        optionTypes: newQuestion.optionTypes,
      });
    } else if (
      selectedSubject !== null &&
      selectedSemester !== null &&
      selectedGrade !== null
    ) {
      await addLesson(selectedSubject, newItemName);
    } else if (selectedSemester !== null && selectedGrade !== null) {
      await addSubject(selectedSemester, newItemName);
    } else if (selectedGrade !== null) {
      await addSemester(selectedGrade, newItemName);
    }

    setNewItemName('');
    setEditMode(false);
    setNewQuestion({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: null,
      image_url: null,
      optionTypes: ['text', 'text', 'text', 'text'],
    });
  };

  const handleEdit = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);

    if (question) {
      setEditingQuestion(questionId);
      setNewQuestion({
        question_text: question.question_text,
        options: question.options as string[],
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        image_url: question.image_url,
        optionTypes:
          (question.optionTypes as ('text' | 'image')[] | null) || [
            'text',
            'text',
            'text',
            'text',
          ],
      });
      setEditMode(true);
    }
  };

  const handleUpdateUserRole = async () => {
    if (selectedUser) {
      await updateUserProfile(selectedUser, { role: newUserRole });
      fetchUsers(); // Refresh user list
      setSelectedUser(null); // Reset selection
    }
  };

  const handleUpdate = async () => {
    if (editingQuestion !== null) {
      await updateQuestion(editingQuestion, {
        question_text: newQuestion.question_text,
        options: newQuestion.options,
        correct_answer: newQuestion.correct_answer,
        explanation: newQuestion.explanation,
        image_url: newQuestion.image_url,
        optionTypes: newQuestion.optionTypes,
      });
      setEditingQuestion(null);
      setEditMode(false);
      setNewQuestion({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: null,
        image_url: null,
        optionTypes: ['text', 'text', 'text', 'text'],
      });
    }
  };

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-2xl font-semibold">User Management</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
            onClick={() => {
              setSelectedUser(user.id);
              setNewUserRole(user.role);
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                {user.id}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
              >
                {user.role}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedUser && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Edit User Role</h3>
          <div className="flex items-center gap-4 mt-2">
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleUpdateUserRole}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Role
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCard = (
    item: { id: number | string; name: string; enabled: boolean },
    onToggle: () => void,
    onRemove: () => void,
    onClick: () => void
  ) => (
    <motion.div
      key={item.id.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`p-2 rounded-lg ${item.enabled
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
              }`}
          >
            <ToggleLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className={`text-sm ${item.enabled ? 'text-green-600' : 'text-red-600'}`}>
        {item.enabled ? 'Enabled' : 'Disabled'}
      </p>
    </motion.div>
  );

  const renderGrades = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Grades</h2>
        <button
          onClick={() => setSelectedUser(null)} // Ensure user management is deselected
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <User className="w-5 h-5" />
          Manage Users
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols```typescript
-3 gap-6">
        <AnimatePresence>
          {grades.map((grade) =>
            renderCard(
              grade,
              () => toggleGradeEnabled(grade.id),
              () => { }, // Grades cannot be removed
              () => setSelectedGrade(grade.id)
            )
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const renderSemesters = () => {
    const filteredSemesters = semesters.filter((s) => s.grade_id === selectedGrade);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Grades
          </button>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Add Semester
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSemesters.map((semester) =>
              renderCard(
                semester,
                () => toggleSemesterEnabled(semester.grade_id, semester.id),
                () => removeSemester(semester.grade_id, semester.id),
                () => setSelectedSemester(semester.id)
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderSubjects = () => {
    const filteredSubjects = subjects.filter((s) => s.semester_id === selectedSemester);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Semesters
          </button>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubjects.map((subject) =>
              renderCard(
                subject,
                () => toggleSubjectEnabled(subject.semester_id, subject.id),
                () => removeSubject(subject.semester_id, subject.id),
                () => setSelectedSubject(subject.id)
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderLessons = () => {
    const filteredLessons = lessons.filter((l) => l.subject_id === selectedSubject);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subjects
          </button>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredLessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{lesson.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLessonEnabled(lesson.subject_id, lesson.id);
                      }}
                      className={`p-2 rounded-lg ${
                        lesson.enabled
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                      }`}
                    >
                      <ToggleLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLesson(lesson.subject_id, lesson.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      lesson.enabled ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {lesson.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Explanation
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderQuestions = () => {
    const filteredQuestions = questions.filter(
      (q) => q.lesson_id === selectedLesson
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </button>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="url"
                value={newExplanationUrl}
                onChange={(e) => setNewExplanationUrl(e.target.value)}
                placeholder="Enter explanation URL"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button
              onClick={() => {
                if (selectedLesson) {
                  updateLessonUrl(selectedLesson, newExplanationUrl);
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update URL
            </button>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuestions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    {question.image_url ? (
                      <img
                        src={question.image_url}
                        alt="Question"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      question.question_text
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(question.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (selectedLesson) {
                          removeQuestion(selectedLesson, question.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {(question.options as string[]).map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        index === question.correct_answer
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {question.optionTypes &&
                      question.optionTypes[index] === 'image' ? (
                        <img
                          src={option}
                          alt={`Option ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ) : (
                        option
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderAddForm = () => {
    if (!editMode) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingQuestion !== null ? 'Edit' : 'Add New'}{' '}
              {selectedLesson !== null
                ? 'Question'
                : selectedSubject !== null
                ? 'Lesson'
                : selectedSemester !== null
                ? 'Subject'
                : 'Semester'}
            </h3>
            <button
              onClick={() => {
                setEditMode(false);
                setEditingQuestion(null);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingQuestion !== null ? handleUpdate() : handleAdd();
            }}
            className="space-y-4"
          >
            {selectedLesson !== null ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          image_url: null,
                          question_text: '',
                        }))
                      }
                      className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        !newQuestion.image_url
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          image_url: '',
                          question_text: '',
                        }))
                      }
                      className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        newQuestion.image_url
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-5 h-5" />
                      Image
                    </button>
                  </div>
                </div>
                {newQuestion.image_url ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Question Image URL
                    </label>
                    <input
                      type="url"
                      value={newQuestion.image_url || ''}
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          image_url: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter image URL"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={newQuestion.question_text}
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          question_text: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter question text"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Options
                  </label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <select
                        value={newQuestion.optionTypes[index]}
                        onChange={(e) => {
                          const newOptionTypes = [...newQuestion.optionTypes];
                          newOptionTypes[index] = e.target.value as
                            | 'text'
                            | 'image';
                          setNewQuestion((prev) => ({
                            ...prev,
                            optionTypes: newOptionTypes,
                          }));
                        }}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                      </select>
                      <input
                        type={
                          newQuestion.optionTypes[index] === 'image'
                            ? 'url'
                            : 'text'
                        }
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion((prev) => ({
                            ...prev,
                            options: newOptions,
                          }));
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder={`${
                          newQuestion.optionTypes[index] === 'image'
                            ? 'Image URL'
                            : 'Text'
                        } for Option ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correct_answer === index}
                        onChange={() =>
                          setNewQuestion((prev) => ({
                            ...prev,
                            correct_answer: index,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder={`Enter name`}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditingQuestion(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {editingQuestion !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage grades, semesters, subjects, and lessons
        </p>
      </div>

      {selectedUser !== null
        ? renderUserManagement()
        : selectedLesson !== null
        ? renderQuestions()
        : selectedSubject !== null
        ? renderLessons()
        : selectedSemester !== null
        ? renderSubjects()
        : selectedGrade !== null
        ? renderSemesters()
        : renderGrades()}

      <AnimatePresence>{editMode && renderAddForm()}</AnimatePresence>
    </div>
  );
}
