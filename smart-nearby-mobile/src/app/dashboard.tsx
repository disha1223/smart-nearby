import React, { useState, useEffect } from "react";
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
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Linking } from "react-native";

const API_BASE = "http://10.0.2.2:5000";
const HISTORY_KEY = "search_history";
const MAX_HISTORY = 5;

const MOODS = [
  { key: "study", emoji: "📚", label: "Study", sub: "Wifi · Quiet", color: "#667eea", bg: "#e0e4ff", bgDark: "#1e1f3a" },
  { key: "hangout", emoji: "🍔", label: "Hangout", sub: "Cozy · Casual", color: "#ec4899", bg: "#fce7f3", bgDark: "#2d1a26" },
  { key: "quick-bite", emoji: "🍕", label: "Quick Bite", sub: "Fast · Easy", color: "#f59e0b", bg: "#fef3c7", bgDark: "#2d2410" },
  { key: "budget", emoji: "🪙", label: "Budget", sub: "Cheap · Value", color: "#10b981", bg: "#d1fae5", bgDark: "#0d2a1e" },
  { key: "nightlife", emoji: "🎉", label: "Nightlife", sub: "Clubs · Music", color: "#ec4899", bg: "#fdf2f8", bgDark: "#2d1a26" },
  { key: "gaming", emoji: "🎮", label: "Gaming", sub: "Arcade · Fun", color: "#8b5cf6", bg: "#f5f3ff", bgDark: "#1e1a2e" },
  { key: "fitness", emoji: "🏋️", label: "Fitness", sub: "Gym · Active", color: "#06b6d4", bg: "#ecfeff", bgDark: "#0d2530" },
  { key: "rentals", emoji: "🚗", label: "Rentals", sub: "Bikes · Cars", color: "#84cc16", bg: "#f7fee7", bgDark: "#1a2a0d" },
  { key: "hidden-gems", emoji: "💎", label: "Hidden Gems", sub: "Unique · Local", color: "#14b8a6", bg: "#ecfdf5", bgDark: "#0d2a24" },
  { key: "beaches", emoji: "🏖️", label: "Beaches", sub: "Sand · Sun", color: "#0ea5e9", bg: "#e0f2fe", bgDark: "#0d2030" },
  { key: "movies", emoji: "🎬", label: "Movies", sub: "Theatres · Films", color: "#dc2626", bg: "#fee2e2", bgDark: "#2a0d0d" },
];

const LIGHT = {
  bg: "#fafafa",
  header: "#ffffff",
  headerBorder: "#f0f0f0",
  text: "#111",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  card: "#ffffff",
  cardBorder: "#eee",
  actionBtn: "#f5f5f5",
  actionBtnText: "#111",
  historyChip: "#f3f4f6",
  historyChipBorder: "#e5e7eb",
  historyChipText: "#374151",
  historyTitle: "#374151",
  tabBg: "#fff",
  tabBorder: "#f0f0f0",
  tabText: "#999",
  container: "#fafafa",
  imagePlaceholder: "#eee",
};

const DARK = {
  bg: "#0f0f0f",
  header: "#1a1a1a",
  headerBorder: "#2a2a2a",
  text: "#f0f0f0",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  card: "#1e1e1e",
  cardBorder: "#2a2a2a",
  actionBtn: "#2a2a2a",
  actionBtnText: "#f0f0f0",
  historyChip: "#2a2a2a",
  historyChipBorder: "#3a3a3a",
  historyChipText: "#d1d5db",
  historyTitle: "#d1d5db",
  tabBg: "#1a1a1a",
  tabBorder: "#2a2a2a",
  tabText: "#666",
  container: "#0f0f0f",
  imagePlaceholder: "#2a2a2a",
};

