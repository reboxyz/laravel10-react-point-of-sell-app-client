import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../../store/rootStore";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, TextField } from "@mui/material";
import AllItemsList from "./AllItemsList";
import { useReactToPrint } from "react-to-print";

const OrderView = () => {
  const {
    rootStore: { orderStore },
  } = useStore();
  const [orderData, setOrderData] = useState<any>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef<any>();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const resData = await orderStore.getOrder(id);
          console.log(resData);
          setOrderData(resData);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    orderStore.setCartItems([]);
    fetchDetails();

    return () => {
      orderStore.setCartItems([]);
    };
  }, [id, orderStore, navigate]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ px: 5, py: 3 }} ref={printRef}>
        <h4>Order Details</h4>
        {/* First Row */}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mb: 2 }}
        >
          <Grid item xs={6}>
            <TextField
              label="Order ID"
              variant="standard"
              value={orderData?.order_number}
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Order Date"
              variant="standard"
              value={orderData?.created_at}
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        {/* Second Row */}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mb: 2 }}
        >
          <Grid item xs={3}>
            <TextField
              label="Customer Name"
              variant="standard"
              value={
                orderData?.customer?.first_name +
                " " +
                orderData?.customer?.last_name
              }
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Customer Email"
              variant="standard"
              value={orderData?.customer.email}
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Customer Phone"
              variant="standard"
              value={orderData?.customer.phone_number}
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Customer Zipcode"
              variant="standard"
              value={orderData?.customer.zip_code}
              focused
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <AllItemsList editMode={false} />
      </Box>
      <Button
        sx={{ mt: 2, ml: 5 }}
        type="button"
        variant="contained"
        color="success"
        onClick={handlePrint}
      >
        Print
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

export default observer(OrderView);
