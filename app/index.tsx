import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const sessionStr = await SecureStore.getItemAsync("session");
      if (!sessionStr) {
        router.replace("/login");
        return;
      }
      const parsed = JSON.parse(sessionStr);
      setSession(parsed);
      setLoading(false);
    };
    loadSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  const { user } = session;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{`Hello, ${user?.first_name} ${user?.last_name}`}</Text>
        <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Patients Today</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/second")}>
            <Text style={styles.menuText}>Go to Second Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/third")}>
            <Text style={styles.menuText}>Go to Third Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: "#d32f2f" }]}
            onPress={async () => {
              await SecureStore.deleteItemAsync("session");
              router.replace("/login");
            }}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f5f7fb",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // fix for Android
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: { fontSize: 28, fontWeight: "700", color: "#222" },
  role: { marginTop: 4, fontSize: 16, color: "#555" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  statCard: { flex: 1, backgroundColor: "#1976d2", padding: 20, borderRadius: 12, marginRight: 12 },
  statNumber: { fontSize: 26, color: "#fff", fontWeight: "bold" },
  statLabel: { color: "#e3e7f3", marginTop: 6 },
  menu: { marginTop: 40 },
  menuButton: { backgroundColor: "#1976d2", paddingVertical: 14, marginBottom: 15, borderRadius: 8 },
  menuText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
