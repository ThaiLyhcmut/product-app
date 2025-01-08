import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Account } from './graphql/account.graphql';

const name = "token"


export const handleLoginSuccess = async (data: Account) => {
  const { id, fullName, email, address,phone,  avatar, sex, birthday, token, code, msg } = data;

  // Kiểm tra nếu có lỗi từ server
  if (code === "error") {
    console.log(msg || "Đã xảy ra lỗi");
    return false;
  }
  // Lưu trữ token vào Keychain
  
  await SecureStore.setItemAsync('TOKEN', token); // Hoặc dùng id thay vì email nếu cần
  console.log(birthday)

  // Lưu trữ các thông tin khác vào AsyncStorage
  await AsyncStorage.setItem('email', email);
  await AsyncStorage.setItem('fullName', fullName);
  await AsyncStorage.setItem('id', JSON.stringify(id));
  await AsyncStorage.setItem('address', address || "");
  await AsyncStorage.setItem('avatar', avatar || "");
  await AsyncStorage.setItem('sex', sex);
  await AsyncStorage.setItem('birthday', birthday || "");
  await AsyncStorage.setItem('phone', phone || "")
  return true;
};


export const getToken = async () => {
  const token = await SecureStore.getItemAsync('TOKEN');
  return token;
};

export interface User {
  email: string | null;
  fullName: string | null;
  id: number | null;
  address: string | null;
  avatar: string | null;
  sex: string | null;
  birthday: string | null;
  phone: string | null
}


export const getUser = async () => {
  const email = await AsyncStorage.getItem('email');
  const fullName = await AsyncStorage.getItem('fullName');
  const idData = await AsyncStorage.getItem('id');
  var id: number|null
  if (idData != null){
    id = parseInt(idData)
  }
  else id = null
  const address = await AsyncStorage.getItem('address');
  const avatar = await AsyncStorage.getItem('avatar');
  const sex = await AsyncStorage.getItem('sex');
  const birthday = await AsyncStorage.getItem('birthday')
  const phone = await AsyncStorage.getItem('phone')
  const User = {
    email, fullName, id, address, avatar, sex, birthday, phone
  }
  return User
}


export const deleteUser = async () => {
  await AsyncStorage.clear()
  await SecureStore.deleteItemAsync("TOKEN")
}