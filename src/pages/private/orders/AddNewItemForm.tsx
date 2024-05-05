import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../../store/rootStore";
import { Button, Grid, TextField } from "@mui/material";
import ServerSideAutoComplete from "../../../components/ui/server-side-autocomplete/ServerSideAutoComplete";
import { observer } from "mobx-react-lite";

const validationSchema = Yup.object().shape({
  product: Yup.object()
    .shape({
      id: Yup.string().required("Product is required"),
      label: Yup.string().required("Product is required"),
    })
    .required("Product is required"),
  price: Yup.number(),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Minimum value is 1"),
  discount: Yup.number()
    .required("Discount is required")
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
  total: Yup.number(),
});

const AddNewItemForm: React.FC<any> = () => {
  const { rootStore } = useStore();
  const { orderStore, productStore } = rootStore;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    //setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: {
        id: "",
        label: "",
      },
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    },
  });

  const handleSelectProduct = (value: any) => {
    console.log("handleSelectProduct ", value);
    if (value) {
      setValue("product", value);
      setValue("price", value?.price);
      setValue("quantity", 1);

      // Compute total using the default quantity which is 1
      setValue("total", value?.price * 1);
    } else {
      setValue("product", {
        id: "",
        label: "",
      });
      setValue("price", 0);
      setValue("total", 0);
      setValue("quantity", 1);
      setValue("discount", 0);
    }
  };

  const calculateFinalPrice = () => {
    const original = getValues("price") ?? 0;
    const discount = getValues("discount") ?? 0;
    const finalPrice = original - (original * discount) / 100;
    setValue(
      "total",
      Math.round(finalPrice * getValues("quantity") * 100) / 100 // Round to 2 decimal places
    );
  };

  const onSubmit = async (data: any) => {
    //console.log("onSubmit", data);
    orderStore.addToCart(data);
    reset({
      product: {
        id: "",
        label: "",
      },
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ my: 3 }}
      >
        <Grid item xs={3}>
          <Controller
            key="product"
            name="product"
            control={control}
            render={({ field }) => (
              <ServerSideAutoComplete
                label="Select a product"
                ajaxCallFn={productStore.getList}
                onOptionSelect={(option) => {
                  //console.log("onOptionSelect");
                  field.onChange(option);
                  handleSelectProduct(option);
                }}
                error={errors.product?.id ?? errors.product}
                field={field}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                InputProps={{
                  readOnly: true,
                  disabled: true,
                }}
                {...field}
                fullWidth
                id="price"
                label="Price"
                variant="filled"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  calculateFinalPrice();
                }}
                fullWidth
                id="quantity"
                //type="number"
                onInput={(e: any) => {
                  const target = e.target;
                  target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                label="Quantity"
                variant="filled"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  calculateFinalPrice();
                }}
                fullWidth
                id="discount"
                //type="number"
                onInput={(e: any) => {
                  const target = e.target;
                  target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                label="Discount (%)"
                variant="filled"
                error={!!errors.discount}
                helperText={errors.discount?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Controller
            name="total"
            control={control}
            render={({ field }) => (
              <TextField
                InputProps={{
                  readOnly: true,
                  disabled: true,
                }}
                {...field}
                fullWidth
                id="total"
                label="Total"
                variant="filled"
                error={!!errors.total}
                helperText={errors.total?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            sx={{ mt: 2 }}
            type="button" // Note! Intentionally set as 'button' not 'submit'
            variant="contained"
            color="secondary"
            onClick={() => handleSubmit(onSubmit)()}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default observer(AddNewItemForm);
