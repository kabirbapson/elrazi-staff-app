import { useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Image,
    Linking,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const staffDataList = [
    { id: "STF001", name: "Chinedu Okeke", email: "chinedu.okeke@example.com", phone: "08012345601", role: "Lecturer" },
    { id: "STF002", name: "Aisha Bello", email: "aisha.bello@example.com", phone: "08012345602", role: "HOD – ICT" },
    { id: "STF003", name: "Kunle Adeyemi", email: "kunle.adeyemi@example.com", phone: "08012345603", role: "Registrar" },
    { id: "STF004", name: "Fatima Yusuf", email: "fatima.yusuf@example.com", phone: "08012345604", role: "Lecturer" },
    { id: "STF005", name: "Emeka Nwosu", email: "emeka.nwosu@example.com", phone: "08012345605", role: "HOD – Math" },
    { id: "STF006", name: "Hauwa Abubakar", email: "hauwa.abubakar@example.com", phone: "08012345606", role: "Lecturer" },
    { id: "STF007", name: "Segun Adebayo", email: "segun.adebayo@example.com", phone: "08012345607", role: "Lecturer" },
    { id: "STF008", name: "Ngozi Okafor", email: "ngozi.okafor@example.com", phone: "08012345608", role: "HOD – Physics" },
    { id: "STF009", name: "Ibrahim Musa", email: "ibrahim.musa@example.com", phone: "08012345609", role: "Registrar" },
    { id: "STF010", name: "Amaka Chukwu", email: "amaka.chukwu@example.com", phone: "08012345610", role: "Lecturer" },
    { id: "STF011", name: "Olufemi Ade", email: "olufemi.ade@example.com", phone: "08012345611", role: "Lecturer" },
    { id: "STF012", name: "Binta Sule", email: "binta.sule@example.com", phone: "08012345612", role: "HOD – Biology" },
    { id: "STF013", name: "Tunde Balogun", email: "tunde.balogun@example.com", phone: "08012345613", role: "Lecturer" },
    { id: "STF014", name: "Aminat Lawal", email: "aminat.lawal@example.com", phone: "08012345614", role: "Lecturer" },
    { id: "STF015", name: "Chuka Nnamdi", email: "chuka.nnamdi@example.com", phone: "08012345615", role: "Registrar" },
    { id: "STF016", name: "Maryam Abdullahi", email: "maryam.abdullahi@example.com", phone: "08012345616", role: "HOD – Chemistry" },
    { id: "STF017", name: "Abdulrahman Usman", email: "abdulrahman.usman@example.com", phone: "08012345617", role: "Lecturer" },
    { id: "STF018", name: "Ifeyinwa Eze", email: "ifeyinwa.eze@example.com", phone: "08012345618", role: "Lecturer" },
    { id: "STF019", name: "Olaniyi Folarin", email: "olaniyi.folarin@example.com", phone: "08012345619", role: "HOD – English" },
    { id: "STF020", name: "Rahila Ahmed", email: "rahila.ahmed@example.com", phone: "08012345620", role: "Lecturer" },
];

export default function Staff() {
    const [search, setSearch] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const filtered = staffDataList.filter((staff) =>
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.role.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (staff) => {
        setSelectedStaff(staff);
        setModalVisible(true);
    };

    const [staffData, setStaffData] = useState(staffDataList);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate network refresh with a small delay
        setTimeout(() => {
            setStaffData([...staffDataList]); // reset or shuffle data if you like
            setRefreshing(false);
        }, 800);
    };

    const handleCall = (phone) => Linking.openURL(`tel:${phone}`);
    const handleEmail = (email) => Linking.openURL(`mailto:${email}`);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Staff Directory</Text>

            <TextInput
                placeholder="Search staff..."
                style={styles.search}
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.headerRow}>
                <Text style={[styles.headerText, { flex: 1 }]}>Photo</Text>
                <Text style={[styles.headerText, { flex: 2 }]}>Name</Text>
                <Text style={[styles.headerText, { flex: 2 }]}>Role</Text>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <StaffRow item={item} openModal={openModal} style={index % 2 === 0 ? null : styles.rowOdd} />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedStaff && (
                            <>
                                <Image
                                    source={require("../../assets/images/react-logo.png")}
                                    style={styles.modalAvatar}
                                />
                                <Text style={styles.modalName}>{selectedStaff.name}</Text>
                                <Text style={styles.modalRole}>{selectedStaff.role}</Text>

                                <View style={styles.modalInfo}>
                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>{selectedStaff.email}</Text>

                                    <Text style={styles.infoLabel}>Phone:</Text>
                                    <Text style={styles.infoValue}>{selectedStaff.phone}</Text>

                                    <Text style={styles.infoLabel}>Staff ID:</Text>
                                    <Text style={styles.infoValue}>{selectedStaff.id}</Text>
                                </View>

                                <Pressable style={styles.actionBtn} onPress={() => handleCall(selectedStaff.phone)}>
                                    <Text style={styles.actionText}>📞 Call - {selectedStaff.name}</Text>
                                </Pressable>
                                <Pressable style={styles.actionBtn} onPress={() => handleEmail(selectedStaff.email)}>
                                    <Text style={styles.actionText}>✉️ Send Email</Text>
                                </Pressable>
                                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeText}>Close</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function StaffRow({ item, openModal, style }: any) {
    const scale = useRef(new Animated.Value(1)).current;

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start(() => openModal(item));
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable onPress={animatePress} style={[styles.row, style]}>
                <Image source={require("../../assets/images/react-logo.png")} style={styles.avatar} />
                <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{item.role}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center", color: "#1976d2" },
    search: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    headerRow: { flexDirection: "row", backgroundColor: "#1976d2", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, marginBottom: 6 },
    headerText: { fontWeight: "700", fontSize: 12, color: "#fff", textAlign: "left" },
    row: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 10, alignItems: "center", marginBottom: 6, borderRadius: 10, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    rowOdd: { backgroundColor: "#f9f9f9" },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10, flex: 1 },
    cell: { fontSize: 14, paddingHorizontal: 4, color: "#333" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: "#fff", padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalAvatar: { width: 90, height: 90, borderRadius: 45, alignSelf: "center", marginBottom: 12 },
    modalName: { fontSize: 22, fontWeight: "700", textAlign: "center" },
    modalRole: { fontSize: 16, color: "gray", textAlign: "center", marginBottom: 20 },
    modalInfo: { marginVertical: 10 },
    infoLabel: { fontWeight: "700", marginTop: 8 },
    infoValue: { marginLeft: 4 },
    actionBtn: { backgroundColor: "#1976d2", padding: 14, borderRadius: 12, alignItems: "center", marginVertical: 6 },
    actionText: { color: "#fff", fontSize: 16 },
    closeButton: { backgroundColor: "gray", padding: 14, marginTop: 12, borderRadius: 12, alignItems: "center" },
    closeText: { color: "#fff", fontSize: 16 },
});
