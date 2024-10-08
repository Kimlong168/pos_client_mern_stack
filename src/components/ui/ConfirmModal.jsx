import { AnimatePresence, motion } from "framer-motion";

import PropType from "prop-types";
import { FaRegQuestionCircle } from "react-icons/fa";
const ConfirmModal = ({ show, setShow, title, message, onConfirm }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShow(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-[1000] grid place-items-center  cursor-pointer "
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            {/* from-violet-600 to-indigo-600 */}
            <FaRegQuestionCircle className="text-white/20 rotate-12 text-[250px] absolute z-0 -top-20 -left-16" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-yellow-500 grid place-items-center mx-auto">
                <FaRegQuestionCircle />
              </div>
              <div className="text-3xl font-bold text-center mb-2">{title}</div>
              <p className="text-center mb-6">{message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShow(false)}
                  className="hover:opacity-90 transition-opacity bg-transparent text-white border-2 border-yellow-600 font-semibold w-full py-2 rounded"
                >
                  Cancle
                </button>
                <button
                  onClick={onConfirm}
                  className="bg-white hover:opacity-90 transition-opacity text-gray-900 font-semibold w-full py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmModal.propTypes = {
  show: PropType.bool,
  setShow: PropType.func,
  title: PropType.string,
  message: PropType.string,
  onConfirm: PropType.func,
};

export default ConfirmModal;
