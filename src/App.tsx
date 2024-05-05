import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
