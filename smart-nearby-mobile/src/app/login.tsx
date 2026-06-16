import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_BASE = Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

const handleLogin = async () => {
  console.log("LOGIN PRESSED, formData:", formData);
  try {
    const res = await axios.post(`${API_BASE}/api/auth/login`, formData);
    console.log("LOGIN SUCCESS:", res.data);

    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("username", res.data.user.username);

    Alert.alert("Success", "Login successful");
    router.push("/dashboard");
  } catch (error: any) {
    console.log("LOGIN ERROR:", error.message);
    console.log("LOGIN ERROR RESPONSE:", error?.response?.data);
    Alert.alert(
      "Login Failed",
      error?.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)")}>
      <Text style={styles.backButtonText}>← Home</Text>
    </TouchableOpacity> 
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Login to continue exploring places around you
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) =>
          setFormData({ ...formData, email: text })
        }
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={formData.password}
        onChangeText={(text) =>
          setFormData({ ...formData, password: text })
        }
      />

     <TouchableOpacity
  style={styles.button}
  onPress={handleLogin}>
    <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>
          Don't have an account? Signup
        </Text>
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