import { useNavigate } from "react-router-dom";
import QrCodeForm from "./components/QrCodeForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useCreateQrcode } from "@/hooks/qrcode/useQrcode";
import { notify } from "../../utils/toastify";

const CreateQrCode = () => {
  const CreateQrcode = useCreateQrcode();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await CreateQrcode.mutateAsync(data);

      navigate("/qrcode");

      if (result.status === "success") {
        notify("Create successfully", "success");
      } else {
        notify("Create fail!", "error");
      }
      console.log("Created item:", result);
    } catch (error) {
      notify("Create fail!", "error");
      console.error("Error creating item:", error);
    }
  };

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Create Qrcode
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <QrCodeForm
        onSubmitFn={onSubmitFn}
        isSubmitting={CreateQrcode.isLoading}
      />
    </div>
  );
};

export default CreateQrCode;
