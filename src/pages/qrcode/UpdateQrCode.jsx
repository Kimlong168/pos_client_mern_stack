import { useLocation, useNavigate } from "react-router-dom";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useUpdateQrcode } from "@/hooks/qrcode/useQrcode";
import QrCodeForm from "./components/QrCodeForm";
const UpdateQrCode = () => {
  const updateQrcode = useUpdateQrcode();

  const location = useLocation();
  const { qrcode } = location.state || {};

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateQrcode.mutateAsync({
        id: qrcode._id,
        ...data,
      });

      navigate("/qrcode");

      if (result.status === "success") {
        notify("Update successfully", "success");
      } else {
        notify("Update fail!", "error");
      }
      console.log("Update item:", result);
    } catch (error) {
      notify("Update fail!", "error");
      console.error("Error Updating item:", error);
    }
  };

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Update Qrcode
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <QrCodeForm
        onSubmitFn={onSubmitFn}
        isSubmitting={updateQrcode.isLoading}
        initialData={qrcode}
      />
    </div>
  );
};

export default UpdateQrCode;
