import gql from "graphql-tag";
export const CREATE_USER = gql`
  mutation($username: String!, $password: String!) {
    createUser(data: { username: $username, password: $password }) {
      token
    }
  }
`;
export const SIGIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signIn(data: { username: $username, password: $password }) {
      token
    }
  }
`;
export const GET_ACTIVE_USER = gql`
  query {
    activeUser {
      id
      username
      createdAt
    }
  }
`;
export const GET_SNAPS = gql`
  query {
    snaps {
      id
      text
      createdAt
      user {
        id
        username
      }
    }
  }
`;
export const CREATE_SNAP = gql`
  mutation($text: String!, $user_id: String!) {
    createSnap(data: { text: $text, user_id: $user_id }) {
      id
      createdAt
      text
      user {
        id
        username
      }
    }
  }
`;
export const USER_CREATED = gql`
  subscription {
    user {
      id
      username
      createdAt
    }
  }
`;
export const SNAP_CREATED = gql`
  subscription($userId: ID) {
    snap(userId: $userId) {
      id
      text
      createdAt
      user {
        id
        username
      }
    }
  }
`;
