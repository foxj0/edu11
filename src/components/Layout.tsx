import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Moon, Sun, Languages, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Layout() {
  const { user, profile, theme, language, setTheme, setLanguage, setUser } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
         dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {t('eduPlatform')}
                  {profile?.role === 'admin' && ' - Admin'}
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button onClick={toggleLanguage}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Languages className="w-5 h-5" />
              </button>

              {user && (
                <button onClick={handleLogout}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
