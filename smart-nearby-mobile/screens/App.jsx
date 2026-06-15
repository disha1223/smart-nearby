import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { MOODS, CITIES, RADIUS_OPTIONS, BUDGET_OPTIONS, SORT_OPTIONS } from "../constants/moodsData";
import { API_BASE_URL } from "../constants/config";
import PlaceCard from "../components/PlaceCard";
import PlaceModal from "../components/PlaceModal";
import styles from "../styles/dashboardStyles";

export default function Dashboard({ navigation }) {
  const [mood, setMood] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [useGPS, setUseGPS] = useState(true);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [radius, setRadius] = useState(3);
  const [budget, setBudget] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [activeTab, setActiveTab] = useState("explore");

  // --- Get GPS location (replaces navigator.geolocation) ---
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setUseGPS(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setGpsLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch {
        setUseGPS(false);
      }
    })();
  }, []);

  // --- Load saved favourites (replaces localStorage) ---
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/user/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setFavourites(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getLocation = () =>
    useGPS && gpsLocation ? gpsLocation : { lat: city.lat, lon: city.lon };

  const handleSearch = async () => {
    if (!mood) return;
    const loc = getLocation();
    setLoading(true);
    setError("");
    setPlaces([]);
    setSearched(true);
    setActiveTab("explore");

    try {
      const params = new URLSearchParams({
        mood,
        lat: loc.lat,
        lon: loc.lon,
        radius,
        ...(budget && { maxPrice: budget }),
      });

      const res = await fetch(`${API_BASE_URL}/api/places?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlaces(data.results || []);
    } catch (err) {
      setError(err.message || "Failed to fetch places");
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = async (place) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const exists = favourites.find((p) => p.title === place.title);

      if (exists) {
        setFavourites((prev) => prev.filter((p) => p.title !== place.title));
        await fetch(`${API_BASE_URL}/api/user/favourite`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: place.title }),
        });
      } else {
        setFavourites((prev) => [...prev, place]);
        await fetch(`${API_BASE_URL}/api/user/favourite`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(place),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFav = (place) => favourites.some((p) => p.title === place.title);

  const filterAndSort = (list) => {
    let result = [...list];

    if (openNow) {
      result = result.filter((p) => p.open_state?.toLowerCase().includes("open"));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
      if (sortBy === "name") return a.title?.localeCompare(b.title);
      return 0;
    });

    return result;
  };

  const displayPlaces = activeTab === "favourites" ? filterAndSort(favourites) : filterAndSort(places);

  const activeLocation =
    useGPS && gpsLocation ? "📡 Using your GPS location" : `📍 ${city.label}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover Spots Made for Right Now</Text>
          <Text style={styles.headerSub}>
            Find cafes, restaurants and hangout spots tailored to how you feel.
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "explore" && styles.tabActive]}
            onPress={() => setActiveTab("explore")}
          >
            <Text style={[styles.tabText, activeTab === "explore" && styles.tabTextActive]}>
              🔍 Explore
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "favourites" && styles.tabActive]}
            onPress={() => setActiveTab("favourites")}
          >
            <Text style={[styles.tabText, activeTab === "favourites" && styles.tabTextActive]}>
              ⭐ Favourites ({favourites.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "explore" && (
          <>
            {/* Location bar */}
            <View style={styles.locationBar}>
              <Text style={styles.locationText}>{activeLocation}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow}>
                {gpsLocation && (
                  <TouchableOpacity
                    style={[styles.cityBtn, useGPS && styles.cityBtnActive]}
                    onPress={() => setUseGPS(true)}
                  >
                    <Text style={[styles.cityBtnText, useGPS && styles.cityBtnTextActive]}>
                      GPS
                    </Text>
                  </TouchableOpacity>
                )}
                {CITIES.map((c) => (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.cityBtn, !useGPS && city.key === c.key && styles.cityBtnActive]}
                    onPress={() => {
                      setCity(c);
                      setUseGPS(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.cityBtnText,
                        !useGPS && city.key === c.key && styles.cityBtnTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Mood grid */}
            <Text style={styles.sectionTitle}>What's your mood?</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.moodBtn,
                    { backgroundColor: m.bg },
                    mood === m.key && { borderColor: m.color },
                  ]}
                  onPress={() => setMood(m.key)}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: m.color }]}>{m.label}</Text>
                  <Text style={styles.moodSub}>{m.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Radius */}
            <Text style={styles.sectionTitle}>Radius</Text>
            <View style={styles.pillRow}>
              {RADIUS_OPTIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.pill, radius === r && styles.pillActive]}
                  onPress={() => setRadius(r)}
                >
                  <Text style={[styles.pillText, radius === r && styles.pillTextActive]}>
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Budget */}
            <Text style={styles.sectionTitle}>Budget</Text>
            <View style={styles.pillRow}>
              {BUDGET_OPTIONS.map((b) => (
                <TouchableOpacity
                  key={b.value}
                  style={[styles.pill, budget === b.value && styles.pillActive]}
                  onPress={() => setBudget(b.value)}
                >
                  <Text style={[styles.pillText, budget === b.value && styles.pillTextActive]}>
                    {b.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Open now toggle */}
            <View style={styles.toggleRow}>
              <Switch value={openNow} onValueChange={setOpenNow} />
              <Text style={styles.toggleLabel}>🕐 Open Now only</Text>
            </View>

            {/* Search button */}
            <TouchableOpacity
              style={[styles.searchBtn, (!mood || loading) && styles.searchBtnDisabled]}
              onPress={handleSearch}
              disabled={!mood || loading}
            >
              <Text style={styles.searchBtnText}>
                {loading ? "Searching..." : "🔍 Find Places Near Me"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Search + sort bar */}
        {(places.length > 0 || activeTab === "favourites") && (
          <>
            <View style={styles.searchBarWrap}>
              <Text style={styles.searchIcon}>🔎</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, type, area..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              {SORT_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.pill, sortBy === s.value && styles.pillActive]}
                  onPress={() => setSortBy(s.value)}
                >
                  <Text style={[styles.pillText, sortBy === s.value && styles.pillTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* States */}
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Finding places for you...</Text>
          </View>
        )}

        {!!error && <Text style={styles.error}>❌ {error}</Text>}

        {searched && !loading && displayPlaces.length === 0 && !error && (
          <Text style={styles.empty}>
            {activeTab === "favourites"
              ? "⭐ No favourites yet — start exploring!"
              : "😕 No places found. Try increasing the radius!"}
          </Text>
        )}

        {/* Results */}
        {displayPlaces.length > 0 && (
          <>
            <Text style={styles.resultsHeader}>
              {activeTab === "favourites"
                ? `⭐ ${displayPlaces.length} saved places`
                : `🎯 ${displayPlaces.length} places found`}
            </Text>
            <View style={styles.resultsGrid}>
              {displayPlaces.map((place, i) => (
                <PlaceCard
                  key={i}
                  place={place}
                  isFav={isFav(place)}
                  onPress={() => setSelectedPlace(place)}
                  onToggleFav={() => toggleFav(place)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Place detail modal */}
      <PlaceModal
        place={selectedPlace}
        visible={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isFav={selectedPlace ? isFav(selectedPlace) : false}
        onToggleFav={() => selectedPlace && toggleFav(selectedPlace)}
      />
    </SafeAreaView>
  );
}