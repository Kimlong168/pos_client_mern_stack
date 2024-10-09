import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  leaveRequests: [],
};

const leaveRequestsReducer = (state, action) => {
  switch (action.type) {
    case "SET_LEAVE_REQUEST":
      return {
        ...state,
        leaveRequests: action.payload,
      };
    case "DELETE_LEAVE_REQUEST":
      return {
        ...state,
        leaveRequests: state.leaveRequests.filter(
          (request) => request._id !== action.payload
        ),
      };
    case "SEARCH_LEAVE_REQUEST":
      return {
        ...state,
        leaveRequests: action.payload,
      };

    default:
      return state;
  }
};

export const LeaveRequestContext = createContext();

export const LeaveRequestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveRequestsReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SETSET_LEAVE_REQUEST", payload });
  };

  const removeLeaveRequest = (payload) => {
    dispatch({ type: "DELETE_LEAVE_REQUEST", payload });
  };

  const searchLeaveRequest = (payload) => {
    const filteredLeaveRequests = state.leaveRequests.filter(
      (request) =>
        request._id.toLowerCase().includes(payload.toLowerCase()) ||
        request.employee?.name.toLowerCase().includes(payload.toLowerCase()) ||
        request.reason.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_LEAVE_REQUEST", payload: filteredLeaveRequests });

    if (payload === "") {
      setItems(state.leaveRequests);
    }
  };

  return (
    <LeaveRequestContext.Provider
      value={{
        state: state.leaveRequests,
        setItems,
        removeLeaveRequest,
        searchLeaveRequest,
        dispatch,
      }}
    >
      {children}
    </LeaveRequestContext.Provider>
  );
};

LeaveRequestProvider.propTypes = {
  children: PropTypes.node,
};
