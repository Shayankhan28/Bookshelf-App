import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    fetchBooksByQuery,
    fetchPopularBooks,
    getBookCover,
} from "../../services/bookApi";

const GENRES = ["All", "Fiction", "Science", "Philosophy"];

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");
  const router = useRouter();

  useEffect(() => {
    fetchPopularBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleGenre = async (g) => {
    setActiveGenre(g);
    setLoading(true);
    if (g === "All") {
      fetchPopularBooks()
        .then(setBooks)
        .finally(() => setLoading(false));
    } else {
      fetchBooksByQuery(g)
        .then(setBooks)
        .finally(() => setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Books</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="search-outline"
            size={22}
            color="#333"
            style={{ marginRight: 14 }}
          />
          <Ionicons name="options-outline" size={22} color="#333" />
        </View>
      </View>

      {/* Genre chips */}
      <View style={styles.genres}>
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, activeGenre === g && styles.activeChip]}
            onPress={() => handleGenre(g)}
          >
            <Text
              style={[styles.chipText, activeGenre === g && { color: "#fff" }]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B5BDB" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, i) => item.key || i.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: "/book-detail",
                  params: { book: JSON.stringify(item) },
                })
              }
            >
              <Image
                source={{ uri: getBookCover(item.cover_id || item.cover_i) }}
                style={styles.cover}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.author}>
                  {item.authors?.[0]?.name ||
                    item.author_name?.[0] ||
                    "Unknown"}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#f5a623" />
                  <Text style={styles.rating}>4.8</Text>
                </View>
              </View>
              <Ionicons name="bookmark-outline" size={20} color="#3B5BDB" />
            </TouchableOpacity>
          )}
        />
      )}
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
    marginBottom: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1a1a2e" },
  genres: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dde1f0",
  },
  activeChip: { backgroundColor: "#3B5BDB", borderColor: "#3B5BDB" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#555" },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  cover: { width: 60, height: 85, borderRadius: 8, marginRight: 14 },
  title: { fontSize: 15, fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
  author: { fontSize: 13, color: "#888", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, color: "#f5a623", fontWeight: "600", marginLeft: 3 },
});
