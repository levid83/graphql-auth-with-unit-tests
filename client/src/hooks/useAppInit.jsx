import { useContext, useEffect } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthProvider";

const userInfoQuery = gql`
  query authInfo {
    me {
      id
      email
      role
    }
  }
`;

export const useAppInit = () => {
  const [getAuthInfo, { loading }] = useLazyQuery(userInfoQuery);
  const { setAuthInfo } = useContext(AuthContext);

  useEffect(() => {
    const handleSession = async () => {
      try {
        const res = await getAuthInfo();
        setAuthInfo({ userData: res?.data?.me });
      } catch (error) {
        console.log("error", error);
      }
    };

    handleSession();
  }, [getAuthInfo, setAuthInfo]);

  return { loading };
};
