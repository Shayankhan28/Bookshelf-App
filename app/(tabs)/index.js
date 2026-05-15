import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchPopularBooks, getBookCover } from "../../services/bookApi";
import { getUser } from "../../utils/storage";

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getUser().then(setUser);
    fetchPopularBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B5BDB" />
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>BookShelf</Text>
        <View style={styles.headerIcons}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#3B5BDB"
            style={{ marginRight: 14 }}
          />
          <Ionicons
            name="share-social-outline"
            size={22}
            color="#3B5BDB"
            style={{ marginRight: 6 }}
          />
          <Ionicons name="ellipsis-vertical" size={22} color="#333" />
        </View>
      </View>

      {/* Recommended */}
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <FlatList
        data={books.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => "rec-" + (item.key || i)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recCard}
            onPress={() =>
              router.push({
                pathname: "/book-detail",
                params: { book: JSON.stringify(item) },
              })
            }
          >
            <Image
              source={{ uri: getBookCover(item.cover_id) }}
              style={styles.recCover}
            />
            <Text style={styles.recTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.recAuthor} numberOfLines={1}>
              {item.authors?.[0]?.name || "Unknown"}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Popular Books */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Popular Books</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/booklist")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {books.slice(0, 6).map((item, i) => (
        <TouchableOpacity
          key={item.key || i}
          style={styles.row}
          onPress={() =>
            router.push({
              pathname: "/book-detail",
              params: { book: JSON.stringify(item) },
            })
          }
        >
          <Image
            source={{ uri: getBookCover(item.cover_id) }}
            style={styles.rowCover}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.rowAuthor}>
              {item.authors?.[0]?.name || "Unknown"}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#f5a623" />
              <Text style={styles.rating}>4.8</Text>
              <Text style={styles.reviews}> · 12.5k reviews</Text>
            </View>
          </View>
          <Ionicons name="arrow-up-circle-outline" size={22} color="#aaa" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 54,
    paddingBottom: 12,
  },
  headerLeft: {
    width: 30, // Same width as headerIcons for balance
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B5BDB",
    textAlign: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    width: 30, // Fixed width for alignment
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  seeAll: { fontSize: 13, color: "#3B5BDB", fontWeight: "600" },
  recCard: {
    width: 130,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    elevation: 2,
  },
  recCover: { width: 110, height: 150, borderRadius: 10, marginBottom: 8 },
  recTitle: { fontSize: 12, fontWeight: "700", color: "#1a1a2e" },
  recAuthor: { fontSize: 11, color: "#888", marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    elevation: 2,
  },
  rowCover: { width: 52, height: 74, borderRadius: 8, marginRight: 12 },
  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 3,
  },
  rowAuthor: { fontSize: 12, color: "#888", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, color: "#f5a623", fontWeight: "600", marginLeft: 3 },
  reviews: { fontSize: 11, color: "#aaa" },
});
