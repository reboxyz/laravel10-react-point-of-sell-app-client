import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../store/rootStore";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { rootStore } = useStore();
  const { productStore } = rootStore;

  const initTable = async () => {
    try {
      const resData = await productStore.fetchList();
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Button variant="contained" sx={{ mb: 2 }} component={Link} to="create">
        Create
      </Button>
      <DataGrid
        rows={productStore.rowData}
        columns={productStore.columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
  );
};

export default observer(ProductList);
