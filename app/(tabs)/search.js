import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doSearch = async (q) => {
    if (!q.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchBooksByQuery(q); // ✅ ONLY TITLE SEARCH
      setBooks(results);
    } catch (error) {
      console.log("Search error:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIVE SEARCH (TITLE ONLY)
  useEffect(() => {
    const delay = setTimeout(() => {
      doSearch(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

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
          placeholder="Search book titles..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      {/* Loading */}
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
            <Text style={styles.empty}>Type a book title to search...</Text>
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
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#3B5BDB" },

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

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 3,
  },

  author: { fontSize: 12, color: "#888" },

  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3B5BDB",
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 14,
  },
});
