import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

import Layout from "./Layout";
import Form from "./Form";

const signUpMutation = gql`
  mutation signUpUser($email: String!, $password: String!) {
    signUp(credentials: { email: $email, password: $password }) {
      user {
        id
        email
        role
      }
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();

  const [signUpUser] = useMutation(signUpMutation);
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);

  const onSubmit = async (values) => {
    try {
      const {
        data: { signUp },
      } = await signUpUser({ variables: values });
      authContext.setAuthInfo({ userData: signUp.user });
      navigate("/");
    } catch (error) {
      console.log("error", error);
      setError(error.message);
    }
  };

  return (
    <Layout>
      <span>
        <h1 className="h3 mb-3 font-weight-normal">Sign Up</h1>
        <h6>
          Already have an account? <Link to={`/auth/sign-in`}>Sign In</Link>
        </h6>
      </span>
      <Form onSubmit={onSubmit}>Sign up</Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
}

export default SignUp;
