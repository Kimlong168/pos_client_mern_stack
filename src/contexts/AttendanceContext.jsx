import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  attendances: [],
};

const attendanceReducer = (state, action) => {
  switch (action.type) {
    case "SET_ATTENDANCE":
      return {
        ...state,
        attendances: action.payload,
      };
    case "DELETE_ATTENDANCE":
      return {
        ...state,
        attendances: state.attendances.filter(
          (attendance) => attendance._id !== action.payload
        ),
      };
    case "SEARCH_ATTENDANCE":
      return {
        ...state,
        attendances: action.payload,
      };

    default:
      return state;
  }
};

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SETSET_ATTENDANCE", payload });
  };

  const removeAttendance = (payload) => {
    dispatch({ type: "DELETE_ATTENDANCE", payload });
  };

  const searchAttendance = (payload) => {
    const filteredattendances = state.attendances.filter(
      (attendance) =>
        attendance.employee?.name
          .toLowerCase()
          .includes(payload.toLowerCase()) ||
        attendance._id.toLowerCase().includes(payload.toLowerCase()) ||
        attendance.qr_code?.location
          .toLowerCase()
          .includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_ATTENDANCE", payload: filteredattendances });

    if (payload === "") {
      setItems(state.attendances);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        state: state.attendances,
        setItems,
        removeAttendance,
        searchAttendance,
        dispatch,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

AttendanceProvider.propTypes = {
  children: PropTypes.node,
};
