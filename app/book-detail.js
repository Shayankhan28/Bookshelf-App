import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBookCover } from "../services/bookApi";
import { addToCart, getCart, removeFromCart } from "../utils/storage";

export default function BookDetailScreen() {
  const { book } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (book) {
      const parsed = JSON.parse(book);
      setData(parsed);
      checkIfInCart(parsed.key);
      setLoading(false);
    }
  }, [book]);

  const checkIfInCart = async (bookKey) => {
    const cart = await getCart();
    setInCart(!!cart.find((b) => b.key === bookKey));
  };

  const handleAddToCart = async () => {
    if (inCart) {
      await removeFromCart(data.key);
      setInCart(false);
      Alert.alert("Removed ❌", `"${data.title}" removed from favorites.`);
    } else {
      const added = await addToCart(data);
      if (added) {
        setInCart(true);
        Alert.alert("Saved ✅", `"${data.title}" added to favorites.`);
      } else {
        Alert.alert(
          "Already Saved",
          `"${data.title}" is already in your favorites.`,
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B5BDB" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No book data found</Text>
      </View>
    );
  }

  const coverId = data.cover_id || data.cover_i;
  const author =
    data.authors?.[0]?.name || data.author_name?.[0] || "Unknown Author";
  const year = data.first_publish_year || "N/A";
  const description =
    data.description?.value ||
    data.description ||
    "No description available for this book.";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: getBookCover(coverId, "L") }}
        style={styles.cover}
      />

      <View style={styles.info}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.author}>by {author}</Text>

        {/* Year and Rating */}
        <View style={styles.metaInfo}>
          <View style={styles.yearBox}>
            <Ionicons name="calendar-outline" size={14} color="#888" />
            <Text style={styles.yearText}>{year}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#f5a623" />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.reviews}> (12k reviews)</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>📖 Fiction</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>⭐ Bestseller</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>📚 E-Book</Text>
          </View>
        </View>

        <Text style={styles.descLabel}>About the book</Text>
        <Text style={styles.desc}>{description}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaVal}>304</Text>
            <Text style={styles.metaKey}>PAGES</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaVal}>E-Book</Text>
            <Text style={styles.metaKey}>FORMAT</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaVal}>ENG</Text>
            <Text style={styles.metaKey}>LANGUAGE</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.favBtn, inCart && styles.favBtnActive]}
            onPress={handleAddToCart}
          >
            <Ionicons
              name={inCart ? "heart" : "heart-outline"}
              size={20}
              color={inCart ? "#fff" : "#e74c3c"}
            />
            <Text
              style={[styles.favBtnText, inCart && styles.favBtnTextActive]}
            >
              {inCart ? "Saved to Favorites" : "Save to Favorites"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.readBtn}>
            <Text style={styles.readBtnText}>Start Reading</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF" },
  cover: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
    backgroundColor: "#dde3f8",
  },
  info: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 6,
  },
  author: { fontSize: 15, color: "#888", marginBottom: 12 },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  yearBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  yearText: { fontSize: 13, color: "#888" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 14, color: "#f5a623", fontWeight: "700", marginLeft: 4 },
  reviews: { fontSize: 12, color: "#aaa" },
  tags: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#EEF0FF",
  },
  tagText: { fontSize: 12, color: "#3B5BDB", fontWeight: "600" },
  descLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  desc: { fontSize: 14, color: "#555", lineHeight: 24, marginBottom: 24 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
  },
  metaBox: { alignItems: "center" },
  metaVal: { fontSize: 16, fontWeight: "700", color: "#1a1a2e" },
  metaKey: { fontSize: 11, color: "#aaa", marginTop: 4, letterSpacing: 0.5 },
  btnRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  favBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#e74c3c",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
  },
  favBtnActive: {
    backgroundColor: "#e74c3c",
    borderColor: "#e74c3c",
  },
  favBtnText: { fontSize: 14, fontWeight: "600", color: "#e74c3c" },
  favBtnTextActive: { color: "#fff" },
  readBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B5BDB",
    borderRadius: 14,
    padding: 14,
  },
  readBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
