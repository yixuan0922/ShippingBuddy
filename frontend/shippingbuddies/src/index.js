import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import SearchPage from "./pages/SearchPage";
import reportWebVitals from "./reportWebVitals.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/routes.js";
import ErrorPage from "./pages/error_page.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/Home",
        element: <App />,
      },
      {
        path: "/Search",
        element: <SearchPage />,
      },
    ],
  },
  // {
  //   path: "/Search",
  //   element: <Root />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       path: "/Search",
  //       element: <SearchPage />,
  //     },
  //   ],
  // },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
