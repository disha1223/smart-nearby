import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const MOODS = [
  { key: "study", emoji: "📚", label: "Study", sub: "Wifi · Quiet", color: "#667eea", bg: "#e0e4ff" },
  { key: "hangout", emoji: "🍔", label: "Hangout", sub: "Cozy · Casual", color: "#ec4899", bg: "#fce7f3" },
  { key: "quick-bite", emoji: "🍕", label: "Quick Bite", sub: "Fast · Easy", color: "#f59e0b", bg: "#fef3c7" },
  { key: "budget", emoji: "🪙", label: "Budget", sub: "Cheap · Value", color: "#10b981", bg: "#d1fae5" },
  { key: "nightlife", emoji: "🎉", label: "Nightlife", sub: "Clubs · Music", color: "#ec4899", bg: "#fdf2f8" },
  { key: "gaming", emoji: "🎮", label: "Gaming", sub: "Arcade · Fun", color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "fitness", emoji: "🏋️", label: "Fitness", sub: "Gym · Active", color: "#06b6d4", bg: "#ecfeff" },
  { key: "rentals", emoji: "🚗", label: "Rentals", sub: "Bikes · Cars", color: "#84cc16", bg: "#f7fee7" },
];

export default function Dashboard() {
  const [mood, setMood] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async () => {
    if (!mood) return;

    try {
      setLoading(true);
      const url = `http://10.0.2.2:5000/api/places?mood=${mood}&lat=13.3525&lon=74.7934&radius=3`;
      const res = await fetch(url);
      const data = await res.json();
      setPlaces(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("username");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Smart Nearby</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover Spots Made For Right Now</Text>
          <Text style={styles.heroSubtitle}>
            Find cafes, restaurants and hangout spots tailored to how you feel.
          </Text>
        </View>

        <View style={styles.moodContainer}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMood(m.key)}
              style={[
                styles.moodCard,
                {
                  backgroundColor: m.bg,
                  borderColor: mood === m.key ? m.color : "transparent",
                },
              ]}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text style={styles.moodTitle}>{m.label}</Text>
              <Text style={styles.moodSub}>{m.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={searchPlaces}>
          <Text style={styles.searchText}>Find Places</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" style={{ marginBottom: 20 }} />}

        <FlatList
          data={places}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.placeName}>{item.title}</Text>
                <Text style={styles.placeType}>{item.type}</Text>
                <Text style={styles.placeAddress}>{item.address}</Text>
                <View style={styles.metaRow}>
                  {item.rating > 0 && (
                    <Text style={styles.rating}>⭐ {item.rating} ({item.reviews})</Text>
                  )}
                  {item.price_level && (
                    <Text style={styles.price}>{item.price_level}</Text>
                  )}
                  {item.open_now !== undefined && (
                    <Text style={item.open_now ? styles.openNow : styles.closedNow}>
                      {item.open_now ? "Open" : "Closed"}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logo: { fontSize: 20, fontWeight: "800", color: "#111" },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
  container: { flex: 1, padding: 20 },
  hero: { marginBottom: 25 },
  heroTitle: { fontSize: 32, fontWeight: "700", marginBottom: 10 },
  heroSubtitle: { fontSize: 16, color: "#6b7280", lineHeight: 24 },
  moodContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  moodCard: { width: "48%", padding: 16, borderRadius: 20, borderWidth: 2, marginBottom: 12 },
  emoji: { fontSize: 30, marginBottom: 10 },
  moodTitle: { fontSize: 17, fontWeight: "700" },
  moodSub: { color: "#6b7280", marginTop: 4 },
  searchBtn: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 25,
  },
  searchText: { color: "white", textAlign: "center", fontWeight: "700" },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardImage: { width: "100%", height: 150, backgroundColor: "#eee" },
  cardImagePlaceholder: { justifyContent: "center", alignItems: "center" },
  cardContent: { padding: 14 },
  placeName: { fontWeight: "bold", fontSize: 17, marginBottom: 4 },
  placeType: { color: "#6b7280", marginBottom: 2 },
  placeAddress: { color: "#6b7280", fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  rating: { fontSize: 13, fontWeight: "600" },
  price: { fontSize: 13, color: "#10b981", fontWeight: "600" },
  openNow: { fontSize: 13, color: "#10b981", fontWeight: "600" },
  closedNow: { fontSize: 13, color: "#ef4444", fontWeight: "600" },
});