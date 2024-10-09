import { closeSnackbar, enqueueSnackbar } from "notistack";

const handleDeleteFunction = async (deleteFn, message) => {
  const action = (snackbarId) => (
    <div className="flex gap-4 p-5">
      <button
        className="border border-red-600 hover:bg-red-700  p-2 py-1 rounded bg-red-600 text-white"
        onClick={async () => {
          closeSnackbar(snackbarId);
          deleteFn();
        }}
      >
        Yes
      </button>
      <button
        className="hover:border border-red-600  text-red-600 p-2 py-1 rounded bg-white  "
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        Dismiss
      </button>
    </div>
  );

  enqueueSnackbar(message || "Are you sure to delete?", {
    variant: "warning",
    action,
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  });
};

export { handleDeleteFunction };
