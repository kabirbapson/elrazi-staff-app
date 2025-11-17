import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

// Sample complaints data
const complaintsData = [
  {
    id: "CMP001",
    date: "2025-11-10",
    subject: "Login issue",
    status: "Pending",
    priority: "High",
    message: "I cannot login to my account. Keeps saying invalid credentials.",
    chat: [
      { from: "support", message: "Have you tried resetting your password?" },
      { from: "user", message: "Yes, but still not working." },
    ],
  },
  {
    id: "CMP002",
    date: "2025-11-12",
    subject: "Payment not reflected",
    status: "Resolved",
    priority: "Medium",
    message: "I made a payment but my account balance hasn't updated.",
    chat: [
      { from: "support", message: "We checked your transaction; balance is updated now." },
    ],
  },
  {
    id: "CMP003",
    date: "2025-11-13",
    subject: "App crashes",
    status: "Pending",
    priority: "High",
    message: "The app crashes every time I try to upload a file.",
    chat: [],
  },
  // add more as needed
];

export default function SupportComplaints() {
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // Filtering complaints
  const filtered = complaintsData.filter((cmp) => {
    const matchesSearch =
      cmp.subject.toLowerCase().includes(search.toLowerCase()) ||
      cmp.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || cmp.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || cmp.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Here you can fetch new data from server if needed
      setRefreshing(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support / Complaints</Text>

      {/* Search & Filters */}
      <TextInput
        placeholder="Search by subject or message..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        <View style={styles.pickerContainer}>
          <Text>Status:</Text>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Resolved" value="Resolved" />
            <Picker.Item label="Escalated" value="Escalated" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text>Priority:</Text>
          <Picker
            selectedValue={priorityFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setPriorityFilter(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { flex: 2 }]}>Date</Text>
        <Text style={[styles.headerText, { flex: 3 }]}>Subject</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Status</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Priority</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Action</Text>
      </View>

      {/* Table */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.row, index % 2 === 0 ? null : styles.rowOdd]}
            onPress={() => openModal(item)}
          >
            <Text style={[styles.cell, { flex: 2 }]}>{item.date}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{item.subject}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.status}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.priority}</Text>
            <Text style={[styles.cell, { flex: 2, color: "#1976d2" }]}>View</Text>
          </Pressable>
        )}
      />

      {/* Modal for complaint details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />
            {selectedComplaint && (
              <ScrollView>
                <Text style={styles.modalSubject}>{selectedComplaint.subject}</Text>
                <Text style={styles.modalLabel}>Date: <Text style={styles.modalValue}>{selectedComplaint.date}</Text></Text>
                <Text style={styles.modalLabel}>Status: <Text style={styles.modalValue}>{selectedComplaint.status}</Text></Text>
                <Text style={styles.modalLabel}>Priority: <Text style={styles.modalValue}>{selectedComplaint.priority}</Text></Text>
                <Text style={styles.modalLabel}>Message:</Text>
                <Text style={styles.modalValue}>{selectedComplaint.message}</Text>

                <Text style={[styles.modalLabel, { marginTop: 12 }]}>Chat / Replies:</Text>
                {selectedComplaint.chat.length === 0 && <Text style={styles.modalValue}>No replies yet.</Text>}
                {selectedComplaint.chat.map((c, i) => (
                  <View key={i} style={styles.chatBubble}>
                    <Text style={{ fontWeight: "700" }}>{c.from}:</Text>
                    <Text>{c.message}</Text>
                  </View>
                ))}

                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center", color: "#1976d2" },
  search: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 8, fontSize: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  filters: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  pickerContainer: { flex: 1, marginHorizontal: 4 },
  picker: { height: 40, width: "100%" },

  headerRow: { flexDirection: "row", backgroundColor: "#1976d2", paddingVertical: 12, paddingHorizontal: 6, borderRadius: 10, marginBottom: 4 },
  headerText: { fontWeight: "700", fontSize: 12, color: "#fff" },
  row: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 6, alignItems: "center", borderRadius: 8, backgroundColor: "#fff", marginBottom: 4 },
  rowOdd: { backgroundColor: "#f9f9f9" },
  cell: { fontSize: 14, paddingHorizontal: 4 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "80%" },
  dragHandle: { width: 50, height: 5, backgroundColor: "#ccc", borderRadius: 3, alignSelf: "center", marginBottom: 12 },
  modalSubject: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  modalLabel: { fontWeight: "700", marginTop: 8 },
  modalValue: { fontWeight: "400" },
  chatBubble: { padding: 8, backgroundColor: "#f2f2f2", borderRadius: 8, marginTop: 4 },

  closeButton: { backgroundColor: "#1976d2", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 16 },
  closeText: { color: "#fff", fontWeight: "700" },
});
