import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../store'; // Hàm lấy token từ nơi lưu trữ

// Tạo HttpLink để kết nối đến GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://192.168.1.5:8080/query', // Thay thế bằng URL của API GraphQL của bạn
});

// Tạo authLink để thêm token vào headers của mỗi yêu cầu
const authLink = setContext(async (_, { headers }) => {
  try {
    // Lấy token từ nơi lưu trữ (ví dụ localStorage hoặc AsyncStorage)
    const token = await getToken();

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '', // Thêm token vào header Authorization
      },
    };
  } catch (error) {
    console.error('Error retrieving token:', error);
    return {
      headers,
    };
  }
});

// Tạo Apollo Client với authLink và httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Kết hợp authLink và httpLink
  cache: new InMemoryCache(), // Sử dụng bộ nhớ đệm mặc định của Apollo
  // connectToDevTools: true, // Bật công cụ phát triển nếu cần
});

export default client;
