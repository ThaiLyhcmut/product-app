import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { CategoryType, Product, useCategoryWithPagination } from "../../graphql/product.graphql";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProductList } from "../../App";
import { RouteProp } from "@react-navigation/native";

type ProductScreenNavigationProp = NativeStackNavigationProp<ProductList, "Product">;
type ProductScreenRouteProp = RouteProp<ProductList, "Product">;

interface ProductScreenProps {
  navigation: ProductScreenNavigationProp;
  route: ProductScreenRouteProp;
}

export const ProductScreen: React.FC<ProductScreenProps> = ({ route, navigation }) => {
  const { data, loading, error, fetchMore, loadMoreProducts } = useCategoryWithPagination();
  const [offset, setOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const limit = 5; // Number of items to fetch per page
  const productLength = (CategoryID: string | null) => {
    if (data && CategoryID) {
      const product = data.getCategory.map((category: CategoryType) => category.id == CategoryID)
      return product.length
    }
    return 0;
  }
  useEffect(() => {
    fetchMore({ variables: { offset, limit } }); // Initial fetch
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      const newOffset = offset + limit;
      console.log(newOffset)
      setOffset(newOffset);
      loadMoreProducts(newOffset, limit);
    }
  };

  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height; // Tổng chiều cao của nội dung
    const contentOffsetY = event.nativeEvent.contentOffset.y; // Vị trí cuộn hiện tại
    const layoutHeight = event.nativeEvent.layoutMeasurement.height; // Chiều cao của khu vực hiển thị

    // Kiểm tra nếu cuộn đến gần giữa nội dung
    if (contentOffsetY + layoutHeight / 2 >= contentHeight / 2 && productLength(selectedCategory) > offset) {
      handleLoadMore();
    }
  };
  const handleSearch = () => {
    // Search logic can be adjusted based on API support or local filtering
    console.log(`Searching for: ${keyword}`);
  };

  if (loading && offset === 0) {
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

  const filteredProducts = (products: Product[]) => {
    return keyword
      ? products.filter((product) =>
        product.title.toLowerCase().includes(keyword.toLowerCase())
      )
      : products;
  };

  const handleAddToCart = (product: Product) => {
    navigation.navigate('ProductDetail', {product: product})
  }

  return (
    <View style={styles.container}>
      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.labelProduct}>Chọn loại sản phẩm</Text>
        <ScrollView horizontal style={styles.category}>
          {data &&
            data.getCategory.map((category: CategoryType) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategoryItem,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryText}>{category.title}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.innerSearch}
          placeholder="Tìm kiếm sản phẩm"
          value={keyword}
          onChangeText={setKeyword}
        />
        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>

      {/* Product List */}
      {selectedCategory && (
        <ScrollView
          style={styles.productList}
          onScroll={handleScroll}
          scrollEventThrottle={50}

        >
          {data &&
            data.getCategory
              .filter((category: CategoryType) => category.id === selectedCategory)
              .map((category: CategoryType) => (
                <View key={category.id} style={styles.categoryDetail}>
                  <Text style={styles.categoryDescription}>{category.description}</Text>

                  {filteredProducts(category.product).map((product: Product) => (
                    <View key={product.id} style={styles.productItem}>
                      <Image
                        source={{ uri: product.thumbnail || 'https://via.placeholder.com/400x200' }}
                        style={styles.productThumbnail}
                      />

                      <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>{product.title}</Text>
                        <Text style={styles.productPrice}>Giá niêm yết: {product.price}</Text>
                        <Text style={styles.productDiscount}>Giảm giá: {product.discountPercent}%</Text>
                        <Text style={{fontWeight: "bold", color: "#e63946"}}>Giá mới: {product.price*(1 - product.discountPercent/100)}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                          <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => handleAddToCart(product)}  // Gọi logic thêm vào giỏ hàng
                          >
                            <Text style={styles.addToCartText}>Thêm</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.seenDetailButton}
                            onPress={() => handleAddToCart(product)}  // Gọi logic thêm vào giỏ hàng
                          >
                            <Text style={styles.addToCartText}>Chi tiết</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))
          }


        </ScrollView>
      )}
    </View>
  );
};
// Styles
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    marginBottom: 10,
  },
  labelProduct: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    marginVertical: 10,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    borderRadius: 5,
  },
  selectedCategoryItem: {
    backgroundColor: "#87ceeb",
  },
  categoryText: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  innerSearch: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  productList: {
    flex: 1,
  },
  categoryDetail: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textDecorationLine: 'line-through',  // Thêm dấu gạch ngang
    color: '#777',  // Màu sắc cho giá cũ (có thể điều chỉnh theo ý muốn)
  },
  productDiscount: {
    fontSize: 12,
    color: 'green',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginRight: 10
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  seenDetailButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  seenDetail: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});