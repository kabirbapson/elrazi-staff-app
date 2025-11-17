import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
// Sample student data
const studentsList = [
    { id: "STD001", fullName: "Chinonso Okeke", regNo: "REG2023001", email: "chinonso.okeke@example.com", phone: "08020000001", course: "Computer Science", year: 1, level: "100" },
    { id: "STD002", fullName: "Aisha Mohammed", regNo: "REG2023002", email: "aisha.mohammed@example.com", phone: "08020000002", course: "Computer Science", year: 2, level: "200" },
    { id: "STD003", fullName: "Emeka Nwosu", regNo: "REG2023003", email: "emeka.nwosu@example.com", phone: "08020000003", course: "Medicine", year: 1, level: "100" },
    { id: "STD004", fullName: "Ngozi Eze", regNo: "REG2023004", email: "ngozi.eze@example.com", phone: "08020000004", course: "Medicine", year: 2, level: "200" },
    { id: "STD005", fullName: "Tunde Balogun", regNo: "REG2023005", email: "tunde.balogun@example.com", phone: "08020000005", course: "Pharmacy", year: 1, level: "100" },
    { id: "STD006", fullName: "Fatima Yusuf", regNo: "REG2023006", email: "fatima.yusuf@example.com", phone: "08020000006", course: "Pharmacy", year: 2, level: "200" },
    { id: "STD007", fullName: "Maryam Abdullahi", regNo: "REG2023007", email: "maryam.abdullahi@example.com", phone: "08020000007", course: "Nursing", year: 1, level: "100" },
    { id: "STD008", fullName: "Abdulrahman Usman", regNo: "REG2023008", email: "abdulrahman.usman@example.com", phone: "08020000008", course: "Nursing", year: 2, level: "200" },
    { id: "STD009", fullName: "Rahila Ahmed", regNo: "REG2023009", email: "rahila.ahmed@example.com", phone: "08020000009", course: "Computer Science", year: 3, level: "300" },
    { id: "STD010", fullName: "Ifeyinwa Eze", regNo: "REG2023010", email: "ifeyinwa.eze@example.com", phone: "08020000010", course: "Medicine", year: 3, level: "300" },
    // Add more students...
];

export default function Students() {
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [courseFilter, setCourseFilter] = useState("All");
    const [yearFilter, setYearFilter] = useState("All");

    const openModal = (student) => {
        setSelectedStudent(student);
        setModalVisible(true);
    };

    const filtered = studentsList.filter((student) => {
        const matchesSearch = student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                              student.regNo.toLowerCase().includes(search.toLowerCase());
        const matchesCourse = courseFilter === "All" || student.course === courseFilter;
        const matchesYear = yearFilter === "All" || student.level === yearFilter;
        return matchesSearch && matchesCourse && matchesYear;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Directory</Text>

            <TextInput
                placeholder="Search by name or registration number..."
                style={styles.search}
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.filters}>
                <View style={styles.filterBox}>
                    <Text>Course:</Text>
                    <Picker selectedValue={courseFilter} onValueChange={setCourseFilter} style={styles.picker}>
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="Computer Science" value="Computer Science" />
                        <Picker.Item label="Medicine" value="Medicine" />
                        <Picker.Item label="Pharmacy" value="Pharmacy" />
                        <Picker.Item label="Nursing" value="Nursing" />
                    </Picker>
                </View>
                <View style={styles.filterBox}>
                    <Text>Level:</Text>
                    <Picker selectedValue={yearFilter} onValueChange={setYearFilter} style={styles.picker}>
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="100" value="100" />
                        <Picker.Item label="200" value="200" />
                        <Picker.Item label="300" value="300" />
                        <Picker.Item label="400" value="400" />
                    </Picker>
                </View>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <StudentRow item={item} openModal={openModal} style={index % 2 === 0 ? null : styles.rowOdd} />
                )}
            />

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Drag Handle */}
                        <View style={styles.modalHeader}>
                            <View style={styles.dragHandle} />
                            <Text style={styles.modalHeaderTitle}>Student Details</Text>
                        </View>
                        {selectedStudent && (
                            <>
                                <Image
                                    source={require("../../assets/images/react-logo.png")}
                                    style={styles.modalAvatar}
                                />
                                <Text style={styles.modalName}>{selectedStudent.fullName}</Text>
                                <Text style={styles.modalRole}>{selectedStudent.course} - Level {selectedStudent.level}</Text>

                                <View style={styles.modalInfo}>
                                    <Text style={styles.infoLabel}>Registration No:</Text>
                                    <Text style={styles.infoValue}>{selectedStudent.regNo}</Text>

                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>{selectedStudent.email}</Text>

                                    <Text style={styles.infoLabel}>Phone:</Text>
                                    <Text style={styles.infoValue}>{selectedStudent.phone}</Text>
                                </View>

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

function StudentRow({ item, openModal, style }: any) {
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
                <Text style={[styles.cell, { flex: 2 }]}>{item.fullName}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{item.regNo}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center", color: "#1976d2" },
    search: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    filters: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    filterBox: { flex: 1, marginHorizontal: 5 },
    picker: { backgroundColor: "#fff", borderRadius: 8 },
    headerRow: { flexDirection: "row", backgroundColor: "#1976d2", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, marginBottom: 6 },
    headerText: { fontWeight: "700", fontSize: 12, color: "#fff", textAlign: "left" },
    row: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 10, alignItems: "center", marginBottom: 6, borderRadius: 10, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    rowOdd: { backgroundColor: "#f9f9f9" },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10, flex: 1 },
    cell: { fontSize: 14, paddingHorizontal: 4, color: "#333" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: "#fff", padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalHeader: { alignItems: "center", marginBottom: 10 },
    dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#ccc", marginBottom: 6 },
    modalHeaderTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
    modalAvatar: { width: 90, height: 90, borderRadius: 45, alignSelf: "center", marginBottom: 12 },
    modalName: { fontSize: 22, fontWeight: "700", textAlign: "center" },
    modalRole: { fontSize: 16, color: "gray", textAlign: "center", marginBottom: 20 },
    modalInfo: { marginVertical: 10 },
    infoLabel: { fontWeight: "700", marginTop: 8 },
    infoValue: { marginLeft: 4 },
    closeButton: { backgroundColor: "gray", padding: 14, marginTop: 12, borderRadius: 12, alignItems: "center" },
    closeText: { color: "#fff", fontSize: 16 },
});
