import * as React from "react";
import { gql, useQuery } from "@apollo/client";

import { AuthContext } from "../../context/AuthProvider";

const USERS = gql`
  query users {
    users {
      id
      email
      role
    }
  }
`;

const UserList = () => {
  const { loading, error, data } = useQuery(USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!data.users) {
    return <p>No users to show.</p>;
  }

  return data.users.map(({ id, email, role }) => (
    <div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{email}</h3>
          <h3 className="panel-title">{role}</h3>
        </div>
      </div>
    </div>
  ));
};

export default function Admin() {
  const { isAdmin } = React.useContext(AuthContext);

  return isAdmin ? (
    <>
      <div className="container">
        <div className="row">
          <UserList />
        </div>
      </div>
    </>
  ) : null;
}
