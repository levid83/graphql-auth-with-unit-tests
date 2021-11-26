import { render } from "@testing-library/react";

import { AuthContext } from "./context/AuthProvider";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";

export const customRender = (
  ui,
  { providerProps = {}, gqlMocks = [], gqlDefault = {}, ...renderOptions }
) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MockedProvider
        mocks={gqlMocks}
        addTypename={false}
        defaultOptions={gqlDefault}
      >
        <BrowserRouter>{ui}</BrowserRouter>
      </MockedProvider>
    </AuthContext.Provider>,
    renderOptions
  );
};
