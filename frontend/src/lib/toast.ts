import toast from "react-hot-toast";

/** App-wide toast helpers (backed by react-hot-toast). */
export const appToast = {
  message(message: string) {
    return toast(message);
  },
  success(message: string) {
    return toast.success(message);
  },
  error(message: string) {
    return toast.error(message);
  },
  dismiss(id?: string) {
    toast.dismiss(id);
  },
};
