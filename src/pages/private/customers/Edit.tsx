import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import { useEffect } from "react";

const validationScheme = Yup.object().shape({
  first_name: Yup.string().required("Firstname is required"),
  last_name: Yup.string().required("Lastname is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be 10 chars")
    .max(10, "Phone number must be 10 chars"),
  zip_code: Yup.string()
    .required("Zipcode is required")
    .min(6, "Zipcode must be between 6 - 8 chars")
    .max(8, "Zipcode must be between 6 - 8 chars"),
});

const CustomerEdit = () => {
  const { id } = useParams();
  const { rootStore } = useStore();
  const {
    customerStore: { getCustomer, updateCustomer },
  } = rootStore;

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      zip_code: "",
    },
  });

  useEffect(() => {
    const initForm = async () => {
      try {
        if (id) {
          const resData = await getCustomer(id);
          reset(resData.data.customer);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    initForm();
  }, [id, getCustomer, navigate, reset]);

  const onSumbit = async (data: any) => {
    try {
      if (id) {
        const resData = await updateCustomer(id, data);
        console.log(resData);

        if (resData) {
          reset();
          navigate(".."); // Back
        }
      }
    } catch (error: any) {
      console.log("error", error);
      Object.keys(error?.data).map((e: any) => {
        return setError(e, {
          type: "manual", // Use 'manual' for manually triggered errors
          message: error?.data[e],
        });
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Edit</h4>
      <form onSubmit={handleSubmit(onSumbit)}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="first_name"
                  label="Firstname"
                  variant="filled"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="last_name"
                  label="Lastname"
                  variant="filled"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  variant="filled"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  inputProps={{ maxLength: 10 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="zip_code"
                  label="Zip Code"
                  variant="filled"
                  error={!!errors.zip_code}
                  helperText={errors.zip_code?.message}
                  inputProps={{ maxLength: 8 }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 2 }}
          type="submit"
          variant="contained"
          color="success"
        >
          Save
        </Button>
        <Button
          sx={{ mt: 2, ml: 2 }}
          type="submit"
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </form>
    </Box>
  );
};

export default observer(CustomerEdit);
