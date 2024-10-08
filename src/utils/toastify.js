import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = (theme) => {
  return {
    position: "top-right",
    autoClose: 2000, //2 seconds
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: theme,
    transition: Bounce,
  };
};

export const notify = (text, type = "success", theme = "dark") => {
  if (type === "success") {
    return toast.success(text, toastConfig(theme));
  } else if (type === "error") {
    return toast.error(text, toastConfig(theme));
  } else {
    return toast.info(text, toastConfig(theme));
  }
};
