import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  qrcodes: [],
};

const qrcodeReducer = (state, action) => {
  switch (action.type) {
    case "SET_QRCODE":
      return {
        ...state,
        qrcodes: action.payload,
      };
    case "DELETE_QRCODE":
      return {
        ...state,
        qrcodes: state.qrcodes.filter((qr) => qr._id !== action.payload),
      };
    case "SEARCH_QRCODE":
      return {
        ...state,
        qrcodes: action.payload,
      };

    default:
      return state;
  }
};

export const QrcodeContext = createContext();

export const QrcodeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(qrcodeReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_QRCODE", payload });
  };

  const removeQrcode = (payload) => {
    dispatch({ type: "DELETE_QRCODE", payload });
  };

  const searchQrcode = (payload) => {
    const filteredQrcodes = state.qrcodes.filter((qr) =>
      qr.location.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_QRCODE", payload: filteredQrcodes });

    if (payload === "") {
      setItems(state.qrcodes);
    }
  };

  return (
    <QrcodeContext.Provider
      value={{
        state: state.qrcodes,
        setItems,
        removeQrcode,
        searchQrcode,
        dispatch,
      }}
    >
      {children}
    </QrcodeContext.Provider>
  );
};

QrcodeProvider.propTypes = {
  children: PropTypes.node,
};
