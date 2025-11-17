import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const { user, authChecked, logout } = useAuth();

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/(auth)/login");
    }
  }, [authChecked, user]);

  if (!authChecked || (!user && authChecked)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }


  const admissions = user?.admissions || [];

  const { total, approved, pending, rejected, paidPct, emailVerifiedPct, internationalCount } =
    useMemo(() => {
      const total = admissions.length;
      const approved = admissions.filter((a) => a.status === "APPROVED").length;
      const pending = admissions.filter((a) => a.status === "PENDING").length;
      const rejected = admissions.filter((a) => a.status === "REJECTED").length;
      const paidCount = admissions.filter((a) => a.student.has_paid).length;
      const emailVerifiedCount = admissions.filter((a) => a.student.is_email_verified).length;
      const internationalCount = admissions.filter((a) => a.student_document.is_international).length;

      return {
        total,
        approved,
        pending,
        rejected,
        paidPct: total > 0 ? ((paidCount / total) * 100).toFixed(1) : "0.0",
        emailVerifiedPct: total > 0 ? ((emailVerifiedCount / total) * 100).toFixed(1) : "0.0",
        internationalCount,
      };
    }, [admissions]);

  // Sample chart data
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [2, 4, 3, 5, 1, 6, 3] }],
  };
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [12, 15, 10, 20, 18, 25] }],
  };

  const screenWidth = Dimensions.get("window").width - 40;

  const renderApplication = ({ item }) => (
    <View style={styles.appCard}>
      <Image source={{ uri: item.student_document?.passport_photo }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.appName}>
          {/* {item.student.first_name} {item.student.last_name} */}
          Hello World shh
        </Text>
        <Text style={styles.appCourse}>{item.course.name}</Text>
      </View>
      <Text
        style={[
          styles.status,
          item.status === "APPROVED"
            ? styles.approved
            : item.status === "PENDING"
              ? styles.pending
              : styles.rejected,
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <FlatList
        contentContainerStyle={styles.container}
        data={admissions.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderApplication}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>{`Hello, ${user.first_name} ${user.last_name}`}</Text>
            <Text style={styles.role}>{user.role?.toUpperCase()}</Text>

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Total Applications</Text>
                <Text style={styles.metricCount}>{total}</Text>
                <Text style={styles.metricExtra}>Pending: {pending}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Approved</Text>
                <Text style={styles.metricCount}>{approved}</Text>
                <Text style={styles.metricExtra}>Rejected: {rejected}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Payment Verified</Text>
                <Text style={styles.metricCount}>{paidPct}%</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Email Verified</Text>
                <Text style={styles.metricCount}>{emailVerifiedPct}%</Text>
                <Text style={styles.metricExtra}>Intl: {internationalCount}</Text>
              </View>
            </View>

            {/* Charts */}
            <Text style={styles.chartTitle}>Weekly Admissions Trend</Text>
            <BarChart
              data={weeklyData}
              width={screenWidth}
              height={220}
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              style={{ marginVertical: 8, borderRadius: 8 }}
            />

            <Text style={styles.chartTitle}>Monthly Admissions Trend</Text>
            <LineChart
              data={monthlyData}
              width={screenWidth}
              height={220}
              fromZero
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              bezier
              style={{ marginTop: 8, borderRadius: 8 }}
            />

            <Text style={styles.sectionTitle}>Recent Applications</Text>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: "skyblue" },
  greeting: { fontSize: 28, fontWeight: "700", color: "#222", marginBottom: 4 },
  role: { fontSize: 16, color: "#555", marginBottom: 20 },
  metricsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  metricCard: { width: "48%", backgroundColor: "#1976d2", padding: 15, borderRadius: 12, marginBottom: 10 },
  metricTitle: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  metricCount: { fontSize: 24, fontWeight: "bold", marginVertical: 5, color: "#fff" },
  metricExtra: { fontSize: 12, color: "#e3e7f3" },
  chartTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  appName: { fontSize: 14, fontWeight: "bold" },
  appCourse: { fontSize: 12, color: "#555" },
  status: { fontWeight: "bold" },
  approved: { color: "green" },
  pending: { color: "orange" },
  rejected: { color: "red" },
});
