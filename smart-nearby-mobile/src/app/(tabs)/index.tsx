import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const LIGHT = {
  bg: "#ffffff",
  header: "#ffffff",
  headerBorder: "#f0f0f0",
  text: "#111",
  textSecondary: "#333333",
  textMuted: "#888",
  textMuted2: "#555",
  textMuted3: "#666",
  searchInput: "#fff",
  searchBorder: "#e0e0e0",
  gridItem: "#fafafa",
  gridBorder: "#f0f0f0",
  gridLabel: "#111",
  tableFeature: "#111",
  tableBenefit: "#666",
  sectionTitle: "#111",
  ctaTitle: "#111",
  featureTitle: "#111",
};

const DARK = {
  bg: "#0f0f0f",
  header: "#1a1a1a",
  headerBorder: "#2a2a2a",
  text: "#f0f0f0",
  textSecondary: "#d1d5db",
  textMuted: "#9ca3af",
  textMuted2: "#9ca3af",
  textMuted3: "#9ca3af",
  searchInput: "#1e1e1e",
  searchBorder: "#3a3a3a",
  gridItem: "#1e1e1e",
  gridBorder: "#2a2a2a",
  gridLabel: "#f0f0f0",
  tableFeature: "#f0f0f0",
  tableBenefit: "#9ca3af",
  sectionTitle: "#f0f0f0",
  ctaTitle: "#f0f0f0",
  featureTitle: "#f0f0f0",
};

