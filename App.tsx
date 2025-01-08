import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { HomeScreen } from './pages/Home/HomeScreen';
import { ProductScreen } from './pages/Product/ProductScreen';
import { Ionicons } from '@expo/vector-icons';
import { AccountScreen } from './pages/Account/AccountScreen';
import { CartScreen } from './pages/Cart/CartScreen';
import { ApolloProvider } from '@apollo/client';
import { LoginScreen } from './pages/Account/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { getToken } from './store';
import client from './graphql/graphql';
import { RegisterScreen } from './pages/Account/RegisterScreen';
import { ProductDetailScreen } from './pages/Product/DetailScreen';
import { Product, useCategoryWithPagination } from './graphql/product.graphql';

const Tab = createBottomTabNavigator();
/* STACK OF HOME */
export type HomeList = {
  Home: undefined
}
const StackHome = createNativeStackNavigator<HomeList>()

// Stack cho Home Tab
export const HomeStack = () => {
  return (
    <StackHome.Navigator screenOptions={{
      headerShown: false
    }}>
      <StackHome.Screen name="Home" component={HomeScreen} />
      {/* Các màn hình con khác của Home */}
    </StackHome.Navigator>
  );
}
/* END STACK OF HOME*/
/*STACK OF PRODUCT*/
export type ProductList = {
  Product: undefined,
  ProductDetail: { product: Product}
}
const StackProduct = createNativeStackNavigator<ProductList>()
// Stack cho Product Tab
export const ProductStack = () => {
  const { data, loading, error, fetchMore, loadMoreProducts } = useCategoryWithPagination();
  let product: Product = {
    id: 0,
      title: "NULL",
      description: "NULL",
      price: 0,
      discountPercent: 0,
      stock: "NULL",
      thumbnail: "NULL",
      featured: false,
      slug: "NULL",
      status: "NULL",
      position: "NULL", // Fixed typo
  }
  if (data){
    product = product = data?.getCategory[0].product[0] 
  }
  return (
    <StackProduct.Navigator initialRouteName='Product' screenOptions={{
      headerShown: false
    }}>
      <StackProduct.Screen name="Product" component={ProductScreen} />
      {/* Các màn hình con khác của Product */}
      <StackProduct.Screen name="ProductDetail" initialParams={{product}} component={ProductDetailScreen} />
    </StackProduct.Navigator>
  );
}
/*END STACK OF PRODUCT */
/*STACK OF CART */
export type CartList = {
  Cart: undefined
}
const StackCart = createNativeStackNavigator<CartList>()
// Stack cho Cart Tab
export const CartStack = () => {
  return (
    <StackCart.Navigator screenOptions={{
      headerShown: false
    }}>
      <StackCart.Screen name="Cart" component={CartScreen} />
      {/* Các màn hình con khác của Cart */}
    </StackCart.Navigator>
  );
}
/*END STACK OF CART*/
/*STACK OF ACCOUNT */
export type AccountList = {
  Account: undefined
  Login: undefined
  Register: undefined
}
const StackAccount = createNativeStackNavigator<AccountList>()
// Stack cho Account Tab
export const AccountStack = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken();
      if (token) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkLoginStatus();
  }, [isLogin])
  console.log(isLogin)
  return (
    <StackAccount.Navigator
      initialRouteName={isLogin?"Account":"Login"}
      screenOptions={{
        headerShown: false
    }}>
      <StackAccount.Screen name="Account" component={AccountScreen} />
      <StackAccount.Screen name="Login" component={LoginScreen}/>
      <StackAccount.Screen name="Register" component={RegisterScreen}/>
    </StackAccount.Navigator>
  );
}

/*END STACK OF ACCOUNT*/
// Tab Navigator
function TabNavigator() {
  
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
        component={AccountStack}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerShown: true,  // Chỉ hiển thị một header chung cho Tab
          headerTitle:"My Account", // Tiêu đề chung cho Tab
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
