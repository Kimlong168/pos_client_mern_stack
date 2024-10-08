import { AttendanceProvider } from "@/contexts/AttendanceContext";
import Attendance from "./Attendance";
const index = () => {
  return (
    <AttendanceProvider>
      <Attendance />
    </AttendanceProvider>
  );
};

export default index;
