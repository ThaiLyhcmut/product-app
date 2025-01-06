import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { HomeScreen } from './pages/Home/HomeScreen';
import { ProductScreen } from './pages/Product/ProductScreen';
import { Ionicons } from '@expo/vector-icons';
import { AccountScreen } from './pages/Account/AccountScreen';
import { CartScreen } from './pages/Cart/CartScreent';
import { ApolloProvider } from '@apollo/client';
import { LoginScreen } from './components/Account/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { getToken } from './store';
import client from './graphql/graphql';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack cho Home Tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Các màn hình con khác của Home */}
    </Stack.Navigator>
  );
}

// Stack cho Product Tab
function ProductStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Product" component={ProductScreen} />
      {/* Các màn hình con khác của Product */}
    </Stack.Navigator>
  );
}

// Stack cho Cart Tab
function CartStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      {/* Các màn hình con khác của Cart */}
    </Stack.Navigator>
  );
}

// Stack cho Account Tab
function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      {/* Các màn hình con khác của Account */}
    </Stack.Navigator>
  );
}

// Tab Navigator
function TabNavigator() {
  const [isLogin, setIsLogin] = useState(false);
  const checkLoginStatus = async () => {
    const token = await getToken();
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  checkLoginStatus();
  console.log(isLogin)
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: 'white',
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerShown: true,  // Chỉ hiển thị một header chung cho Tab
          headerTitle: "Home", // Tiêu đề chung cho Tab
        }}
      />
      <Tab.Screen
        name="ProductTab"
        component={ProductStack}
        options={{
          tabBarLabel: "Product",
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
          headerShown: true,  // Chỉ hiển thị một header chung cho Tab
          headerTitle: "Products", // Tiêu đề chung cho Tab
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
          headerShown: true,  // Chỉ hiển thị một header chung cho Tab
          headerTitle: "Shopping Cart", // Tiêu đề chung cho Tab
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={isLogin ? AccountStack : LoginScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerShown: true,  // Chỉ hiển thị một header chung cho Tab
          headerTitle: isLogin ? "My Account" : "Login", // Tiêu đề chung cho Tab
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
