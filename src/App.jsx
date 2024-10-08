import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { SnackbarProvider } from "notistack";
import "react-toastify/dist/ReactToastify.css";
const queryClient = new QueryClient();
export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider autoHideDuration={3000}>
          <AuthProvider>
            <CartProvider>
              <RouterProvider router={router} />
              <ToastContainer limit={3} />
            </CartProvider>
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </>
  );
}
