import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, BackHandler, SafeAreaView, StatusBar } from 'react-native';
import { useGameEngine } from './src/hooks/useGameEngine';
import { useSounds } from './src/hooks/useSounds';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { PerformanceOverlay } from './src/components/common/PerformanceOverlay';
import { theme } from './src/theme';
import { t } from './src/i18n';

type Screen = 'home' | 'game' | 'gameover' | 'leaderboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [nickname, setNickname] = useState('');
  const { session, loading, lastResult, lives, gameOver, startGame, submitAnswer, reset } = useGameEngine();
  const { play } = useSounds();

  useEffect(() => {
    if (lastResult === true) play('correct');
    else if (lastResult === false) play('wrong');
  }, [lastResult]);

  useEffect(() => {
    if (gameOver) play('gameOver');
  }, [gameOver]);

  // Android hardware back button
  useEffect(() => {
    const handler = () => {
      if (screen === 'leaderboard') { setScreen('home'); return true; }
      if (screen === 'game') { reset(); setScreen('home'); return true; }
      if (screen === 'gameover') { reset(); setScreen('home'); return true; }
      return false; // Let system handle on home screen
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, [screen, reset]);

  const handleStart = useCallback(async (name: string) => {
    setNickname(name);
    await startGame(name);
    setScreen('game');
  }, [startGame]);

  const handleQuit = useCallback(() => {
    reset();
    setScreen('home');
  }, [reset]);

  const handleTimeout = useCallback(() => {
    submitAnswer(-1);
  }, [submitAnswer]);

  const handlePlayAgain = useCallback(async () => {
    await startGame(nickname);
    setScreen('game');
  }, [startGame, nickname]);

  if (screen === 'game' && gameOver) {
    setScreen('gameover');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.bg} />
      <View style={styles.container}>
        {screen === 'home' && (
          <>
            <HomeScreen onStart={handleStart} />
            <Pressable style={styles.leaderboardBtn} onPress={() => setScreen('leaderboard')}>
              <Text style={styles.leaderboardText}>{t.leaderboardIcon}</Text>
            </Pressable>
          </>
        )}
        {screen === 'game' && session && (
          <GameScreen
            session={session}
            lastResult={lastResult}
            lives={lives}
            loading={loading}
            onAnswer={submitAnswer}
            onTimeout={handleTimeout}
            onQuit={handleQuit}
          />
        )}
        {screen === 'gameover' && session && (
          <GameOverScreen
            score={session.score}
            sessionId={session.sessionId}
            onPlayAgain={handlePlayAgain}
            onHome={handleQuit}
            onLeaderboard={() => setScreen('leaderboard')}
          />
        )}
        {screen === 'leaderboard' && (
          <LeaderboardScreen onBack={() => setScreen('home')} />
        )}
        {__DEV__ && <PerformanceOverlay />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: { flex: 1, backgroundColor: theme.colors.bg },
  leaderboardBtn: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  leaderboardText: { color: theme.colors.textDim, fontSize: 14 },
});