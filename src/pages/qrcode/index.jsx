import QrCode from "./QrCode";
import { QrcodeProvider } from "../../contexts/QrocodeContext";
const index = () => {
  return (
    <QrcodeProvider>
      <QrCode />
    </QrcodeProvider>
  );
};

export default index;
