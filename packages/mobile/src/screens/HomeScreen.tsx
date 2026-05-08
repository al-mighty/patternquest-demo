import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, Image, Platform, Linking } from 'react-native';
import { theme } from '../theme';
import { t } from '../i18n';

const avatar = require('../../assets/avatar.jpg');
const isWeb = Platform.OS === 'web';
const APK_URL = 'https://cheslav.space/patternquest.apk';
const GITHUB_URL = 'https://github.com/al-mighty/patternquest-demo';
const PORTFOLIO_URL = 'https://cheslav.space';
const YM_ID = 109033343;

function trackAndOpen(url: string, goal: string) {
  if (isWeb && typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(YM_ID, 'reachGoal', goal, { url });
  }
  Linking.openURL(url);
}

interface Props {
  onStart: (nickname: string) => void;
}

export function HomeScreen({ onStart }: Props) {
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const avatarScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(avatarScale, { toValue: 1, damping: 8, useNativeDriver: !isWeb }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: !isWeb }),
        Animated.spring(slideAnim, { toValue: 0, damping: 12, useNativeDriver: !isWeb }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.avatarWrap, { transform: [{ scale: avatarScale }] }]}>
        <Image source={avatar} style={styles.avatar} />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.title}>Pattern<Text style={styles.accent}>Quest</Text></Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </Animated.View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t.nickname}
          placeholderTextColor={theme.colors.textDim}
          value={name}
          onChangeText={setName}
          maxLength={20}
          autoCapitalize="none"
        />
        <Pressable
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={() => name.trim() && onStart(name.trim())}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>{t.start}</Text>
        </Pressable>
      </View>

      <View style={styles.portfolioWrap}>
        <Pressable style={styles.portfolioBtn} onPress={() => trackAndOpen(PORTFOLIO_URL, 'portfolio_click')}>
          <Text style={styles.portfolioText}>{t.portfolio}</Text>
          <Text style={styles.portfolioArrow}> &rarr;</Text>
        </Pressable>
      </View>

      {isWeb && (
        <View style={styles.webBanner}>
          <Text style={styles.bannerText}>{t.webBanner}</Text>
          <View style={styles.bannerLinks}>
            <Pressable style={styles.bannerBtn} onPress={() => trackAndOpen(APK_URL, 'apk_download')}>
              <Text style={styles.bannerBtnText}>{t.downloadApk}</Text>
            </Pressable>
            <Pressable style={styles.bannerBtnGhost} onPress={() => trackAndOpen(GITHUB_URL, 'source_code')}>
              <Text style={styles.bannerGhostText}>{t.sourceCode}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  avatarWrap: {
    width: 120, height: 120, borderRadius: 60, overflow: 'hidden',
    borderWidth: 2, borderColor: theme.colors.accent, marginBottom: theme.spacing.lg,
  },
  avatar: { width: '100%', height: '100%' },
  title: { fontSize: 42, fontWeight: '300', color: theme.colors.text, textAlign: 'center' },
  accent: { color: theme.colors.accent, fontWeight: '700' },
  subtitle: { fontSize: theme.font.body, color: theme.colors.textDim, textAlign: 'center', marginTop: theme.spacing.sm },
  form: { marginTop: theme.spacing.xxl, width: '100%', maxWidth: 320 },
  input: {
    backgroundColor: theme.colors.surface, color: theme.colors.text,
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md,
    fontSize: theme.font.body, marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.accent, borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: theme.colors.bg, fontSize: theme.font.mono, fontWeight: '700', letterSpacing: 2 },
  portfolioWrap: { marginTop: 20, alignItems: 'center' },
  portfolioBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  portfolioText: { color: theme.colors.accent, fontSize: 14, fontWeight: '500' },
  portfolioArrow: { color: theme.colors.accent, fontSize: 14 },
  webBanner: {
    marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', width: '100%', maxWidth: 320,
  },
  bannerText: { color: theme.colors.textDim, fontSize: 12, letterSpacing: 1, marginBottom: 12 },
  bannerLinks: { flexDirection: 'row', gap: 12 },
  bannerBtn: {
    backgroundColor: theme.colors.accent, borderRadius: 6,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  bannerBtnText: { color: theme.colors.bg, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  bannerBtnGhost: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 6,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  bannerGhostText: { color: theme.colors.textDim, fontSize: 11, letterSpacing: 1 },
});
