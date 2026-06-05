import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    hideProgressBar: true,
    theme: "dark",
};

class Toaster {
    success = (message: string) => {
        toast.success(message, toastOptions);
    };
    error = (message: string) => {
        toast.error(message, toastOptions);
    };
    warn = (message: string) => {
        toast.warn(message, toastOptions);
    };
    info = (message: string) => {
        toast.info(message, toastOptions);
    };
}
export const toasts = new Toaster();
