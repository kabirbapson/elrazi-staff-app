import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  const { user, authChecked } = useAuth();

//   if (!authChecked) return null; // or splash screen

  if (!authChecked) {
    // Show a loading spinner while auth state is being checked
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Optional: can change based on your design
  },
});