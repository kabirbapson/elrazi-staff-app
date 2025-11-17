import { useAuth } from "@/hooks/useAuth";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const { logout } = useAuth();
    return (
        <View>
            <Text>Profile Page</Text>

            <TouchableOpacity
                onPress={() => logout()}
                style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: "#d32f2f",
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                    Logout
                </Text>
            </TouchableOpacity>

        </View>
    );
}
