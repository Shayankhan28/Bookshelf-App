import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchBooksByQuery, getBookCover } from "../../services/bookApi";

const GENRES = ["All", "Fiction", "Science", "History"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState("All");
  const router = useRouter();

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    const results = await fetchBooksByQuery(q);
    setBooks(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={24} color="#333" />
        <Text style={styles.headerTitle}>BookShelf</Text>
        <Ionicons name="notifications-outline" size={22} color="#3B5BDB" />
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Search titles, authors, or ISBN..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => doSearch(query)}
          returnKeyType="search"
        />
      </View>

      {/* Genre chips */}
      <View style={styles.genres}>
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, activeGenre === g && styles.activeChip]}
            onPress={() => {
              setActiveGenre(g);
              if (g !== "All") doSearch(g);
            }}
          >
            <Text
              style={[styles.chipText, activeGenre === g && { color: "#fff" }]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {books.length > 0 && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsLabel}>TOP RESULTS</Text>
          <Text style={styles.resultsCount}>{books.length} books found</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#3B5BDB" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(_, i) => i.toString()}
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
                source={{ uri: getBookCover(item.cover_i) }}
                style={styles.cover}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.author}>
                  {item.author_name?.[0] || "Unknown"}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#f5a623" />
                  <Text style={styles.rating}>4.8</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                  router.push({
                    pathname: "/book-detail",
                    params: { book: JSON.stringify(item) },
                  })
                }
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Search for a book to see results.</Text>
          }
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
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#3B5BDB" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    elevation: 2,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#222" },
  genres: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
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
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  resultsCount: { fontSize: 12, color: "#aaa" },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  cover: { width: 52, height: 72, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 14, fontWeight: "700", color: "#1a1a2e", marginBottom: 3 },
  author: { fontSize: 12, color: "#888", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, color: "#f5a623", fontWeight: "600", marginLeft: 3 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3B5BDB",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { textAlign: "center", color: "#aaa", marginTop: 40, fontSize: 14 },
});
