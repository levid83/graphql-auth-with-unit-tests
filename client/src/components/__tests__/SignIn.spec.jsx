import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { customRender } from "../../testUtils";
import SignIn, { signInMutation } from "../SignIn";

describe("Signin test", () => {
  test("should be able to sign in", async () => {
    let mutationCalled = false;
    const mocks = [
      {
        request: {
          query: signInMutation,
          variables: {
            email: "admin@domain.com",
            password: "123456",
          },
        },
        result: () => {
          mutationCalled = true;
          return {
            data: {
              signIn: {
                user: {
                  id: 1,
                  email: "admin@domain.com",
                  role: "ADMIN",
                },
              },
            },
          };
        },
      },
    ];

    const auth = jest.fn();

    customRender(<SignIn />, {
      providerProps: { isAuthenticated: false, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    expect(screen.getByText(/Need an account/i)).toBeInTheDocument();

    userEvent.type(screen.getByTestId(/email/), "admin@domain.com");
    userEvent.type(screen.getByTestId(/password/), "123456");
    userEvent.click(screen.getByTestId(/submit/));

    await waitFor(() => {
      expect(mutationCalled).toBe(true);
      expect(auth).toBeCalledWith({
        userData: {
          id: 1,
          email: "admin@domain.com",
          role: "ADMIN",
        },
      });
    });
  });

  test("should show an error message on failed sign in", async () => {
    const mocks = [
      {
        request: {
          query: signInMutation,
          variables: {
            email: "admin@domain.com",
            password: "123456",
          },
        },
        error: new Error("Failed to sign in"),
      },
    ];

    const auth = jest.fn();

    customRender(<SignIn />, {
      providerProps: { isAuthenticated: true, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    userEvent.type(screen.getByTestId(/email/), "admin@domain.com");
    userEvent.type(screen.getByTestId(/password/), "123456");
    userEvent.click(screen.getByTestId(/submit/));

    await waitFor(() => {
      expect(screen.getByText(/Failed to sign in/i)).toBeInTheDocument();
    });
  });
});
