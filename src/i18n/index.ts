import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          login: {
            title: 'Log In',
            subtitle: 'Welcome back! Please enter your details.',
            emailLabel: 'Email',
            emailPlaceholder: 'Enter your email',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter your password',
            errorTitle: 'Error',
            loggingIn: 'Logging in...',
            loginButton: 'Log In',
            noAccount: "Don't have an account?",
            signUpLink: 'Sign up',
          },
          signup: {
            title: 'Sign Up',
            subtitle: 'Create an account to get started.',
            emailLabel: 'Email',
            emailPlaceholder: 'Enter your email',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter your password',
            confirmPasswordLabel: 'Confirm Password',
            confirmPasswordPlaceholder: 'Confirm your password',
            passwordMismatch: 'Passwords do not match.',
            errorTitle: 'Error',
            signingUp: 'Signing up...',
            signUpButton: 'Sign Up',
            alreadyHaveAccount: 'Already have an account?',
            loginLink: 'Log in',
          },
          dashboard: 'Dashboard',
          adminPanel: 'Admin Panel',
          exam: 'Exam',
          home: 'Home',
          logout: 'Logout',
          addQuestion: 'Add Question',
          questionText: 'Question Text',
          optionText: 'Option Text',
          addOption: 'Add Option',
          removeOption: 'Remove Option',
          correctAnswer: 'Correct Answer',
          saveQuestion: 'Save Question',
          editQuestion: 'Edit Question',
          deleteQuestion: 'Delete Question',
          noQuestions: 'No questions added yet.',
          question: 'Question',
          options: 'Options',
          loading: 'Loading...',
          questions: 'Questions',
          add: 'Add',
          edit: 'Edit',
          delete: 'Delete',
          cancel: 'Cancel',
          confirm: 'Confirm',
          areYouSure: 'Are you sure?',
          yes: 'Yes',
          no: 'No',
          selectCorrectAnswer: 'Select Correct Answer',
          addQuestionSuccess: 'Question added successfully!',
          addQuestionError: 'Error adding question.',
          editQuestionSuccess: 'Question updated successfully!',
          editQuestionError: 'Error updating question.',
          deleteQuestionSuccess: 'Question deleted successfully!',
          deleteQuestionError: 'Error deleting question.',
        },
      },
      // Add other languages as needed
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
