import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Container } from "react-bootstrap";

// import { IdTokenData } from "../components/DataDisplay";
import CourseGrid from "../components/CourseGrid";

/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <Container>
            {/* <IdTokenData idTokenClaims={activeAccount.idTokenClaims} /> */}
            <CourseGrid />
          </Container>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="app-name">EchoLearn</div>
        <div className="unauthenticated-template">
          <h5 className="card-title">
            Ready to revolutionize the way you learn?
          </h5>
          <p className="card-text">Sign in to get started with EchoLearn!</p>
        </div>
      </UnauthenticatedTemplate>
    </>
  );
};
