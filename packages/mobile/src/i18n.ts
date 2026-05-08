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
};

function getDeviceLocale(): string {
  try {
    if (Platform.OS === 'web') {
      return navigator.language?.split('-')[0] || 'en';
    }
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      return settings?.AppleLocale?.split('_')[0] || settings?.AppleLanguages?.[0]?.split('-')[0] || 'en';
    }
    if (Platform.OS === 'android') {
      return NativeModules.I18nManager?.localeIdentifier?.split('_')[0] || 'en';
    }
  } catch {}
  return 'en';
}

const locale = getDeviceLocale();
export const t = locale === 'ru' ? strings.ru : strings.en;
export const isRu = locale === 'ru';
