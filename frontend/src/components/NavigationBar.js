import { Nav, Navbar, Dropdown, DropdownButton, Button } from "react-bootstrap";
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
            <Button
              variant="info"
              onClick={handleProfileEdit}
              className="profileButton"
            >
              Edit Profile
            </Button>

            <DropdownButton 
              onClick={handleLogoutRedirect}
              variant="warning"
              drop="start"
              title={
                activeAccount && activeAccount.username
                  ? activeAccount.username
                  : "Logout"
              }
            />
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className="collapse navbar-collapse justify-content-end">
            <DropdownButton
              onClick={handleLoginRedirect}
              variant="secondary"
              className="ml-auto"
              drop="start"
              title="Sign In"
            />
          </div>
        </UnauthenticatedTemplate>
      </Navbar>
    </>
  );
};