export default function HomeScreen() {
  const [isDark, setIsDark] = useState(false);
  const T = isDark ? DARK : LIGHT;

  return (
    <View style={[styles.wrapper, { backgroundColor: T.bg }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: T.header, borderBottomColor: T.headerBorder }]}>
        <Text style={[styles.logo, { color: T.text }]}>Smart Nearby</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            <Text style={{ fontSize: 20 }}>{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/login")}>
            <Text style={styles.headerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} decelerationRate={0.998} overScrollMode="never" bounces={true}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroBadge, { backgroundColor: isDark ? "#2a1f00" : "#fffbeb" }]}>
            <Text style={styles.heroBadgeText}>✨ Find spots that match your mood</Text>
          </View>
          <Text style={[styles.heroTitle, { color: T.text }]}>
            Find the right place, for how you feel right now.
          </Text>
          <Text style={[styles.heroSubtitle, { color: T.textSecondary }]}>
            From quiet cafes to buzzing nightlife — discover spots near you that precisely align with your mood.
          </Text>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Enter your location"
              style={[styles.searchInput, { backgroundColor: T.searchInput, borderColor: T.searchBorder, color: T.text }]}
              placeholderTextColor={T.textMuted}
            />
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.8} onPress={() => router.push("/login")}>
              <Text style={styles.searchButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>How it works</Text>
          <Text style={[styles.sectionTitle, { color: T.sectionTitle }]}>Less searching, more doing.</Text>
        </View>

        <View style={[styles.feature, { backgroundColor: isDark ? "#1e1f3a" : "#e0e4ff" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#667eea" }]}>
            <Text style={styles.featureEmoji}>🎯</Text>
          </View>
          <Text style={[styles.featureTitle, { color: T.featureTitle }]}>Pick your mood</Text>
          <Text style={[styles.featureText, { color: T.textMuted2 }]}>
            Need to focus, grab a quick bite, or hang out with friends? Tell us your vibe and we'll filter out everything that doesn't fit.
          </Text>
        </View>

        <View style={[styles.feature, { backgroundColor: isDark ? "#2d2410" : "#fef3c7" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#f59e0b" }]}>
            <Text style={styles.featureEmoji}>📍</Text>
          </View>
          <Text style={[styles.featureTitle, { color: T.featureTitle }]}>See what's nearby</Text>
          <Text style={[styles.featureText, { color: T.textMuted2 }]}>
            Real places, real ratings, real directions — all based on where you actually are right now.
          </Text>
        </View>

        <View style={[styles.feature, { backgroundColor: isDark ? "#2d1a26" : "#fce7f3" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#ec4899" }]}>
            <Text style={styles.featureEmoji}>⭐</Text>
          </View>
          <Text style={[styles.featureTitle, { color: T.featureTitle }]}>Save your favorites</Text>
          <Text style={[styles.featureText, { color: T.textMuted2 }]}>
            Bookmark places you love and revisit them anytime, anywhere.
          </Text>
        </View>

        {/* What you get */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: T.sectionTitle }]}>What you get</Text>
        </View>

        <View style={styles.table}>
          {[
            { bg: isDark ? "#0d2a1e" : "#d1fae5", emoji: "🎯", title: "Mood Matching", sub: "Only see places that fit what you're looking for" },
            { bg: isDark ? "#0d2530" : "#ecfeff", emoji: "📡", title: "Live Locations", sub: "Always up to date with real places nearby" },
            { bg: isDark ? "#1e1a2e" : "#f5f3ff", emoji: "⭐", title: "Ratings & Reviews", sub: "Know before you go — no more surprises" },
          ].map((row, i) => (
            <View key={i} style={[styles.tableRow, { backgroundColor: row.bg }]}>
              <Text style={styles.tableEmoji}>{row.emoji}</Text>
              <View style={styles.tableTextWrap}>
                <Text style={[styles.tableFeature, { color: T.tableFeature }]}>{row.title}</Text>
                <Text style={[styles.tableBenefit, { color: T.tableBenefit }]}>{row.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>What people say</Text>
          <Text style={[styles.sectionTitle, { color: T.sectionTitle }]}>Loved by people on the go</Text>
        </View>

        {[
          { bg: isDark ? "#2d2410" : "#fef3c7", quote: `"I used to spend forever scrolling trying to find a quiet cafe to study. Now I just pick 'Study' and I'm there in five minutes."`, author: "— Disha, Manipal" },
          { bg: isDark ? "#2d1a26" : "#fce7f3", quote: `"Found the best rooftop bar for our friend's birthday in minutes. The nightlife filter is a lifesaver on weekends."`, author: "— Aroha, Udupi" },
          { bg: isDark ? "#0d2a1e" : "#d1fae5", quote: `"Ratings and 'open now' status saved me from showing up to a closed gym twice. Such a small thing but so useful."`, author: "— Rohan, Manipal" },
          { bg: isDark ? "#1e1f3a" : "#e0e4ff", quote: `"As a student, the budget filter helps me find good food without blowing my monthly allowance."`, author: "— Rashmi, MIT Manipal" },
        ].map((t, i) => (
          <View key={i} style={[styles.testimonial, { backgroundColor: t.bg }]}>
            <Text style={[styles.testimonialQuote, { color: isDark ? "#d1d5db" : "#78350f" }]}>{t.quote}</Text>
            <Text style={[styles.testimonialAuthor, { color: isDark ? "#9ca3af" : "#b45309" }]}>{t.author}</Text>
          </View>
        ))}

        {/* Feature Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Everything in one app</Text>
          <Text style={[styles.sectionTitle, { color: T.sectionTitle }]}>Built for how you explore</Text>
        </View>

        <View style={styles.featureGrid}>
          {[
            { emoji: "🎯", label: "Mood-based search" },
            { emoji: "📍", label: "Location-aware results" },
            { emoji: "⭐", label: "Ratings & reviews" },
            { emoji: "💰", label: "Price level info" },
            { emoji: "🕒", label: "Open now status" },
            { emoji: "🖼️", label: "Photos of places" },
            { emoji: "🔐", label: "Secure login" },
            { emoji: "🚀", label: "Fast & simple UI" },
          ].map((g, i) => (
            <View key={i} style={[styles.gridItem, { backgroundColor: T.gridItem, borderColor: T.gridBorder }]}>
              <Text style={styles.gridEmoji}>{g.emoji}</Text>
              <Text style={[styles.gridLabel, { color: T.gridLabel }]}>{g.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { color: T.ctaTitle }]}>Ready to find your spot?</Text>
          <Text style={[styles.ctaSubtitle, { color: T.textMuted }]}>
            Join Smart Nearby and start exploring places made for how you feel.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  logo: { fontSize: 20, fontWeight: "800", lineHeight: 24 },
  headerButton: { borderWidth: 1.5, borderColor: "#f59e0b", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  headerLink: { fontSize: 14, fontWeight: "600", color: "#f59e0b", lineHeight: 18 },
  container: { flex: 1 },
  hero: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 50 },
  heroBadge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginBottom: 24 },
  heroBadgeText: { fontSize: 13, fontWeight: "700", color: "#b45309" },
  heroTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5, lineHeight: 38, marginBottom: 14 },
  heroSubtitle: { fontSize: 16, lineHeight: 26, marginBottom: 28 },
  searchBox: { flexDirection: "row", gap: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  searchButton: { backgroundColor: "#f59e0b", borderRadius: 12, paddingHorizontal: 22, justifyContent: "center" },
  searchButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sectionHeader: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  sectionTitle: { fontSize: 24, fontWeight: "800" },
  feature: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 24, alignItems: "center" },
  featureIconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  featureEmoji: { fontSize: 30 },
  featureTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  featureText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  table: { paddingHorizontal: 20, gap: 12 },
  tableRow: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 16, gap: 14 },
  tableEmoji: { fontSize: 28 },
  tableTextWrap: { flex: 1 },
  tableFeature: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  tableBenefit: { fontSize: 14, lineHeight: 20 },
  testimonial: { marginHorizontal: 20, marginTop: 30, marginBottom: 10, borderRadius: 20, padding: 28 },
  testimonialQuote: { fontSize: 17, fontStyle: "italic", lineHeight: 26, marginBottom: 12 },
  testimonialAuthor: { fontSize: 14, fontWeight: "700" },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 12 },
  gridItem: { width: "47%", borderRadius: 16, padding: 18, alignItems: "center", borderWidth: 1 },
  gridEmoji: { fontSize: 32, marginBottom: 10 },
  gridLabel: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  ctaSection: { paddingHorizontal: 28, paddingVertical: 60, alignItems: "center" },
  ctaTitle: { fontSize: 26, fontWeight: "800", marginBottom: 10, textAlign: "center" },
  ctaSubtitle: { fontSize: 15, textAlign: "center", marginBottom: 24, lineHeight: 22 },
  button: { backgroundColor: "#f59e0b", paddingHorizontal: 48, paddingVertical: 17, borderRadius: 14, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
