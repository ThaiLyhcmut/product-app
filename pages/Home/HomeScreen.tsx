import { StatusBar } from "expo-status-bar";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { Category } from "../../graphql/product.graphql";


export const HomeScreen = () => {
    // Thực hiện truy vấn với useQuery
    const { loading, error, data } = Category()
    useEffect(() => {
        if (error){
            console.log("Error fetching data: ", error.message)
        }
        if (loading){
            console.log("Loading")
        }
    }, [loading, error, data])
  
    if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
  
    return (
      <View style={styles.container}>
        <FlatList
          data={data.getCategory}
          keyExtractor={(item) => item.id.toString()} // Sử dụng id của từng mục làm key
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.slug}>Slug: {item.slug}</Text>
                <Text style={styles.position}>Position: {item.postion}</Text>
                <Text style={styles.deleted}>
                  Deleted: {item.deleted ? "Yes" : "No"}
                </Text>
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
                        <Text>{product.description}</Text>
                        <Text>Price: {product.price}</Text>
                        <Text>Discount: {product.discountPercent}%</Text>
                        <Text>Stock: {product.stock}</Text>
                        <Text>Status: {product.status}</Text>
                        <Text>Slug: {product.slug}</Text>
                        <Text>Featured: {product.featured ? "Yes" : "No"}</Text>
                        <Text>Position: {product.postion}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
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
      backgroundColor: "#f4f4f4",
      paddingTop: 10,
      paddingHorizontal: 10,
    },
    loadingText: {
      textAlign: "center",
      fontSize: 18,
      color: "#555",
      marginTop: 20,
    },
    errorText: {
      textAlign: "center",
      fontSize: 18,
      color: "red",
      marginTop: 20,
    },
    item: {
      flexDirection: "column",
      padding: 15,
      marginVertical: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    thumbnail: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 15,
    },
    textContainer: {
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 14,
      color: "#777",
      marginBottom: 5,
    },
    status: {
      fontSize: 14,
      color: "#333",
      marginBottom: 5,
    },
    slug: {
      fontSize: 14,
      color: "#333",
      marginBottom: 5,
    },
    position: {
      fontSize: 14,
      color: "#333",
      marginBottom: 5,
    },
    deleted: {
      fontSize: 14,
      color: "#333",
      marginBottom: 15,
    },
    productItem: {
      flexDirection: "row",
      padding: 10,
      marginVertical: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    productThumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 15,
    },
    productTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    productTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
  });