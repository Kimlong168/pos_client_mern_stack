import { LeaveRequestProvider } from "../../contexts/LeaveRequestContext";
import LeaveRequest from "./LeaveRequest";
const index = () => {
  return (
    <LeaveRequestProvider>
      <LeaveRequest />
    </LeaveRequestProvider>
  );
};

export default index;
