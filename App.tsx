import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from './pages/Home/HomeScreen'
import { ProductScreen } from './pages/Product/ProductScreen';
import { Ionicons } from '@expo/vector-icons';
import { AccountScreen } from './pages/Account/AccountScreen';
import { CartScreen } from './pages/Cart/CartScreent';
import client from './graphql/graphql';
import { ApolloProvider } from '@apollo/client';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#f4511e' }, // Style cho header
            headerTintColor: 'white', // Màu sắc của title
            tabBarActiveTintColor: 'tomato', // Màu sắc của tab khi active
            tabBarInactiveTintColor: 'gray', // Màu sắc của tab khi inactive
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} /> // Icon cho tab
            ),
          }} />
          <Tab.Screen name="Product" component={ProductScreen} options={{
            tabBarLabel: "Product",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} /> // Icon cho tab
            ),
          }} />
          <Tab.Screen name="Cart" component={CartScreen} options={{
            tabBarLabel: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} /> // Icon cho tab
            ),
          }} />
          <Tab.Screen name="Account" component={AccountScreen} options={{
            tabBarLabel: "Account",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} /> // Icon cho tab
            ),
          }} />
          {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        </Tab.Navigator>
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
