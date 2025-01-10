import React, { useLayoutEffect } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product } from "../../graphql/product.graphql"; // Ensure the path is correct
import { ProductList } from "../../App";
import Entypo from "@expo/vector-icons/Entypo";
import WebView from "react-native-webview";
import RenderHTML from "react-native-render-html";

// Define the types for stack navigation and route
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<ProductList, "ProductDetail">;
type ProductDetailScreenRouteProp = RouteProp<ProductList, "ProductDetail">;

export interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
  product?: Product
}


export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route, navigation }) => {
  const { product } = route.params; // Get product information from route.params
  const { width } = useWindowDimensions();
  // Handle adding product to the cart
  const handleAddToCart = () => {
    // Add product to cart (could be added to state or API call)
    console.log("Product added to cart:", product);
  };

  // Navigate back to the Product list screen
  const handleGoBack = () => {
    navigation.goBack() // This will navigate back to the Product list screen
  };

  // useLayoutEffect(() => {
  //   // Add back button to the header
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
  //         <Text style={styles.buttonText}>
  //           <Entypo name="back" size={24} color="black" />
  //         </Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);


  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
        <View style={styles.productInfo}>
          <Text style={styles.title}>{product.title}</Text>
          {product.discountPercent > 0 ? (
            <View style={styles.priceContainer}>
              <Text style={styles.oldPrice}>${product.price.toFixed(2)}</Text>
              <Text style={styles.newPrice}>
                ${(
                  product.price *
                  (1 - product.discountPercent / 100)
                ).toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          )}
        </View>
      </View>
      <WebView source={{ html: product.description }} style={{ flex: 1 }} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  thumbnail: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: "#777",
    marginVertical: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  oldPrice: {
    fontSize: 18,
    color: "#777",
    textDecorationLine: "line-through", // Gạch ngang
    marginRight: 8,
  },
  newPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e63946", // Màu đỏ nổi bật
  },
  discount: {
    fontSize: 16,
    color: "green",
    marginVertical: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  }
});