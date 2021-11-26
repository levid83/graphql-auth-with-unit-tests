import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { customRender } from "../../testUtils";
import SignUp, { signUpMutation } from "../SignUp";

describe("Signin test", () => {
  test("should be able to sign up", async () => {
    let mutationCalled = false;
    const mocks = [
      {
        request: {
          query: signUpMutation,
          variables: {
            email: "admin@domain.com",
            password: "123456",
          },
        },
        result: () => {
          mutationCalled = true;
          return {
            data: {
              signUp: {
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

    customRender(<SignUp />, {
      providerProps: { isAuthenticated: false, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();

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

  test("should show an error message on failed sign up", async () => {
    const mocks = [
      {
        request: {
          query: signUpMutation,
          variables: {
            email: "admin@domain.com",
            password: "123456",
          },
        },
        error: new Error("Failed to sign up"),
      },
    ];

    const auth = jest.fn();

    customRender(<SignUp />, {
      providerProps: { isAuthenticated: true, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    userEvent.type(screen.getByTestId(/email/), "admin@domain.com");
    userEvent.type(screen.getByTestId(/password/), "123456");
    userEvent.click(screen.getByTestId(/submit/));

    await waitFor(() => {
      expect(screen.getByText(/Failed to sign up/i)).toBeInTheDocument();
    });
  });
});
