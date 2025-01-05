import { useLazyQuery, gql } from "@apollo/client";

const GET_CATEGORY_WITH_PAGINATION = gql`
  query GetCategory($offset: Int, $limit: Int) {
    getCategory {
      id
      title
      description
      thumbnail
      status
      position
      deleted
      slug
      product(ProductInput: { offset: $offset, limit: $limit }) {
        id
        title
        description
        thumbnail
        price
        discountPercent
        stock
        status
        position
        slug
        featured
      }
    }
  }
`;

export type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  discountPercent: string;
  stock: string;
  thumbnail: string;
  featured: boolean;
  slug: string;
  status: string;
  position: string; // Fixed typo
};

export type CategoryType = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
  status: string;
  position: string; // Fixed typo
  deleted: boolean;
  product: Product[];
};

export const useCategoryWithPagination = () => {
  const [fetchMore, { data, loading, error, fetchMore: loadMoreData }] =
    useLazyQuery<{ getCategory: CategoryType[] }>(GET_CATEGORY_WITH_PAGINATION); // Add type for query result

  // Function to load more products
  const loadMoreProducts = async (offset: number = 0, limit: number = 5) => {
    try {
      await loadMoreData({
        variables: { offset, limit },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            getCategory: prevResult.getCategory.map((category, index) => ({
              ...category,
              product: [
                ...category.product,
                ...(fetchMoreResult.getCategory[index]?.product || []), // Safely handle undefined or null
              ],
            })),
          };
        },
      });
    } catch (err) {
      console.error("Error loading more products:", err);
    }
  };

  return { data, loading, error, fetchMore, loadMoreProducts };
};
