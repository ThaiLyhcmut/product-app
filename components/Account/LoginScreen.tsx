import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLogin } from "../../graphql/account.graphql";
import { handleLoginSuccess } from "../../store";
import { useNavigation } from "@react-navigation/native";
import { AccountScreen } from "../../pages/Account/AccountScreen";

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginAccount, data, loading, error } =  useLogin()
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation()

    const handleLogin = async () => {
        setErrorMessage("");  // Clear any previous error message

        // Kiểm tra nếu email và mật khẩu không trống
        if (!email || !password) {
            setErrorMessage("Vui lòng nhập email và mật khẩu!");
            return;
        }

        // Gọi hàm loginAccount từ GraphQL
        try {
            const userData = await loginAccount(email, password);
            if (userData) {
                await handleLoginSuccess(userData);
                navigation.goBack();
            }
        } catch (err) {
            setErrorMessage("Đã xảy ra lỗi khi đăng nhập!");
            console.error(err);
        }
    };

    if (loading) {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
    }
    
    if (error) {
    return (
        <View style={styles.errorContainer}>
            <Text>Error: {error.message}</Text>
        </View>
    );
    }
    return (
        <View style={styles.container}>
            <View style={styles.boxLogin}>
                <Text style={styles.title}>Đăng nhập</Text>
                <TextInput
                    style={styles.inputEmail}
                    placeholder="Email"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <View style={styles.noInput}>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Đăng nhập" color="#0066cc" onPress={handleLogin}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2", // Màu nền nhẹ nhàng hơn
        alignItems: "center",
        justifyContent: "center",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
    },
    boxLogin: {
        width: "85%",
        padding: 30,
        borderRadius: 15,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5, // Để thêm bóng cho box
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    inputEmail: {
        width: "100%",
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    inputPassword: {
        width: "100%",
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: "#f9f9f9",
    },
    noInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    linkText: {
        color: "#0066cc", 
        fontSize: 14,
    },
});
