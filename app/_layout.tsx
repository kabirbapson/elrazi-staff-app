import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Text>Hi</Text>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}


// import { useAuth } from "@/hooks/useAuth";
// import { Redirect, Slot } from "expo-router";

// export default function AppLayout() {
//   const { user, authChecked } = useAuth();

//   if (!authChecked) return null; // or splash screen

//   if (!user) return <Redirect href="/login"/>; // not logged in → login

//   return <Slot />; // show protected screens
// }
