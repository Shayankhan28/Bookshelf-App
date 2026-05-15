import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCart = async () => {
  try {
    const data = await AsyncStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToCart = async (book) => {
  const cart = await getCart();
  if (cart.find((b) => b.key === book.key)) return false;
  await AsyncStorage.setItem("cart", JSON.stringify([...cart, book]));
  return true;
};

export const removeFromCart = async (bookKey) => {
  const cart = await getCart();
  await AsyncStorage.setItem(
    "cart",
    JSON.stringify(cart.filter((b) => b.key !== bookKey)),
  );
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const removeUser = async () => {
  await AsyncStorage.removeItem("user");
};

export const getAllUsers = async () => {
  try {
    const data = await AsyncStorage.getItem("all_users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const registerUser = async (user) => {
  const users = await getAllUsers();
  if (users.find((u) => u.email === user.email)) return false;
  await AsyncStorage.setItem("all_users", JSON.stringify([...users, user]));
  return true;
};
