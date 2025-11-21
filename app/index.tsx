import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  // If no user → go to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If logged in → go to tabs or dashboard
  return <Redirect href="/(tabs)" />;
}

