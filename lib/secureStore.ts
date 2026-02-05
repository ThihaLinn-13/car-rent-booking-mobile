import * as SecureStore from "expo-secure-store";

export const saveUser = async (user: any) => {
  await SecureStore.setItemAsync("userData", JSON.stringify(user), {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};

export const saveData = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};

export const getData = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const removeData = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
