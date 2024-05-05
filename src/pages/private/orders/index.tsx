import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

const Orders = () => {
  return (
    <div>
      <h2>Orders</h2>
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </div>
  );
};

export default observer(Orders);
