import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.0.2.2:5000";

export default function PlaceDetail() {
  const params = useLocalSearchParams();
  const place = JSON.parse(params.place as string);
    console.log("HOURS:", JSON.stringify(place.hours)); // ✅ add here

  const [saved, setSaved] = useState(false);

  const callPlace = () => {
    if (!place.phone) { Alert.alert("No phone number available"); return; }
    Linking.openURL(`tel:${place.phone}`);
  };

  const openDirections = () => {
    if (!place.lat || !place.lon) { Alert.alert("Location unavailable"); return; }
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`);
  };

  const sharePlace = () => {
    Share.share({
      message: `📍 ${place.title}\n${place.address}\n\nhttps://maps.google.com/?q=${place.lat},${place.lon}`,
      title: place.title,
    });
  };

  const saveFavourite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await fetch(`${API_BASE}/api/user/favourites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ place }),
      });
      setSaved(true);
      Alert.alert("Saved!", `${place.title} added to favourites.`);
    } catch (err) { console.log(err); }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <Text style={styles.starsText}>
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(empty)}
      </Text>
    );
  };

  const reviewCount = place.reviews != null
    ? `(${Number(place.reviews).toLocaleString()} reviews)`
    : "";

  const distanceText = place.distance != null
    ? `${Number(place.distance).toFixed(1)} km away`
    : null;

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />

      {/* Floating Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←  Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>

        {/* Hero Image */}
        {place.image ? (
          <Image source={{ uri: place.image }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Text style={{ fontSize: 56 }}>🏢</Text>
          </View>
        )}

        {/* Main Content Card — overlaps image */}
        <View style={styles.contentCard}>

          {/* Title Row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{place.title ?? ""}</Text>
              <Text style={styles.type}>{place.type ?? ""}</Text>
            </View>
            {place.open_now !== undefined && place.open_now !== null && (
              <View style={[styles.openBadge, { backgroundColor: place.open_now ? "#e6f4ea" : "#fce8e6" }]}>
                <View style={[styles.openDot, { backgroundColor: place.open_now ? "#1e8e3e" : "#d93025" }]} />
                <Text style={[styles.openText, { color: place.open_now ? "#1e8e3e" : "#d93025" }]}>
                  {place.open_now ? "Open Now" : "Closed"}
                </Text>
              </View>
            )}
          </View>

          {/* Rating Row */}
          {place.rating > 0 && (
            <View style={styles.ratingRow}>
              {renderStars(place.rating)}
              <Text style={styles.ratingNum}>{String(place.rating)}</Text>
              {reviewCount ? <Text style={styles.reviewCount}>{reviewCount}</Text> : null}
              {place.price_level ? (
                <View style={styles.pricePill}>
                  <Text style={styles.priceText}>{String(place.price_level)}</Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Quick Action Bar — like Google */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={callPlace}>
              <View style={styles.quickIconCircle}>
                <Text style={styles.quickIcon}>📞</Text>
              </View>
              <Text style={styles.quickLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={openDirections}>
              <View style={[styles.quickIconCircle, { backgroundColor: "#e8f0fe" }]}>
                <Text style={styles.quickIcon}>🧭</Text>
              </View>
              <Text style={styles.quickLabel}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={saveFavourite}>
              <View style={[styles.quickIconCircle, { backgroundColor: saved ? "#fce8e6" : "#f1f3f4" }]}>
                <Text style={styles.quickIcon}>{saved ? "❤️" : "🤍"}</Text>
              </View>
              <Text style={styles.quickLabel}>{saved ? "Saved" : "Save"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={sharePlace}>
              <View style={[styles.quickIconCircle, { backgroundColor: "#e6f4ea" }]}>
                <Text style={styles.quickIcon}>↗️</Text>
              </View>
              <Text style={styles.quickLabel}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Overview Section */}
          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.infoList}>
            {place.address ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoText}>{place.address}</Text>
                </View>
              </View>
            ) : null}

            {place.phone ? (
              <TouchableOpacity style={styles.infoRow} onPress={callPlace}>
                <Text style={styles.infoIcon}>📞</Text>
                <Text style={[styles.infoText, styles.infoLink]}>{place.phone}</Text>
              </TouchableOpacity>
            ) : null}

            {place.city ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🏙️</Text>
                <Text style={styles.infoText}>{String(place.city)}</Text>
              </View>
            ) : null}

            {distanceText ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🚶</Text>
                <Text style={styles.infoText}>{distanceText}</Text>
              </View>
            ) : null}
          </View>

          {/* Mood Tags Section */}
          {Array.isArray(place.mood_tags) && place.mood_tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Best For</Text>
              <View style={styles.tagRow}>
                {place.mood_tags.map((tag: string, i: number) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{String(tag)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Hours placeholder — like Google's Hours section */}
          {/* Hours Section */}
<View style={styles.divider} />
<View style={styles.hoursRow}>
  <Text style={styles.sectionTitle}>Hours</Text>
  {place.open_now !== undefined && place.open_now !== null && (
    <Text style={[styles.openStatus, { color: place.open_now ? "#1e8e3e" : "#d93025" }]}>
      {place.open_now ? "● Open now" : "● Closed now"}
    </Text>
  )}
</View>

{place.hours && Object.keys(place.hours).length > 0 && (
  <View style={styles.hoursTable}>
    {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((day) => {
      const time = place.hours[day];
      if (!time) return null;
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const isToday = today === day;
      return (
        <View key={day} style={[styles.hoursTableRow, isToday && styles.hoursTableRowToday]}>
          <Text style={[styles.hoursDay, isToday && styles.hoursDayToday]}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
          <Text style={[
            styles.hoursTime,
            isToday && styles.hoursDayToday,
            String(time).toLowerCase() === "closed" && styles.hoursClosed
          ]}>
            {String(time)}
          </Text>
        </View>
      );
    })}
  </View>
)}

          <View style={styles.divider} />

          {/* Get Directions CTA — like Google Maps card */}
          <TouchableOpacity style={styles.directionsCta} onPress={openDirections}>
            <View style={styles.directionsCtaLeft}>
              <Text style={styles.directionsCtaIcon}>🗺️</Text>
              <View>
                <Text style={styles.directionsCtaTitle}>Get Directions</Text>
                {distanceText ? (
                  <Text style={styles.directionsCtaSub}>{distanceText}</Text>
                ) : null}
              </View>
            </View>
            <Text style={styles.directionsChevron}>›</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f8f9fa" },

  backBtn: {
    position: "absolute", top: 48, left: 16, zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 24, flexDirection: "row", alignItems: "center",
  },
  backText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  heroImage: { width: "100%", height: 260 },
  heroPlaceholder: { backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center" },

  // White card that slides up over the image
  contentCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 600,
  },

  titleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, gap: 10 },
  title: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 3, lineHeight: 28 },
  type: { fontSize: 14, color: "#6b7280" },

  openBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, marginTop: 2,
  },
  openDot: { width: 7, height: 7, borderRadius: 4 },
  openText: { fontSize: 12, fontWeight: "700" },

  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  starsText: { fontSize: 16, color: "#fbbc04", letterSpacing: 1 },
  ratingNum: { fontSize: 15, fontWeight: "700", color: "#111" },
  reviewCount: { fontSize: 13, color: "#6b7280" },
  pricePill: { backgroundColor: "#e6f4ea", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  priceText: { fontSize: 12, color: "#1e8e3e", fontWeight: "700" },

  // Quick action buttons (Call / Directions / Save / Share)
  quickActions: {
    flexDirection: "row", justifyContent: "space-around",
    marginBottom: 24, paddingVertical: 4,
  },
  quickBtn: { alignItems: "center", gap: 6 },
  quickIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#f1f3f4",
    justifyContent: "center", alignItems: "center",
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontSize: 12, fontWeight: "600", color: "#444" },

  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 18 },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 14 },

  infoList: { gap: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  infoIcon: { fontSize: 18, marginTop: 1, width: 24, textAlign: "center" },
  infoText: { flex: 1, fontSize: 14, color: "#374151", lineHeight: 21 },
  infoLink: { color: "#1a73e8" },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    borderWidth: 1, borderColor: "#dadce0",
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: "#fff",
  },
  tagText: { fontSize: 13, color: "#3c4043", fontWeight: "500", textTransform: "capitalize" },

  hoursRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 0 },
  openStatus: { fontSize: 14, fontWeight: "600" },

  // Directions CTA card
  directionsCta: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#f8f9fa", borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: "#e8eaed",
  },
  directionsCtaLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  directionsCtaIcon: { fontSize: 26 },
  directionsCtaTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 2 },
  directionsCtaSub: { fontSize: 13, color: "#6b7280" },
  directionsChevron: { fontSize: 26, color: "#9aa0a6", fontWeight: "300" },
  hoursTable: { marginTop: 12, gap: 10 },
hoursTableRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
},
hoursTableRowToday: { backgroundColor: "#f0fdf4" },
hoursDay: { fontSize: 14, color: "#374151", fontWeight: "500", width: 100 },
hoursDayToday: { color: "#1e8e3e", fontWeight: "700" },
hoursTime: { fontSize: 14, color: "#374151" },
hoursClosed: { color: "#d93025" },
});