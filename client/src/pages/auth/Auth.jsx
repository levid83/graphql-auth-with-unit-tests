import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";

export default function Auth() {
  return (
    <Routes>
      <Route path={`/sign-in`} element={<SignIn />} />
      <Route path={`/sign-up`} element={<SignUp />} />
      <Route path={`/`} element={<Navigate replace to={`/sign-in`} />} />
    </Routes>
  );
}
