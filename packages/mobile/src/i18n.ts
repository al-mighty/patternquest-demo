import { useState, useCallback } from 'react';
import { Platform, NativeModules } from 'react-native';

const strings = {
  en: {
    title: 'PatternQuest',
    subtitle: 'Find the next shape in the sequence',
    nickname: 'Your nickname',
    start: 'START GAME',
    portfolio: 'My Portfolio',
    webBanner: 'Also available as a native app',
    downloadApk: 'Download APK',
    sourceCode: 'Source code',
    score: 'SCORE',
    streak: 'STREAK',
    lives: 'LIVES',
    level: 'LEVEL',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameOver: 'Game Over',
    finalScore: 'FINAL SCORE',
    correctLabel: 'CORRECT',
    accuracy: 'ACCURACY',
    bestStreak: 'BEST STREAK',
    playAgain: 'PLAY AGAIN',
    leaderboard: 'Leaderboard',
    leaderboardIcon: '🏆 Leaderboard',
    noScores: 'No scores yet. Be the first!',
    back: '← Back',
    home: '← Home',
  },
  ru: {
    title: 'PatternQuest',
    subtitle: 'Найди следующую фигуру в последовательности',
    nickname: 'Ваш никнейм',
    start: 'НАЧАТЬ ИГРУ',
    portfolio: 'Моё портфолио',
    webBanner: 'Также доступно как нативное приложение',
    downloadApk: 'Скачать APK',
    sourceCode: 'Исходный код',
    score: 'ОЧКИ',
    streak: 'СЕРИЯ',
    lives: 'ЖИЗНИ',
    level: 'УРОВЕНЬ',
    correct: 'Верно!',
    wrong: 'Неверно!',
    gameOver: 'Игра окончена',
    finalScore: 'ИТОГОВЫЙ СЧЁТ',
    correctLabel: 'ВЕРНЫХ',
    accuracy: 'ТОЧНОСТЬ',
    bestStreak: 'ЛУЧШАЯ СЕРИЯ',
    playAgain: 'ИГРАТЬ СНОВА',
    leaderboard: 'Таблица лидеров',
    leaderboardIcon: '🏆 Таблица лидеров',
    noScores: 'Пока нет результатов. Будь первым!',
    back: '← Назад',
    home: '← Главная',
  },
} as const;

function getDeviceLocale(): 'en' | 'ru' {
  try {
    if (Platform.OS === 'web') {
      return navigator.language?.split('-')[0] === 'ru' ? 'ru' : 'en';
    }
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      const lang = settings?.AppleLocale?.split('_')[0] || settings?.AppleLanguages?.[0]?.split('-')[0];
      return lang === 'ru' ? 'ru' : 'en';
    }
    if (Platform.OS === 'android') {
      const lang = NativeModules.I18nManager?.localeIdentifier?.split('_')[0];
      return lang === 'ru' ? 'ru' : 'en';
    }
  } catch {}
  return 'en';
}

// Simple global state for locale
let _locale: 'en' | 'ru' = getDeviceLocale();
let _listeners: Array<() => void> = [];

export function getLocale() { return _locale; }
export function getT() { return strings[_locale]; }

// Static export for non-component code
export let t = strings[_locale];

export function useI18n() {
  const [locale, setLocaleState] = useState(_locale);

  const toggleLocale = useCallback(() => {
    _locale = _locale === 'en' ? 'ru' : 'en';
    t = strings[_locale];
    setLocaleState(_locale);
    _listeners.forEach(fn => fn());
  }, []);

  // Subscribe to external changes
  useState(() => {
    const update = () => setLocaleState(_locale);
    _listeners.push(update);
    return () => { _listeners = _listeners.filter(fn => fn !== update); };
  });

  return {
    t: strings[locale],
    locale,
    toggleLocale,
    isRu: locale === 'ru',
  };
}
