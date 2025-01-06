import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLogin, useOtp, useregisterAccount } from "../../graphql/account.graphql";
import { handleLoginSuccess } from "../../store";

export const RegisterScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("")
    const [otp, setOtp] = useState("")
    const [isOtp, setIsOtp] = useState(false)
    const OTP = useOtp()
    const RGT = useregisterAccount()
    const [errorMessage, setErrorMessage] = useState("");
    const handleGetOtp = async () => {
      if (!email){
        setErrorMessage("Vui lòng nhập email và mật khẩu và tên và otp!");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Email không hợp lệ!");
        return;
      }
      try {
        const otpData = await OTP.createOtp(email)
        if (!otpData){
          setErrorMessage("Lấy otp bị lỗi")
          return
        }
        setIsOtp(true)
        setErrorMessage("")
      }catch(e){
        setErrorMessage("Lỗi không xử lý được")
      }
    }
    const handleRegister = async () => {
        setErrorMessage("");  // Clear any previous error message

        // Kiểm tra nếu email và mật khẩu không trống
        if (!email || !password || !fullName || !otp) {
            setErrorMessage("Vui lòng nhập email và mật khẩu và tên và otp!");
            return;
        }

        // Biểu thức chính quy để kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setErrorMessage("Email không hợp lệ!");
            return;
        }
        // Gọi hàm loginAccount từ GraphQL
        try {
            const userData = await RGT.registerAccount(email,fullName,password,otp);
            if (userData) {
                await handleLoginSuccess(userData);
                navigation.navigate("Account")
            }
        } catch (err) {
            setErrorMessage("Đã xảy ra lỗi khi đăng nhập!");
            console.error(err);
        }
    };

    if (OTP.loading || RGT.loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {OTP.error || RGT.error  ? <Text style={styles.errorText}>{OTP.error?.message || RGT.error?.message}</Text> : null}
            <View style={styles.boxLogin}>
                <Text style={styles.title}>Đăng ký</Text>
                <TextInput
                    style={styles.inputEmail}
                    placeholder="Email"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    keyboardType="email-address"
                />
                {isOtp ? 
                <View style={styles.boxnext}>
                  <TextInput
                      style={styles.inputEmail}
                      placeholder="Otp"
                      value={otp}
                      onChangeText={(otp) => setEmail(otp)}
                  />
                  <TextInput
                      style={styles.inputEmail}
                      placeholder="fullName"
                      value={fullName}
                      onChangeText={(fullName) => setEmail(fullName)}
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
                          <Text style={styles.linkText} >Quên mật khẩu?</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                          <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>Đăng nhập</Text>
                      </TouchableOpacity>
                  </View>
                  <Button title="Đăng nhập" color="#0066cc" onPress={handleRegister} />
                </View>:<View>
                <Button title="Lấy OTP" color="#0066cc" onPress={handleGetOtp} />
                </View>}
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
    boxnext: {
      width: "100%",
    }
});
