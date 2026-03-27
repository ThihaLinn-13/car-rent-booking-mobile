import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getData = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data:", error);
  }
};
