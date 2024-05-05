import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import { useEffect, useState } from "react";

const validationScheme = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  category_id: Yup.string().required("Category is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Minimum price is 0"),
  stock: Yup.number()
    .required("Stock is required")
    .min(0, "Minimum stock is 0"),
  image: Yup.mixed()
    .test("fileType", "Unsupported file format", (value: any) => {
      if (!value) return true; // Note! During updating, image is optional

      const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
      return supportedFormats.includes(value.type);
    })
    .test("fileSize", "File size is too large (max: 5000KB)", (value: any) => {
      if (!value) return true; // No file is valid
      return value.size <= 5000000; // 500KB in bytes
    }),
});

const ProductEdit = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const { id } = useParams();
  const { rootStore } = useStore();
  const {
    productStore: { getProduct, updateProduct, fetchCategories },
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
      name: "",
      category_id: "",
      price: 0,
      stock: 0,
      image: "",
    },
  });

  useEffect(() => {
    const initForm = async () => {
      try {
        // Fetch Categories
        const resData = await fetchCategories();
        setCategories(resData.data.categories);

        // Retrieve the Product with the param id
        if (id) {
          const resData = await getProduct(id);
          console.log(resData);

          // Note! We get the whole 'product' data but we don't need the 'image' and 'category' in the form fields.
          let { category, image, ...restOfFormData } = resData.data.product;
          setImageUrl(process.env.REACT_APP_STORAGE_URL + "/" + image);
          reset(restOfFormData);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    initForm();
  }, [id, fetchCategories, getProduct, navigate, reset]);

  const onSumbit = async (data: any) => {
    try {
      if (id) {
        // Note! Due to the 'image' file, we can only use FormData to contain the upload info
        const formData = new FormData();
        Object.keys(data).map((key) => {
          // Note! 'image' is optional
          if (key === "image") {
            if (data[key] !== "") {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
          return null; // dummy
        });

        const resData = await updateProduct(id, formData);
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
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="name"
                  label="Product Name"
                  variant="filled"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  id="category_id"
                  label="Category"
                  variant="filled"
                  error={!!errors.category_id}
                  helperText={errors.category_id?.message}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="price"
                  label="Price"
                  type="number"
                  variant="filled"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">per item</InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="stock"
                  label="Stock"
                  variant="filled"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  onInput={(e: any) => {
                    const target = e.target;
                    target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            {imageUrl && (
              <Card sx={{ maxWidth: 345, my: 5 }}>
                <CardMedia
                  component="img"
                  alt="image-upload"
                  height="auto"
                  image={imageUrl ?? ""}
                />
              </Card>
            )}
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="image"
                  type="file"
                  label="Image"
                  variant="filled"
                  onChange={(e: any) => {
                    field.onChange(e.target.files[0]);
                    e.target.files.length > 0
                      ? setImageUrl(URL.createObjectURL(e.target.files[0]))
                      : setImageUrl(null);
                  }}
                  error={!!errors.image}
                  focused
                  helperText={errors.image?.message}
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

export default observer(ProductEdit);
