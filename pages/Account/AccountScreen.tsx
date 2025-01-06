import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView, Image, Alert } from "react-native";
import { deleteUser, getToken, getUser, User } from "../../store";
import { LoginScreen } from "../../components/Account/LoginScreen";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Định nghĩa kiểu dữ liệu cho userData

export const AccountScreen = () => {
    
    const [userData, setUserData] = useState<User | null>(null);
    const navigation = useNavigation();
    useEffect(() => {
        const CheckUser = async () => {
            const user = await getUser()
            setUserData(user);
        }
        CheckUser();
    }, [])
    const handleLogout = async () => {
        Alert.alert("Đăng xuất", "Bạn có muốn đăng xuất không?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              await deleteUser(); // Clear user data
              setUserData(null); // Clear user info
              navigation.navigate
            },
          },
        ]);
      };
    return (
        <ScrollView style={styles.container}>
          <StatusBar style="auto" />
          {userData && (
            <View style={styles.profileContainer}>
              {/* Avatar */}
              <Image
                source={{
                    uri: userData.avatar || "https://via.placeholder.com/100",
                  }}
                  style={styles.avatar}
                  resizeMode="cover"
              />
                {/* User Information */}
                <Text style={styles.headerText}>{userData.fullName}</Text>
                <Text style={styles.infoText}>Email: {userData.email}</Text>
                <Text style={styles.infoText}>ID: {userData.id}</Text>
                <Text style={styles.infoText}>Address: {userData.address}</Text>
                <Text style={styles.infoText}>Sex: {userData.sex}</Text>
                <Text style={styles.infoText}>Birthday: {userData.birthday}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6c757d",
      },
      profileContainer: {
        alignItems: "center",
        marginTop: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      },
      avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#6200ee",
      },
      headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
      },
      infoText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
        textAlign: "center",
      },
      logoutButton: {
        marginTop: 20,
        backgroundColor: "#ff5252",
        padding: 12,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
      },
      logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
    });