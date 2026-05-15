import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebaseConfig";
import { getCart } from "../../utils/storage";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={24} color="#333" />
        <Text style={styles.headerTitle}>BookShelf</Text>
        <Ionicons name="notifications-outline" size={22} color="#3B5BDB" />
      </View>

      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.displayName || user?.email || "U")[0].toUpperCase()}
          </Text>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={20} color="#3B5BDB" />
          </View>
        </View>
      </View>
      <Text style={styles.name}>{user?.displayName || "User"}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{cart.length}</Text>
          <Text style={styles.statLabel}>BOOKS READ</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>IN PROGRESS</Text>
        </View>
      </View>

      {[
        { icon: "heart-outline", label: "My Favorites", color: "#e74c3c" },
        { icon: "time-outline", label: "Reading History", color: "#3B5BDB" },
        { icon: "settings-outline", label: "Settings", color: "#555" },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem}>
          <Ionicons
            name={item.icon}
            size={20}
            color={item.color}
            style={{ marginRight: 14 }}
          />
          <Text style={styles.menuText}>{item.label}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#ccc"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#e74c3c"
          style={{ marginRight: 14 }}
        />
        <Text style={[styles.menuText, { color: "#e74c3c" }]}>Logout</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#ccc"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      <Text style={styles.version}>BOOKSHELF V2.4.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF", paddingTop: 54 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#3B5BDB" },
  avatarBox: { alignItems: "center", marginBottom: 10 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#dde3f8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 38, fontWeight: "bold", color: "#3B5BDB" },
  badge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 4,
  },
  email: { fontSize: 13, color: "#888", textAlign: "center", marginBottom: 20 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 20,
    elevation: 2,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statNum: { fontSize: 22, fontWeight: "bold", color: "#1a1a2e" },
  statLabel: { fontSize: 11, color: "#aaa", marginTop: 2, letterSpacing: 0.5 },
  divider: { width: 1, backgroundColor: "#eee", marginVertical: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
  },
  menuText: { fontSize: 15, color: "#1a1a2e", fontWeight: "500" },
  version: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    marginTop: 16,
    letterSpacing: 1,
  },
});
