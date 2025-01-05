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

export const ProductScreen = () => {
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
    const contentHeight = event.nativeEvent.contentSize.height; // Total content height
    const contentOffsetY = event.nativeEvent.contentOffset.y; // Scroll position
    const layoutHeight = event.nativeEvent.layoutMeasurement.height; // Visible area height
    if (contentOffsetY + layoutHeight >= contentHeight - 100 && productLength(selectedCategory) > offset) {
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
          scrollEventThrottle={400}
        >
          {data && 
            data.getCategory
            .filter((category: CategoryType) => category.id === selectedCategory)
            .map((category: CategoryType) => (
              <View key={category.id} style={styles.categoryDetail}>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                {filteredProducts(category.product).map((product: Product) => (
                  <View key={product.id} style={styles.productItem}>
                    <Image
                      source={{ uri: product.thumbnail }}
                      style={styles.productThumbnail}
                    />
                    <View>
                      <Text style={styles.productTitle}>{product.title}</Text>
                      <Text style={styles.productDescription}>
                        {product.description}
                      </Text>
                      <Text style={styles.productPrice}>
                        Price: {product.price}
                      </Text>
                      <Text style={styles.productDiscount}>
                        Discount: {product.discountPercent}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
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
    marginBottom: 20,
  },
  categoryDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  productThumbnail: {
    width: "20%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontSize: 14,
    color: "#333",
  },
  productDiscount: {
    fontSize: 14,
    color: "red",
  },
});