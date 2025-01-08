import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Image, Alert, Modal, TextInput, Button } from "react-native";
import { deleteUser, getUser, handleLoginSuccess, User } from "../../store";
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUpdateAccount } from "../../graphql/account.graphql";




// Định nghĩa kiểu dữ liệu cho userData

export const AccountScreen = ({ navigation }: any) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false); // State for modal visibility
  const [editData, setEditData] = useState({
    fullName: "",
    address: "",
    phone: "",
    avatar: "",
    sex: "",
    birthday: "",
  });
  const { updateAccount, data, loading, error } = useUpdateAccount()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  useEffect(() => {
    const CheckUser = async () => {
      const user = await getUser()
      setUserData(user);
      setEditData({
        fullName: user.fullName || "",
        address: user.address || "",
        sex: user.sex || "",
        birthday: user.birthday || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
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
          navigation.navigate("Login")
        },
      },
    ]);
  };
  const handleSaveChanges = async () => {
    if (userData) {
      const updatedUser = { ...userData, ...editData };
      console.log("1", updatedUser)
      try {
        const userNew = await updateAccount(updatedUser.fullName, updatedUser.address, updatedUser.avatar, updatedUser.phone, updatedUser.sex, updatedUser.birthday)
        if (userNew) {
          console.log("2",userNew)
          const check = await handleLoginSuccess(userNew)
          setUserData(updatedUser);
        }
      } catch (e) {
        console.log(e)
      }
    }
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      {userData && (
        <View style={styles.profileContainer}>
          {/* Avatar */}
          <TouchableOpacity style={{ width: "100%" }}>
            <Text style={styles.linkText} onPress={() => setEditModalVisible(true)}><Feather style={{ textAlign: "right" }} name="edit" size={24} color="black" /></Text>
          </TouchableOpacity>
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
          <Text style={styles.infoText}>Phone: {userData.phone}</Text>
          <Text style={styles.infoText}>Address: {userData.address}</Text>
          <Text style={styles.infoText}>Sex: {userData.sex}</Text>
          <Text style={styles.infoText}>Birthday: {moment(userData.birthday).format('DD/MM/YYYY')}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Edit Modal */}
      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            {/* Full Name */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editData.fullName}
              onChangeText={(text) =>
                setEditData((prev) => ({ ...prev, fullName: text }))
              }
            />
            {/* Address */}
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={editData.address}
              onChangeText={(text) =>
                setEditData((prev) => ({ ...prev, address: text }))
              }
            />
            {/* Sex */}
            <Picker
              selectedValue={editData.sex}
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, sex: value }))
              }
              style={styles.picker}
            >
              <Picker.Item label="Nam" value="Nam" />
              <Picker.Item label="Nữ" value="Nữ" />
              <Picker.Item label="Khác" value="Khác" />
            </Picker>
            {/* Birthday */}
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                numberOfLines={1}
                editable={false}
                placeholder="Choose Your Date of Birth"
                value={moment(editData.birthday).format('DD/MM/YYYY')}
                style={{
                  fontSize: 16,
                  paddingVertical: 10,
                  color: 'black',
                }}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                maximumDate={new Date(moment().add(-1, 'days').toISOString())}
                mode="date"
                onChange={date => {
                  console.log(date)
                  // Chuyển đổi ngày sang định dạng 'YYYY-MM-DD'
                  const formattedDate = moment(date).format('YYYY-MM-DD');
                  setEditData((prev) => ({ ...prev, birthday: formattedDate }));
                }}
                onConfirm={(date) => {
                  // Chuyển đổi ngày sang định dạng 'YYYY-MM-DD'
                  const formattedDate = moment(date).format('YYYY-MM-DD');
                  setEditData((prev) => ({ ...prev, birthday: formattedDate }));
                  hideDatePicker();
                }}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <Button title="Save" onPress={handleSaveChanges} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  linkText: {
    color: "#0066cc",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});