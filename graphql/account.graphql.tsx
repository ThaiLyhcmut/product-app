import { gql, useMutation } from "@apollo/client";


const GET_ACCOUNT = gql`
  query GetAccount {
    getAccount {
        id
        fullName
        email
        address
        phone
        avatar
        sex
        birthday
        token
        code
        msg
    }
}
`

const LOGIN_ACCOUNT = gql`
  mutation LoginAccount($email: String!, $password: String!) {
    loginAccount(account: { email: $email, password: $password }) {
      id
      fullName
      email
      address
      phone
      avatar
      sex
      birthday
      token
      code
      msg
    }
  }
`;

export type Account = {
  id: string,
  fullName: string,
  email: string,
  address: string,
  phone: string,
  avatar: string,
  sex: string,
  birthday: string,
  token: string,
  code: string,
  msg: string
}

const REGISTER_ACCOUNT = gql`
  mutation RegisterAccount {
    registerAccount(
        account: { fullName: null, email: null, password: null, otp: null }
    ) {
        id
        fullName
        email
        address
        phone
        avatar
        sex
        birthday
        token
        code
        msg
    }
  }
`

const UPDATE_ACCOUNT = gql`
mutation UpdateAccount {
    updateAccount(
        account: {
            fullName: null
            address: null
            phone: null
            avatar: null
            sex: null
            birthday: null
        }
    ) {
        id
        fullName
        email
        address
        phone
        avatar
        sex
        birthday
        token
        code
        msg
    }
}
`

const CREATE_OTP = gql`
  mutation CreateOtp {
    createOtp(email: null) {
        code
        msg
    }
}

`


export const useLogin = () => {
  const [login, { data, loading, error }] = useMutation<{loginAccount:Account}>(LOGIN_ACCOUNT);

  const loginAccount = async (email: string, password: string) => {
    try {
      const response = await login({
        variables: { email, password },
      });
      // Handle successful login
      console.log('Login successful:', response.data?.loginAccount);
      return response.data?.loginAccount;
    } catch (err) {
      // Handle error
      console.error('Login error:', err);
      return null;
    }
  };

  return { loginAccount, data, loading, error };
};