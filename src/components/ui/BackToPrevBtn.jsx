import { MdOutlineArrowBackIos } from "react-icons/md";

const BackToPrevBtn = () => {
  return (
    <div
      onClick={() => {
        window.history.back();
      }}
    >
      <button className="font-bold text-white p-1.5 px-3 rounded bg-red-500 hover:bg-red-600 transition-all gap-2 flex items-center">
        <MdOutlineArrowBackIos /> Back
      </button>
    </div>
  );
};

export default BackToPrevBtn;
