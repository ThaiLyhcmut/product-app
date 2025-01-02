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
