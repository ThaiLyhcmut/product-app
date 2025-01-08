import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { Product, useCategoryWithPagination } from "../../graphql/product.graphql";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type RootStackParamList = {
  Home: undefined; // Home không có tham số
  ProductTab: { screen: 'ProductDetail'; params: { product: Product } }; // Tham số cho màn hình ProductTab
}

export const HomeScreen = () => {
  const { data, loading, error, fetchMore } = useCategoryWithPagination();
  const offset = 0;
  const limit = 3;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  useEffect(() => {
    fetchMore({ variables: { offset, limit } }); // Initial fetch
  }, []);

  if (loading && offset === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {/* Tiêu đề cho danh sách sản phẩm nổi bật */}
      <Text style={styles.featuredProductsTitle}>Danh sách sản phẩm nổi bật</Text>

      <FlatList
        data={data?.getCategory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            {/* Hình ảnh category */}
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Image
              source={{ uri: item.thumbnail || 'https://via.placeholder.com/400x200' }} // Sử dụng placeholder nếu không có hình ảnh
              style={styles.categoryImage}
            />
            
            {/* Tiêu đề của category */}
            

            {/* Hiển thị sản phẩm trong mỗi category */}
            <FlatList
              data={item.product}
              keyExtractor={(product) => product.id.toString()}
              renderItem={({ item: product }) => (
                <View style={styles.productItem}>
                  <Image
                    source={{ uri: product.thumbnail }}
                    style={styles.productThumbnail}
                  />
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Text style={styles.productDescription}>
                      {product.description}
                    </Text>
                    <Text style={styles.productPrice}>Giá niêm yết: {product.price}</Text>
                    <Text style={styles.productDiscount}>Giảm: {product.discountPercent}%</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      Giá mới: {product.price * (1 - product.discountPercent / 100)}
                    </Text>
                  </View>
                  {/* Thêm nút vào giỏ hàng */}
                  <TouchableOpacity style={styles.seenDetailButton} onPress={() => {
                      navigation.navigate('ProductTab', {
                        screen: 'ProductDetail',  // Điều hướng đến màn hình chi tiết
                        params: { product: product },  // Truyền tham số vào màn hình chi tiết
                      });
                    }}>
                    <Text style={styles.seenDetail}>Chi tiết</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  featuredProductsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 20,
    width: "100%",
  },
  categoryImage: {
    width: "100%",
    height: 200, // Hình chữ nhật
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryTitle: {
    fontWeight: "500",
    color: "#f0768b",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productTextContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "line-through", // Thêm dấu gạch ngang
    color: "#777", // Màu sắc cho giá cũ (có thể điều chỉnh theo ý muốn)
  },
  productDiscount: {
    fontSize: 12,
    color: "green",
    marginBottom: 5,
  },
  seenDetailButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  seenDetail: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
