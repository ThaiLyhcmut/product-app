import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product } from "../../graphql/product.graphql"; // Đảm bảo đường dẫn đúng
import { ProductList } from "../../App";

// Định nghĩa kiểu cho các tham số của stack

// Kiểu cho navigation và route
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<ProductList, "ProductDetail">;
type ProductDetailScreenRouteProp = RouteProp<ProductList, "ProductDetail">;

export interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route, navigation }) => {
  const { product } = route.params; // Lấy thông tin sản phẩm từ route.params

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    // Thực hiện thêm sản phẩm vào giỏ hàng (có thể là thêm vào state hoặc gọi API)
    console.log("Product added to cart:", product);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>${product.price}</Text>
      {product.discountPercent > 0 && (
        <Text style={styles.discount}>
          Discount: {product.discountPercent}% OFF
        </Text>
      )}
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
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
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  discount: {
    fontSize: 16,
    color: "green",
    marginVertical: 8,
  },
});

