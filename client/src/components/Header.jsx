import React from "react";

import { Link } from "react-router-dom";
import { AuthLink } from "./AuthLink";
import { AuthContext } from "../context/AuthProvider";

export function Header() {
  const { isAdmin } = React.useContext(AuthContext);
  return (
    <header>
      <div className="container">
        <div className="logo col-md-5 col-sm-5 col-xs-8">
          <Link to="/">
            <span className="text">GraphQL With Unit Tests</span>
          </Link>
        </div>
        <div className="col-md-5 col-xs-12">
          {isAdmin && (
            <div className="sign">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </div>
          )}
        </div>
        <div className="sign-in col-md-2">
          <div className="sign">
            <AuthLink to="/auth/sign-in">Sign-in</AuthLink>
          </div>
        </div>
      </div>
    </header>
  );
}
