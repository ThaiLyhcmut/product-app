import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Account } from './graphql/account.graphql';

const name = "token"


export const handleLoginSuccess = async (data: Account) => {
  const { id, fullName, email, address, avatar, sex, birthday, token, code, msg } = data;

  // Kiểm tra nếu có lỗi từ server
  if (code === "error") {
    console.log(msg || "Đã xảy ra lỗi");
    return false;
  }

  console.log(email, token); // In token ra để kiểm tra

  // Lưu trữ token vào Keychain
  
  await SecureStore.setItemAsync('TOKEN', token); // Hoặc dùng id thay vì email nếu cần
  

  // Lưu trữ các thông tin khác vào AsyncStorage
  await AsyncStorage.setItem('email', email);
  await AsyncStorage.setItem('fullName', fullName);
  await AsyncStorage.setItem('id', id);
  await AsyncStorage.setItem('address', address);
  await AsyncStorage.setItem('avatar', avatar);
  await AsyncStorage.setItem('sex', sex);
  await AsyncStorage.setItem('birthday', birthday);
  return true;
};


export const getToken = async () => {
  const token = await SecureStore.getItemAsync('TOKEN');
  return token;
};

export interface User {
  email: string | null;
  fullName: string | null;
  id: string | null;
  address: string | null;
  avatar: string | null;
  sex: string | null;
  birthday: string | null;
}


export const getUser = async () => {
  const email = await AsyncStorage.getItem('email');
  const fullName = await AsyncStorage.getItem('fullName');
  const id = await AsyncStorage.getItem('id');
  const address = await AsyncStorage.getItem('address');
  const avatar = await AsyncStorage.getItem('avatar');
  const sex = await AsyncStorage.getItem('sex');
  const birthday = await AsyncStorage.getItem('birthday')
  const User = {
    email, fullName, id, address, avatar, sex, birthday
  }
  return User
}


export const deleteUser = async () => {
  await AsyncStorage.clear()
  await SecureStore.deleteItemAsync("TOKEN")
}