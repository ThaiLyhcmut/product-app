import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../store';

// Tạo HttpLink để kết nối đến GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://192.168.1.5:8080/query', // Thay thế bằng URL của API GraphQL
});

// Tạo link để thêm token vào headers của mỗi yêu cầu
const authLink = setContext(async (_, { headers }) => {
  // Lấy token từ nơi bạn lưu trữ (ví dụ localStorage hoặc AsyncStorage trong React Native)
  const token = await getToken() // Thay đổi theo cách bạn lưu trữ token

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '', // Thêm token vào header Authorization
    },
  };
});

// Tạo Apollo Client với authLink và httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
