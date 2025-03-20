import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Play,
  Brain,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Book
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Database } from '../types/supabase';

type Grade = Database['public']['Tables']['grades']['Row'];
type Semester = Database['public']['Tables']['semesters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];

interface TestAnswer {
  correct: boolean;
  shown: boolean;
  selectedChoice: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [mode, setMode] = useState<'study' | 'test' | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [testResults, setTestResults] = useState<{
    total: number;
    correct: number;
    complete: boolean;
  } | null>(null);

    const {
      grades,
      semesters,
      subjects,
      lessons,
      questions,
      fetchData
    } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGradeSelect = (gradeId: number | null) => {
    setSelectedGrade(gradeId);
    setSelectedSemester(null);
    setMode(null);
    setSelectedSubject(null);
    setSelectedLessons([]);
    setTestInProgress(false);
    setTestResults(null);
  };

  const handleSemesterSelect = (semesterId: string | null) => {
    setSelectedSemester(semesterId);
    setMode(null);
    setSelectedSubject(null);
    setSelectedLessons([]);
    setTestInProgress(false);
    setTestResults(null);
  };

  const handleModeSelect = (selectedMode: 'study' | 'test') => {
    setMode(selectedMode);
    setSelectedSubject(null);
    setSelectedLessons([]);
    setTestInProgress(false);
    setTestResults(null);
  };

  const handleSubjectSelect = (subjectId: string | null) => {
    setSelectedSubject(subjectId);
    setSelectedLessons([]);
  };

  const handleLessonToggle = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const startTest = () => {
    setTestInProgress(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResults(null);
  };

  const handleAnswer = (choiceIndex: number) => {
    const currentQuestions = getCurrentQuestions();
    if (currentQuestions.length === 0 || currentQuestion >= currentQuestions.length) {
      return;
    }
    const isCorrect = choiceIndex === currentQuestions[currentQuestion].correct_answer;

    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = {
        correct: isCorrect,
        shown: false,
        selectedChoice: choiceIndex,
      };
      return newAnswers;
    });
  };

  const getCurrentQuestions = () => {
  if (!selectedGrade || !selectedSemester || !selectedSubject || selectedLessons.length === 0) {
    return [];
  }

  const filteredLessons = lessons.filter((lesson) =>
    selectedLessons.includes(lesson.id) && lesson.subject_id === selectedSubject
  );

  let lessonIds = filteredLessons.map((lesson) => lesson.id)

  const filteredQuestions = questions.filter((question) =>
    lessonIds.includes(question.lesson_id)
  );

  return filteredQuestions;
};

  const resetTest = () => {
    setTestInProgress(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResults(null);
  };

  const nextQuestion = () => {
    const currentQuestions = getCurrentQuestions();

    if (currentQuestion === currentQuestions.length - 1) {
      const correctAnswers = answers.filter((a) => a?.correct).length;
      setTestResults({
        total: currentQuestions.length,
        correct: correctAnswers,
        complete: true,
      });
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const renderContent = () => {
    if (testResults?.complete) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {testResults.correct} / {testResults.total}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You got {testResults.correct} questions correct out of {testResults.total}
          </p>
          <button
            onClick={resetTest}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    if (testInProgress) {
      const questionsList = getCurrentQuestions();
      if (questionsList.length === 0 || currentQuestion >= questionsList.length) {
        return null;
      }
      const currentQ = questionsList[currentQuestion];
      const currentAnswer = answers[currentQuestion];

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8"
        >
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>
                Question {currentQuestion + 1} of {questionsList.length}
              </span>
              <span>
                {Math.round((currentQuestion / questionsList.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion / questionsList.length) * 100}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-6">
              {currentQ.image_url ? (
                <img
                  src={currentQ.image_url}
                  alt="Question"
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                currentQ.question_text
              )}
            </h2>
            <div className="space-y-3">
              {(currentQ.options as string[]).map((choice, index) => (
                <motion.button
                  key={index}
                  whileHover={!currentAnswer && { scale: 1.02 }}
                  onClick={() => !currentAnswer && handleAnswer(index)}
                  disabled={currentAnswer !== undefined}
                  className={`w-full p-4 rounded-xl text-left transition-colors relative overflow-hidden ${
                    currentAnswer
                      ? index === currentQ.correct_answer
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                        : index === currentAnswer.selectedChoice
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        : 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        currentAnswer
                          ? index === currentQ.correct_answer
                            ? 'border-green-500 text-green-500'
                            : index === currentAnswer.selectedChoice
                            ? 'border-red-500 text-red-500'
                            : 'border-gray-400 text-gray-400'
                          : 'border-gray-400 text-gray-400'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>
                      {currentQ.optionTypes && currentQ.optionTypes[index] === 'image' ? (
                        <img
                          src={choice}
                          alt={`Option ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ) : (
                        choice
                      )}
                    </span>
                  </div>

                  {currentAnswer &&
                    (index === currentAnswer.selectedChoice || index === currentQ.correct_answer) && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className={`absolute left-0 top-0 h-full opacity-20 ${
                          index === currentQ.correct_answer ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {currentAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700"
            >
              <div
                className={`flex items-center gap-2 mb-2 ${
                  currentAnswer.correct
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {currentAnswer.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{currentQ.explanation}</p>
            </motion.div>
          )}

          {currentAnswer && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={nextQuestion}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <span>Next Question</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      );
    }

    if (!selectedGrade) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <motion.button
              key={grade.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleGradeSelect(grade.id)}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold">{grade.name}</h3>
            </motion.button>
          ))}
        </div>
      );
    }

    if (!selectedSemester) {
      const grade = grades.find((g) => g.id === selectedGrade);
      const filteredSemesters = semesters.filter((s) => s.grade_id === selectedGrade);

      return (
        <div className="space-y-6">
          <button
            onClick={() => handleGradeSelect(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Grades
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSemesters.map((semester) => (
              <motion.button
                key={semester.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSemesterSelect(semester.id)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold">{semester.name}</h3>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    if (!mode) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedSemester(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Semesters
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleModeSelect('study')}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
            >
              <Play className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Study Mode</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Watch lesson videos and learn at your own pace
              </p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleModeSelect('test')}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
            >
              <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Test Mode</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Test your knowledge with interactive quizzes
              </p>
            </motion.button>
          </div>
        </div>
      );
    }

    const grade = grades.find((g) => g.id === selectedGrade);
    const semester = semesters.find((s) => s.id === selectedSemester);
    const filteredSubjects = subjects.filter((s) => s.semester_id === selectedSemester);

    if (!selectedSubject) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setMode(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mode Selection
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSubjectSelect(subject.id)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Book className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold">{subject.name}</h3>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    const subject = subjects.find((s) => s.id === selectedSubject);
    const filteredLessons = lessons.filter((l) => l.subject_id === selectedSubject);

    if (mode === 'study') {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subjects
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">{subject?.name} Lessons</h2>
            <div className="space-y-3">
              {filteredLessons.map((lesson) => (
                <a
                  key={lesson.id}
                  href={lesson.video_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="font-medium">{lesson.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lesson.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (mode === 'test') {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subjects
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Select Lessons to Test</h2>
            <div className="space-y-3">
              {filteredLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonToggle(lesson.id)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between ${
                    selectedLessons.includes(lesson.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5" />
                    <div className="text-left">
                      <h3 className="font-medium">{lesson.name}</h3>
                      <p
                        className={`text-sm ${
                          selectedLessons.includes(lesson.id)
                            ? 'text-indigo-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {lesson.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  {selectedLessons.includes(lesson.id) && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
            {selectedLessons.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startTest}
                className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Start Test ({selectedLessons.length} lessons)
              </motion.button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {selectedGrade
            ? `Grade ${selectedGrade}${
                selectedSemester ? ` - Semester ${selectedSemester}` : ''
              }`
            : 'Select Your Grade'}
        </h1>
      </div>
      {renderContent()}
    </motion.div>
  );
}
