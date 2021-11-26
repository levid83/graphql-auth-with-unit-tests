import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { gql, useMutation } from "@apollo/client";

export const signOutMutation = gql`
  mutation signOutUser {
    signOut {
      user {
        id
        email
      }
    }
  }
`;

export const AuthLink = ({ children, to }) => {
  const [signOutUser, { error }] = useMutation(signOutMutation, {
    onError: () => {},
  });
  const { isAuthenticated, setAuthInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    setAuthInfo({ userData: undefined });
    navigate("/auth/sign-in");
  };

  return isAuthenticated ? (
    <Link onClick={handleSignOut} to="#">
      {error ? "Click again to signout" : "Sign Out"}
    </Link>
  ) : (
    <Link to={to}>{children}</Link>
  );
};
