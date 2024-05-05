import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import { useState } from "react";
import ServerSideAutoComplete from "../../../components/ui/server-side-autocomplete/ServerSideAutoComplete";
import AddNewItemForm from "./AddNewItemForm";
import AllItemsList from "./AllItemsList";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  customer: Yup.object()
    .shape({
      id: Yup.string().required("Customer is required"),
      label: Yup.string().required("Customer is required"),
    })
    .required("Customer is required"),
});

const OrderCreate = () => {
  const [productsErrorMessage, setProductsErrorMessage] = useState<any>(null);
  const navigate = useNavigate();
  const {
    rootStore: { orderStore, customerStore },
  } = useStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: {
        id: "",
        label: "",
      },
    },
  });

  // Note! 'data' is only the customer info and the rest is in the cartItems[] in the orderStore
  const onSubmit = async (data: any) => {
    try {
      //console.log("data", data);
      setProductsErrorMessage(null);
      const resData = await orderStore.createOrder(data);

      if (resData) {
        reset({
          customer: { id: "", label: "" },
        });
        orderStore.setCartItems([]);
        navigate("..");
      }
    } catch (error: any) {
      Object.keys(error?.data).map((key: any) => {
        return setError(key, {
          type: "manual", // Use 'manual' to manually trigger errors
          message: error?.data[key],
        });
      });
      setProductsErrorMessage("Please select a product to edit");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Create</h4>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <ServerSideAutoComplete
                  label="Select a customer"
                  ajaxCallFn={customerStore.getList}
                  onOptionSelect={(option) => field.onChange(option)}
                  error={errors.customer?.id ?? errors.customer}
                  field={field}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      {/* Add new item Form */}
      <AddNewItemForm />
      {productsErrorMessage ? (
        <Box sx={{ color: "error.main", my: 2 }}></Box>
      ) : (
        ""
      )}
      <AllItemsList editMode={true} />

      <Button
        sx={{ mt: 2 }}
        type="button" // Note! We cannot use type 'submit' because we defined this out the 'form' tag
        variant="contained"
        color="success"
        onClick={() => handleSubmit(onSubmit)()}
      >
        Add
      </Button>
      <Button
        sx={{ mt: 2, ml: 2 }}
        variant="contained"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};

export default observer(OrderCreate);
