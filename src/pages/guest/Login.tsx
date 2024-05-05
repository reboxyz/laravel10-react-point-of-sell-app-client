import { Alert, Button, Card, CardContent, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useState } from "react";

// Define a Yup schema for validation
const schema = yup.object().shape({
  email: yup
    .string()
    .required("This is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("This is required")
    .min(8, "Minimum length should be 8 chars"),
});

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState("");

  const {
    rootStore: { authStore, alertStore },
  } = useStore();

  const isAuthenticated = authStore.isAuthenticated;

  const {
    handleSubmit,
    //register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const resData = await authStore.login({
        email: data.email,
        password: data.password,
      });
      console.log("resData", resData);

      alertStore.close(); // Clear any error
    } catch (error: any) {
      //console.log("error", error);

      if (error === "Unauthorized") {
        setAlertInfo("Invalid username or password credentials!");
        setShowAlert(true);
      } else {
        setAlertInfo("Login Error!!!");
        setShowAlert(true);
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard/customers" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ minWidth: 450, justifyContent: "center" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    variant="filled"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    variant="filled"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    {...field}
                  />
                )}
              />
              {showAlert && (
                <Alert severity="warning">{alertInfo || "Login error!"}</Alert>
              )}

              <Button
                sx={{ mt: 3 }}
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(Login);