export default function Dashboard() {
  const [mood, setMood] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"explore" | "favourites">("explore");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  const T = isDark ? DARK : LIGHT;

  useEffect(() => {
    loadFavourites();
    loadHistory();
  }, []);

  useFocusEffect(useCallback(() => { loadFavourites(); }, []));

  const loadHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) setSearchHistory(JSON.parse(raw));
    } catch (err) { console.log(err); }
  };

  const saveToHistory = async (moodKey: string) => {
    try {
      const moodObj = MOODS.find((m) => m.key === moodKey);
      if (!moodObj) return;
      const label = `${moodObj.emoji} ${moodObj.label}`;
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      let history: string[] = raw ? JSON.parse(raw) : [];
      history = [label, ...history.filter((h) => h !== label)].slice(0, MAX_HISTORY);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      setSearchHistory(history);
    } catch (err) { console.log(err); }
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  };

  const searchPlaces = async (moodKey?: string) => {
    const selectedMood = moodKey || mood;
    if (!selectedMood) return;
    if (moodKey) setMood(moodKey);
    try {
      setLoading(true);
      await saveToHistory(selectedMood);
      const radius = selectedMood === "beaches" ? 15 : 3;
      const url = `${API_BASE}/api/places?mood=${selectedMood}&lat=13.3525&lon=74.7934&radius=${radius}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("PLACE SAMPLE:", JSON.stringify(data.results?.[0]));

      setPlaces(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/user/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setFavourites(data);
      else if (Array.isArray(data.favourites)) setFavourites(data.favourites);
    } catch (err) { console.log(err); }
  };

  const isFav = (place: any) => favourites.some((f) => f.title === place.title);

  const toggleFavorite = async (place: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      if (isFav(place)) {
        setFavourites((prev) => prev.filter((f) => f.title !== place.title));
      } else {
        setFavourites((prev) => [...prev, place]);
      }
      await fetch(`${API_BASE}/api/user/favourites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ place }),
      });
    } catch (err) { console.log(err); }
  };

  const callPlace = (phone: string) => {
    if (!phone) { Alert.alert("No phone number available"); return; }
    Linking.openURL(`tel:${phone}`);
  };

  const openDirections = (lat: number, lon: number) => {
    if (!lat || !lon) { Alert.alert("Location unavailable for this place"); return; }
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`);
  };

  const sharePlace = (item: any) => {
    Share.share({
      message: `📍 ${item.title}\n${item.address}\n\nhttps://maps.google.com/?q=${item.lat},${item.lon}`,
      title: item.title,
    });
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
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  const moodKeyFromLabel = (label: string) => {
    const found = MOODS.find((m) => `${m.emoji} ${m.label}` === label);
    return found?.key || "";
  };

  const PlaceCard = ({ item }: { item: any }) => (
  <TouchableOpacity
    onPress={() => router.push({ pathname: "/Placedetails", params: { place: JSON.stringify(item) } })}
    style={[styles.card, { backgroundColor: T.card, borderColor: T.cardBorder }]}
  >
    {item.image ? (
      <Image source={{ uri: item.image }} style={styles.cardImage} />
    ) : (
      <View style={[styles.cardImage, { backgroundColor: T.imagePlaceholder }]} />
    )}
    <View style={styles.cardContent}>
      <Text style={[styles.placeName, { color: T.text }]}>{item.title}</Text>
      <Text style={[styles.placeType, { color: T.textSecondary }]}>{item.type}</Text>
      <Text style={[styles.placeAddress, { color: T.textSecondary }]}>{item.address}</Text>
      <View style={styles.metaRow}>
        {item.rating > 0 && (
          <Text style={styles.rating}>
            {`⭐ ${item.rating} (${item.reviews ?? 0})`}
          </Text>
        )}
        {item.price_level ? (
          <Text style={styles.price}>{String(item.price_level)}</Text>
        ) : null}
        {item.open_now !== undefined && item.open_now !== null && (
          <Text style={item.open_now ? styles.openNow : styles.closedNow}>
            {item.open_now ? "Open" : "Closed"}
          </Text>
        )}
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => callPlace(item.phone)}>
          <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => openDirections(item.lat, item.lon)}>
          <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>🧭 Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => toggleFavorite(item)}>
          <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>
            {isFav(item) ? "❤️ Saved" : "🤍 Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => sharePlace(item)}>
          <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>📤 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={[styles.wrapper, { backgroundColor: T.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: T.header, borderBottomColor: T.headerBorder }]}>
        <Text style={[styles.logo, { color: T.text }]}>📍 Smart Nearby</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            <Text style={{ fontSize: 22 }}>{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: T.tabBg, borderBottomColor: T.tabBorder }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "explore" && styles.tabActive]}
          onPress={() => setActiveTab("explore")}
        >
          <Text style={[styles.tabText, { color: activeTab === "explore" ? "#667eea" : T.tabText }]}>
            🔍 Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favourites" && styles.tabActive]}
          onPress={() => { setActiveTab("favourites"); loadFavourites(); }}
        >
          <Text style={[styles.tabText, { color: activeTab === "favourites" ? "#667eea" : T.tabText }]}>
            ❤️ Favourites ({favourites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: T.container }]} showsVerticalScrollIndicator={false}>
        {activeTab === "explore" && (
          <>
            <View style={styles.hero}>
              <Text style={[styles.heroTitle, { color: T.text }]}>Discover Spots Made For Right Now</Text>
              <Text style={[styles.heroSubtitle, { color: T.textSecondary }]}>
                Find cafes, restaurants and hangout spots tailored to how you feel.
              </Text>
            </View>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyTitle, { color: T.historyTitle }]}>🕐 Recent Searches</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.historyRow}>
                    {searchHistory.map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.historyChip, { backgroundColor: T.historyChip, borderColor: T.historyChipBorder }]}
                        onPress={() => searchPlaces(moodKeyFromLabel(item))}
                      >
                        <Text style={[styles.historyChipText, { color: T.historyChipText }]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.moodContainer}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  onPress={() => setMood(m.key)}
                  style={[
                    styles.moodCard,
                    {
                      backgroundColor: isDark ? m.bgDark : m.bg,
                      borderColor: mood === m.key ? m.color : "transparent",
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{m.emoji}</Text>
                  <Text style={[styles.moodTitle, { color: T.text }]}>{m.label}</Text>
                  <Text style={[styles.moodSub, { color: T.textSecondary }]}>{m.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.searchBtn} onPress={() => searchPlaces()}>
              <Text style={styles.searchText}>Find Places</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#667eea" style={{ marginBottom: 20 }} />}

            <FlatList
              data={places}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => <PlaceCard item={item} />}
            />
          </>
        )}

        {activeTab === "favourites" && (
          <>
            <Text style={[{ fontSize: 20, fontWeight: "700", marginBottom: 16, color: T.text }]}>Saved Places</Text>
            {favourites.length === 0 && (
              <Text style={{ textAlign: "center", color: T.textMuted, marginTop: 40 }}>
                No favourites yet — start exploring!
              </Text>
            )}
            <FlatList
              data={favourites}
              keyExtractor={(_, i) => i.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: T.card, borderColor: T.cardBorder }]}>
                  {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
                  ) : (
                    <View style={[styles.cardImage, { backgroundColor: T.imagePlaceholder }]} />
                  )}
                  <View style={styles.cardContent}>
                    <Text style={[styles.placeName, { color: T.text }]}>{item.title}</Text>
                    <Text style={[styles.placeType, { color: T.textSecondary }]}>{item.type}</Text>
                    <Text style={[styles.placeAddress, { color: T.textSecondary }]}>{item.address}</Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => callPlace(item.phone)}>
                        <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>📞 Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => openDirections(item.lat, item.lon)}>
                        <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>🧭 Directions</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: T.actionBtn }]} onPress={() => toggleFavorite(item)}>
                        <Text style={[styles.actionBtnText, { color: T.actionBtnText }]}>❤️ Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </>
        )}
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
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  logo: { fontSize: 20, fontWeight: "800" },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
  container: { flex: 1, padding: 20 },
  hero: { marginBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: "700", marginBottom: 10 },
  heroSubtitle: { fontSize: 15, lineHeight: 22 },
  historySection: { marginBottom: 20 },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  historyTitle: { fontSize: 15, fontWeight: "700" },
  clearText: { fontSize: 13, color: "#ef4444", fontWeight: "600" },
  historyRow: { flexDirection: "row", gap: 8 },
  historyChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  historyChipText: { fontSize: 13, fontWeight: "600" },
  moodContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  moodCard: { width: "48%", padding: 16, borderRadius: 20, borderWidth: 2, marginBottom: 12 },
  emoji: { fontSize: 30, marginBottom: 10 },
  moodTitle: { fontSize: 17, fontWeight: "700" },
  moodSub: { marginTop: 4, fontSize: 13 },
  searchBtn: { backgroundColor: "#f59e0b", padding: 18, borderRadius: 18, marginTop: 20, marginBottom: 25 },
  searchText: { color: "white", textAlign: "center", fontWeight: "700", fontSize: 16 },
  card: { borderWidth: 1, marginBottom: 14, borderRadius: 14, overflow: "hidden" },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 14 },
  placeName: { fontWeight: "bold", fontSize: 17, marginBottom: 4 },
  placeType: { marginBottom: 2, fontSize: 14 },
  placeAddress: { fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 10, alignItems: "center", flexWrap: "wrap" },
  rating: { fontSize: 13, fontWeight: "600", color: "#f59e0b" },
  price: { fontSize: 13, color: "#10b981", fontWeight: "600" },
  openNow: { fontSize: 13, color: "#10b981", fontWeight: "600" },
  closedNow: { fontSize: 13, color: "#ef4444", fontWeight: "600" },
  actionRow: { flexDirection: "row", gap: 6, marginTop: 12 },
  actionBtn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  actionBtnText: { fontSize: 11, fontWeight: "700" },
  tabs: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#667eea" },
  tabText: { fontSize: 14, fontWeight: "600" },
});
