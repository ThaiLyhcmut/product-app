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


const REGISTER_ACCOUNT = gql`
  mutation RegisterAccount($email: String!, $fullName: String!, $password: String, $otp: String) {
    registerAccount(
        account: { fullName: $fullName, email: $email, password: $password, otp: $otp }
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
  mutation createOtp($email: String!){  
    createOtp(email: $email) {
        code
        msg
    }
}

`

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

export type ResOtp = {
  code: string
  msg: string
}


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


export const useOtp = () => {
  const [otp, {data, loading, error}] = useMutation<{createOtp: ResOtp}>(CREATE_OTP)
  const createOtp = async (email: string) => {
    try{
      const response = await otp({
        variables: { email },
      })
      console.log("Create otp success:", response.data?.createOtp)
      return response.data?.createOtp
    }catch(e){
      console.log("Create otp error:", e)
      return null
    }
  }
  return { createOtp, data, loading, error }
}

export const useregisterAccount = () => {
  const [register, {data,loading, error}] = useMutation<{registerAccount: Account}>(REGISTER_ACCOUNT)
  const registerAccount = async (email: string, fullName: string, password: string, otp: string) => {
    try {
      const response = await register({
        variables: {fullName, email, password, otp}
      })
      console.log("Register success:", response.data?.registerAccount)
      return response.data?.registerAccount
    }catch(e){
      console.log("Create otp error:", e)
      return null
    }
  }
  return {registerAccount, data, loading, error}
}