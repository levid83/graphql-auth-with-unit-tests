import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

import Layout from "./Layout";
import Form from "./Form";

const signInMutation = gql`
  mutation signInUser($email: String!, $password: String!) {
    signIn(credentials: { email: $email, password: $password }) {
      user {
        id
        email
        role
      }
    }
  }
`;

function SignIn() {
  const [signInUser] = useMutation(signInMutation);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);

  const onSubmit = async (values) => {
    try {
      const {
        data: { signIn },
      } = await signInUser({ variables: values });
      authContext.setAuthInfo({ userData: signIn.user });
      navigate("/");
    } catch (error) {
      console.log("error", error);
      setError(error.message);
    }
  };
  return (
    <Layout>
      <span>
        <h1 className="h3 mb-3 font-weight-normal">Sign In</h1>
        <h6>
          Need an account? <Link to={`/auth/sign-up`}>Sign Up</Link>
        </h6>
      </span>
      <Form onSubmit={onSubmit}>Sign in</Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
}

export default SignIn;
