import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { AuthLink, signOutMutation } from "../AuthLink";

import { customRender } from "../../testUtils";

describe("AuthLink test", () => {
  test("should display sign in when the user is not authenticated", () => {
    customRender(<AuthLink to="/auth/sign-in">Sign-in</AuthLink>, {
      providerProps: { isAuthenticated: false },
      gqlMocks: [],
    });

    expect(screen.getByText(/Sign-in/i)).toBeInTheDocument();
  });

  test("should display sign out when the user is authenticated", () => {
    customRender(<AuthLink to="/auth/sign-in">Sign-in</AuthLink>, {
      providerProps: { isAuthenticated: true },
      gqlMocks: [],
    });

    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  test("should be able to log out", async () => {
    let mutationCalled = false;
    const mocks = [
      {
        request: {
          query: signOutMutation,
        },
        result: () => {
          mutationCalled = true;
          return {
            data: {
              signOut: {
                user: {
                  id: 1,
                  email: "test@email.com",
                },
              },
            },
          };
        },
      },
    ];

    const auth = jest.fn();

    customRender(<AuthLink to="/auth/sign-in">Sign-in</AuthLink>, {
      providerProps: { isAuthenticated: true, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    userEvent.click(screen.getByText(/Sign Out/));

    await waitFor(() => {
      expect(mutationCalled).toBe(true);
      expect(auth).toBeCalledWith({ userData: undefined });
    });
  });

  test("should show an error message on failed logout", async () => {
    const mocks = [
      {
        request: {
          query: signOutMutation,
        },
        error: new Error("Failed to sign out"),
      },
    ];

    const auth = jest.fn();

    customRender(<AuthLink to="/auth/sign-in">Sign-in</AuthLink>, {
      providerProps: { isAuthenticated: true, setAuthInfo: auth },
      gqlMocks: mocks,
    });

    userEvent.click(screen.getByText(/Sign Out/));

    await waitFor(() => {
      expect(screen.getByText(/Click again to signout/i)).toBeInTheDocument();
    });
  });
});
