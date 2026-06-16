import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      
      {/* Header */}
<View style={styles.header}>
  <Text style={styles.logo}>Smart Nearby</Text>
  <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/login")}>
    <Text style={styles.headerLink}>Sign Up</Text>
  </TouchableOpacity>
</View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} decelerationRate={0.998}  overScrollMode="never"
  bounces={true}>
       
   {/* Hero */}
<View style={styles.hero}>
  <View style={styles.heroBadge}>
    <Text style={styles.heroBadgeText}>✨ Find spots that match your mood</Text>
  </View>

  <Text style={styles.heroTitle}>
    Find the right place, for how you feel right now.
  </Text>
  <Text style={styles.heroSubtitle}>
    From quiet cafes to buzzing nightlife — discover spots near you
    that precisely align with your mood.
  </Text>

  <View style={styles.searchBox}>
    <TextInput
      placeholder="Enter your location"
      style={styles.searchInput}
      placeholderTextColor="#999"
    />
    <TouchableOpacity
      style={styles.searchButton}
       activeOpacity={0.8}
      onPress={() => router.push("/login")}
    >
      <Text style={styles.searchButtonText}>Explore</Text>
    </TouchableOpacity>
  </View>
</View>
        {/* Section label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>How it works</Text>
          <Text style={styles.sectionTitle}>Less searching, more doing.</Text>
        </View>

        {/* Feature 1 */}
        <View style={[styles.feature, { backgroundColor: "#e0e4ff" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#667eea" }]}>
            <Text style={styles.featureEmoji}>🎯</Text>
          </View>
          <Text style={styles.featureTitle}>Pick your mood</Text>
          <Text style={styles.featureText}>
            Need to focus, grab a quick bite, or hang out with friends? Tell us
            your vibe and we'll filter out everything that doesn't fit.
          </Text>
        </View>

        {/* Feature 2 */}
        <View style={[styles.feature, { backgroundColor: "#fef3c7" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#f59e0b" }]}>
            <Text style={styles.featureEmoji}>📍</Text>
          </View>
          <Text style={styles.featureTitle}>See what's nearby</Text>
          <Text style={styles.featureText}>
            Real places, real ratings, real directions — all based on where
            you actually are right now.
          </Text>
        </View>

        {/* Feature 3 */}
        <View style={[styles.feature, { backgroundColor: "#fce7f3" }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: "#ec4899" }]}>
            <Text style={styles.featureEmoji}>⭐</Text>
          </View>
          <Text style={styles.featureTitle}>Save your favorites</Text>
          <Text style={styles.featureText}>
            Bookmark places you love and revisit them anytime, anywhere.
          </Text>
        </View>

        {/* What you get */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What you get</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#d1fae5" }]}>
            <Text style={styles.tableEmoji}>🎯</Text>
            <View style={styles.tableTextWrap}>
              <Text style={styles.tableFeature}>Mood Matching</Text>
              <Text style={styles.tableBenefit}>
                Only see places that fit what you're looking for
              </Text>
            </View>
          </View>

          <View style={[styles.tableRow, { backgroundColor: "#ecfeff" }]}>
            <Text style={styles.tableEmoji}>📡</Text>
            <View style={styles.tableTextWrap}>
              <Text style={styles.tableFeature}>Live Locations</Text>
              <Text style={styles.tableBenefit}>
                Always up to date with real places nearby
              </Text>
            </View>
          </View>

          <View style={[styles.tableRow, { backgroundColor: "#f5f3ff" }]}>
            <Text style={styles.tableEmoji}>⭐</Text>
            <View style={styles.tableTextWrap}>
              <Text style={styles.tableFeature}>Ratings & Reviews</Text>
              <Text style={styles.tableBenefit}>
                Know before you go — no more surprises
              </Text>
            </View>
          </View>
        </View>

        {/* Testimonial */}
        <View style={styles.testimonial}>
          <Text style={styles.testimonialQuote}>
            "I used to spend forever scrolling trying to find a quiet cafe to
            study. Now I just pick 'Study' and I'm there in five minutes."
          </Text>
          <Text style={styles.testimonialAuthor}>— Disha, Manipal</Text>
        </View>
        {/* Testimonials */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionLabel}>What people say</Text>
  <Text style={styles.sectionTitle}>Loved by people on the go</Text>
</View>

<View style={[styles.testimonial, { backgroundColor: "#fef3c7" }]}>
  <Text style={styles.testimonialQuote}>
    "I used to spend forever scrolling trying to find a quiet cafe to
    study. Now I just pick 'Study' and I'm there in five minutes."
  </Text>
  <Text style={styles.testimonialAuthor}>— Disha, Manipal</Text>
</View>

<View style={[styles.testimonial, { backgroundColor: "#fce7f3" }]}>
  <Text style={styles.testimonialQuote}>
    "Found the best rooftop bar for our friend's birthday in minutes.
    The nightlife filter is a lifesaver on weekends."
  </Text>
  <Text style={styles.testimonialAuthor}>— Aroha, Udupi</Text>
</View>

<View style={[styles.testimonial, { backgroundColor: "#d1fae5" }]}>
  <Text style={styles.testimonialQuote}>
    "Ratings and 'open now' status saved me from showing up to a closed
    gym twice. Such a small thing but so useful."
  </Text>
  <Text style={styles.testimonialAuthor}>— Rohan, Manipal</Text>
</View>

<View style={[styles.testimonial, { backgroundColor: "#e0e4ff" }]}>
  <Text style={styles.testimonialQuote}>
    "As a student, the budget filter helps me find good food without
    blowing my monthly allowance."
  </Text>
  <Text style={styles.testimonialAuthor}>— Rashmi, MIT Manipal</Text>
</View>
{/* Full Feature List */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionLabel}>Everything in one app</Text>
  <Text style={styles.sectionTitle}>Built for how you explore</Text>
</View>

<View style={styles.featureGrid}>
  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>🎯</Text>
    <Text style={styles.gridLabel}>Mood-based search</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>📍</Text>
    <Text style={styles.gridLabel}>Location-aware results</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>⭐</Text>
    <Text style={styles.gridLabel}>Ratings & reviews</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>💰</Text>
    <Text style={styles.gridLabel}>Price level info</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>🕒</Text>
    <Text style={styles.gridLabel}>Open now status</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>🖼️</Text>
    <Text style={styles.gridLabel}>Photos of places</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>🔐</Text>
    <Text style={styles.gridLabel}>Secure login</Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridEmoji}>🚀</Text>
    <Text style={styles.gridLabel}>Fast & simple UI</Text>
  </View>
</View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to find your spot?</Text>
          <Text style={styles.ctaSubtitle}>
            Join Smart Nearby and start exploring places made for how you feel.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 24,
  paddingTop: 60,
  paddingBottom: 16,
  backgroundColor: "#ffffff",
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
  zIndex: 10,
  },
  logo: {
    fontSize: 20,
  fontWeight: "800",
  color: "#111",
  lineHeight: 24,
  },
  headerButton: {
  borderWidth: 1.5,
  borderColor: "#f59e0b",
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 6
 
  },
  headerLink: {
   fontSize: 14,
  fontWeight: "600",
  color: "#f59e0b",
  lineHeight: 18,
  },
  container: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 50,
  },
  heroBadge: {
 alignSelf: "flex-start",
  backgroundColor: "#fffbeb",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  marginBottom: 24,
  },
heroBadgeText: {
  fontSize: 13,
  fontWeight: "700",
  color: "#b45309",
},
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
      letterSpacing: -0.5,
      lineHeight: 38,
    marginBottom: 14,
  },
  heroSubtitle: {
  fontSize: 16,
  color: "#333333",
  lineHeight: 26,
  marginBottom: 28,
  },
  searchBox: {
    flexDirection: "row",
    gap: 10,
  },
  searchInput: {
flex: 1,
  borderWidth: 1,
  borderColor: "#e0e0e0",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 15,
  backgroundColor: "#fff",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,

  },
  searchButton: {
     backgroundColor: "#f59e0b",
  borderRadius: 12,
  paddingHorizontal: 22,
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f59e0b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  
  feature: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  featureIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 30,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },
  featureText: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
  table: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  tableEmoji: {
    fontSize: 28,
  },
  tableTextWrap: {
    flex: 1,
  },
  tableFeature: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  tableBenefit: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  testimonial: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 20,
    padding: 28,
    backgroundColor: "#fef3c7",
  },
  testimonialQuote: {
    fontSize: 17,
    fontStyle: "italic",
    color: "#78350f",
    lineHeight: 26,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#b45309",
  },
  ctaSection: {
    paddingHorizontal: 28,
    paddingVertical: 60,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 48,
    paddingVertical: 17,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  featureGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 20,
  gap: 12,
},
gridItem: {
  width: "47%",
  backgroundColor: "#fafafa",
  borderRadius: 16,
  padding: 18,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#f0f0f0",
},
gridEmoji: {
  fontSize: 32,
  marginBottom: 10,
},
gridLabel: {
  fontSize: 14,
  fontWeight: "700",
  color: "#111",
  textAlign: "center",
},
});