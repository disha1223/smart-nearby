import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { Platform } from "react-native";

const API_BASE = Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
await axios.post(`${API_BASE}/api/auth/signup`, formData);      Alert.alert("Success", "Account created. Please login.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)")}>
  <Text style={styles.backButtonText}>← Home</Text>
</TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Sign up to start discovering places around you
      </Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#888",
    marginBottom: 36,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 17,
    borderRadius: 14,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
  alignSelf: "flex-start",
  marginBottom: 20,
},
backButtonText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#888",
},
});