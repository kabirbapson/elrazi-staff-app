import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthLogin from "./(auth)/login";

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthCheckWrapper />
    </AuthProvider>
  );
}

// Wrapper for Auth Check (Redirects based on authentication)
function AuthCheckWrapper() {
  const { user, authChecked } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authChecked) {
      if (!user) {
        router.replace("/login"); // Redirect to login if not authenticated
      } else {
        router.replace("/dashboard"); // Redirect to dashboard if authenticated
      }
      setLoading(false);
    }
  }, [authChecked, user, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  // If authenticated, show tabs, else show login screen
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthLogin />}
    </NavigationContainer>
  );
}

// Main Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff' }, // Tab bar style customization
      }}
    >
      {/* Dashboard Tab */}
      <Tab.Screen
        name="dashboard" // This corresponds to the `dashboard.tsx` page
        component={DashboardScreen} // Assuming you have a DashboardScreen component
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="dashboard" color={color} />,
        }}
      />

      {/* Staff Tab */}
      <Tab.Screen
        name="staff" // This corresponds to the `staff.tsx` page
        component={StaffScreen} // Assuming you have a StaffScreen component
        options={{
          title: 'Staff',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="people" color={color} />,
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="profile" // This corresponds to the `profile.tsx` page
        component={ProfileScreen} // Assuming you have a ProfileScreen component
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
