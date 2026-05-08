import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, Image, Platform, Linking } from 'react-native';
import { theme } from '../theme';

const avatar = require('../../assets/avatar.jpg');
const isWeb = Platform.OS === 'web';
const APK_URL = 'https://cheslav.space/patternquest.apk';
const GITHUB_URL = 'https://github.com/al-mighty/patternquest-demo';

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
        <Text style={styles.subtitle}>Find the next shape in the sequence</Text>
      </Animated.View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Your nickname"
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
          <Text style={styles.buttonText}>START GAME</Text>
        </Pressable>
      </View>

      {isWeb && (
        <View style={styles.webBanner}>
          <Text style={styles.bannerText}>Also available as a native app</Text>
          <View style={styles.bannerLinks}>
            <Pressable style={styles.bannerBtn} onPress={() => Linking.openURL(APK_URL)}>
              <Text style={styles.bannerBtnText}>Download APK</Text>
            </Pressable>
            <Pressable style={styles.bannerBtnGhost} onPress={() => Linking.openURL(GITHUB_URL)}>
              <Text style={styles.bannerGhostText}>Source code</Text>
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
