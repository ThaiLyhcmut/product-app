import { gql } from "@apollo/client";


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
  mutation LoginAccount {
    loginAccount(account: { email: null, password: null }) {
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