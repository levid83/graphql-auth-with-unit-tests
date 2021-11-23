import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { gql, useMutation } from "@apollo/client";

const signOutMutation = gql`
  mutation signOutUser {
    signOut {
      user {
        id
        email
      }
    }
  }
`;

export const AuthLink = ({ children }) => {
  const [signOutUser] = useMutation(signOutMutation);
  const { isAuthenticated, setAuthInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    setAuthInfo({ userData: undefined });
    navigate("/auth/sign-in");
  };

  return isAuthenticated ? (
    <Link onClick={handleSignOut} to="#">
      Sign Out
    </Link>
  ) : (
    <Link to="/auth/sign-in">{children}</Link>
  );
};
