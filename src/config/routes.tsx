import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "../pages/guest/Login";
import Customers from "../pages/private/customers";
import BaseLayout from "../components/layouts/BaseLayout";
import PrivateRoute from "../middleware/PrivateRoute";
import CustomerList from "../pages/private/customers/List";
import CustomerEdit from "../pages/private/customers/Edit";
import CustomerCreate from "../pages/private/customers/Create";
import Products from "../pages/private/products";
import ProductList from "../pages/private/products/List";
import ProductEdit from "../pages/private/products/Edit";
import ProductCreate from "../pages/private/products/Create";

import OrderList from "../pages/private/orders/List";
import OrderView from "../pages/private/orders/View";
import OrderCreate from "../pages/private/orders/Create";

import Orders from "../pages/private/orders";

const routes = [
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute element={<BaseLayout />} />,
    children: [
      {
        path: "",
        element: <Navigate to="customers" />,
      },
      {
        path: "customers",
        element: <PrivateRoute element={<Customers />} />,
        children: [
          {
            path: "",
            element: <CustomerList />,
          },
          {
            path: "create",
            element: <CustomerCreate />,
          },
          {
            path: "edit/:id",
            element: <CustomerEdit />,
          },
        ],
      },
      {
        path: "products",
        element: <PrivateRoute element={<Products />} />,
        children: [
          {
            path: "",
            element: <ProductList />,
          },
          {
            path: "create",
            element: <ProductCreate />,
          },
          {
            path: "edit/:id",
            element: <ProductEdit />,
          },
        ],
      },
      {
        path: "orders",
        element: <PrivateRoute element={<Orders />} />,
        children: [
          {
            path: "",
            element: <OrderList />,
          },
          {
            path: "create",
            element: <OrderCreate />,
          },
          {
            path: "view/:id",
            element: <OrderView />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> }, // fallback
];

const AppRoutes = () => {
  const route = useRoutes(routes);

  return route;
};

export default AppRoutes;
