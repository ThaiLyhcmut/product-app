import { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useQuery, gql } from "@apollo/client";

// GraphQL query
const GET_PRODUCTS = gql`
  query GetCategory {
    getCategory {
      deleted
      description
      id
      postion
      slug
      status
      thumbnail
      title
      product {
        description
        discountPercent
        featured
        id
        postion
        price
        slug
        status
        stock
        thubmnail
        thumbnail
        title
      }
    }
  }
`;

// Hàm để lấy dữ liệu
export const Category = () => {
  return useQuery(GET_PRODUCTS);
};

// Define types for the GraphQL data
type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  discountPercent: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  slug: string;
  status: string;
  postion: number;
};

type CategoryType = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
  status: string;
  postion: number;
  deleted: boolean;
  product: Product[];
};

export const ProductScreen = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, loading, error } = Category();

  const handleSearch = () => {
    console.log("Searching for: ", keyword);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.labelProduct}>Chọn loại sản phẩm</Text>
        <ScrollView horizontal style={styles.category}>
          {data.getCategory.map((category: CategoryType) => (
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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.innerSearch}
          placeholder="Tìm kiếm sản phẩm"
          value={keyword}
          onChangeText={setKeyword}
        />
        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>

      {selectedCategory && (
        <ScrollView style={styles.productList}>
          {data.getCategory
            .filter((category: CategoryType) => category.id === selectedCategory)
            .map((category: CategoryType) => (
              <View key={category.id} style={styles.categoryDetail}>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                {category.product.map((product: Product) => (
                    
                    <View key={product.id} style={styles.productItem}>
                      <Image
                        source={{ uri: product.thumbnail }}
                        style={styles.productThumbnail}
                      />
                      <Text style={styles.productTitle}>{product.title}</Text>
                      <Text style={styles.productDescription}>{product.description}</Text>
                      <Text style={styles.productPrice}>Price: {product.price}</Text>
                      <Text style={styles.productDiscount}>Discount: {product.discountPercent}%</Text>
                    </View>
                ))}
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  labelProduct: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  categoryContainer: {
    width: "100%",
    marginBottom: 15,
  },
  category: {
    flexDirection: "row",
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    marginRight: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCategoryItem: {
    backgroundColor: "#ff6347",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  innerSearch: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    fontSize: 16,
  },
  productList: {
    width: "100%",
  },
  categoryDetail: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  categoryDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  productItem: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#ff6347",
    fontWeight: "700",
    marginVertical: 5,
  },
  productDiscount: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
});

export default ProductScreen;
