import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
const ClassPage = () => {
  const { classId } = useParams();

  return (
    <>
      <AuthenticatedTemplate>
        <div>
          <h1>Class Options</h1>
          <Link to={`/class/${classId}/study`}>Study</Link>
          <Link to={`/class/${classId}/upload`}>Upload Documents</Link>
        </div>
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

export default ClassPage;
