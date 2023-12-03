// import { AuthenticatedTemplate } from "@azure/msal-react";
import { NavigationBar } from "./NavigationBar";

export const PageLayout = (props) => {
  return (
    <>
      <NavigationBar />
      {props.children}
    </>
  );
};
