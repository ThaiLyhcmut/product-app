import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Account } from './graphql/account.graphql';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import { cartReducer } from './reducers/cartReducer';

// Lưu trữ thông tin người dùng và token sau khi đăng nhập thành công
export const handleLoginSuccess = async (data: Account) => {
  const { id, fullName, email, address, phone, avatar, sex, birthday, token, code, msg } = data;

  // Kiểm tra nếu có lỗi từ server
  if (code === "error") {
    console.log(msg || "Đã xảy ra lỗi");
    return false;
  }

  // Lưu trữ token vào Keychain
  await SecureStore.setItemAsync('TOKEN', token);

  // Lưu trữ các thông tin người dùng vào AsyncStorage
  await AsyncStorage.multiSet([
    ['email', email],
    ['fullName', fullName],
    ['id', JSON.stringify(id)],
    ['address', address || ''],
    ['avatar', avatar || ''],
    ['sex', sex],
    ['birthday', birthday || ''],
    ['phone', phone || '']
  ]);

  console.log("User information saved successfully.");
  return true;
};

// Lấy token từ SecureStore
export const getToken = async () => {
  const token = await SecureStore.getItemAsync('TOKEN');
  return token;
};

// Định nghĩa interface User
export interface User {
  email: string | null;
  fullName: string | null;
  id: number | null;
  address: string | null;
  avatar: string | null;
  sex: string | null;
  birthday: string | null;
  phone: string | null;
}

// Lấy thông tin người dùng từ AsyncStorage
export const getUser = async (): Promise<User | null> => {
  try {
    const values = await AsyncStorage.multiGet([
      'email', 'fullName', 'id', 'address', 'avatar', 'sex', 'birthday', 'phone'
    ]);

    const user = values.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string | null>);

    // Kiểm tra xem người dùng có đủ thông tin không
    if (user.email && user.fullName && user.id) {
      return {
        email: user.email,
        fullName: user.fullName,
        id: parseInt(user.id || '0'), // Chuyển id thành kiểu number
        address: user.address || '',
        avatar: user.avatar || '',
        sex: user.sex || '',
        birthday: user.birthday || '',
        phone: user.phone || ''
      } as User;
    }

    return null; // Nếu thiếu thông tin, trả về null
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};

// Xóa thông tin người dùng và token
export const deleteUser = async () => {
  await AsyncStorage.clear();
  await SecureStore.deleteItemAsync("TOKEN");
  console.log("User data deleted successfully.");
};

// store.js - Redux Persist cho giỏ hàng
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
