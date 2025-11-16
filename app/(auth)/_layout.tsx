import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { user, authChecked } = useAuth();

  console.log({authChecked}, {user})
  if (!authChecked) return null; // or splash screen

  if (user) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
