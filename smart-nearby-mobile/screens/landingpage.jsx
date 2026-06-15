import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7fb" },
  content: { paddingBottom: 40 },

  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: { fontSize: 18, fontWeight: "700", color: "#222" },
  navLinks: { flexDirection: "row", gap: 16 },
  navLink: { fontSize: 14, fontWeight: "600", color: "#667eea" },

  hero: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: "#667eea",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  features: { paddingHorizontal: 20, gap: 16 },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "flex-start",
  },
  featureTitle: { fontSize: 16, fontWeight: "700", color: "#222", marginTop: 12, marginBottom: 6 },
  featureText: { fontSize: 13, color: "#666", marginBottom: 10, lineHeight: 18 },
  featureLink: { fontSize: 13, fontWeight: "700", color: "#667eea" },
});