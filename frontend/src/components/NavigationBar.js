import { Navbar } from "react-bootstrap";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from "../authentification/authConfig";

export const NavigationBar = () => {
  const { instance, inProgress } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) {
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" className="navbarStyle">
        <AuthenticatedTemplate>
          <div className="mainNavbar">
            <button onClick={handleProfileEdit} className="button-styled">
              Edit Profile
            </button>

            <button onClick={handleLogoutRedirect} className="button-styled">
              Logout
            </button>
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className="collapse navbar-collapse justify-content-end">
            <button className="button-styled" onClick={handleLoginRedirect}>
              Sign In
            </button>
          </div>
        </UnauthenticatedTemplate>
      </Navbar>
    </>
  );
};
