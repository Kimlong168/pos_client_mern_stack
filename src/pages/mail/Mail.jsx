import { useContext, useState } from "react";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useSendMail } from "../../hooks/mail/useMail";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/user/useUser";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
import CKeditor from "../../components/form/CKeditor";
import { emailTemplates } from "../../utils/data";
import Multiselect from "multiselect-react-dropdown";
import { AuthContext } from "../../contexts/AuthContext";
import { fileToBase64 } from "../../utils/fileToBase64";
import { FaTrash } from "react-icons/fa";
import RedStar from "../../components/ui/RedStar";
const Mail = () => {
  const sendMail = useSendMail();
  const { user } = useContext(AuthContext);
  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUsers();
  const {
    data: suppliers,
    isLoading: isSupplierLoading,
    isError: isSupplierError,
  } = useSuppliers();
  const [mailData, setMailData] = useState({
    name: "",
    email: "",
    subject: "",
    html: "",
    cc: [
      {
        name: user.name,
        email: user.email,
        id: user._id,
        nameEmail: user.name + " (" + user.email + ")",
      },
    ],
    attachments: [],
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  //   cc to admins and mangers
  //   useEffect(() => {
  //     if (users) {
  //       const ccUsers = users
  //         ?.filter((user) => user.role === "admin" || user.role === "manager")
  //         .map((user) => ({
  //           name: user.name,
  //           email: user.email,
  //           id: user._id,
  //           nameEmail: user.name + " (" + user.email + ")",
  //         }));

  //       setMailData((prevMailData) => ({
  //         ...prevMailData,
  //         cc: ccUsers,
  //       }));
  //     }
  //   }, [users]);

  //   options to select
  const options = users?.map((user) => ({
    name: user.name,
    email: user.email,
    id: user._id,
    nameEmail: user.name + " (" + user.email + ")",
  }));

  //   handle select
  const handleOnSelect = (e) => {
    console.log("e", e);
    const selectedValue = e.map((state) => {
      return {
        name: state.name,
        id: state.id,
        email: state.email,
        nameEmail: state.name + " (" + state.email + ")",
      };
    });
    setMailData((prevMailData) => ({
      ...prevMailData,
      cc: selectedValue,
    }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (value === "" || value == "Loading") return;

    if (name === "name") {
      let user;
      let supplier;
      user = users.find((user) => user.name === value);

      if (!user) {
        supplier = suppliers.find((supplier) => supplier.name === value);
      }

      console.log("user", user);

      setMailData((prevMailData) => ({
        ...prevMailData,
        name: user ? user.name : supplier.name,
        email: user ? user.email : supplier.contact_info?.email,
      }));

      return;
    }

    setMailData((prevMailData) => ({
      ...prevMailData,
      [name]: value, // Handle file input and text input
    }));
  };

  const handleEditorChange = (content) => {
    setMailData((prevMailData) => ({
      ...prevMailData,
      html: content,
    }));
  };

  const handleChangeTemplate = (e) => {
    const { value } = e.target;

    if (value === "") return;

    setSelectedTemplate(value);

    const template = emailTemplates.find((template) => template.type === value);

    setMailData((prevMailData) => ({
      ...prevMailData,
      subject: template.subject,
      html: template.body,
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filePromises = files.map((file) => fileToBase64(file));

    Promise.all(filePromises).then((base64Files) => {
      const attachments = base64Files.map((base64Content, index) => ({
        filename: files[index].name,
        content: base64Content,
        type: files[index].type || "application/octet-stream",
        disposition: "attachment",
      }));

      setAttachmentFiles(attachments);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !mailData.name ||
      !mailData.email ||
      !mailData.subject ||
      !mailData.html
    ) {
      notify("Please fill all the fields!", "error");
      return;
    }

    // check is email and cc dubplicate
    const cc = mailData.cc.map((cc) => cc.email);
    const email = mailData.email;
    if (cc.includes(email)) {
      notify("Email and CC can't be the same!", "error");
      return;
    }

    const newMailData = {
      ...mailData,
      attachments: attachmentFiles,
    };

    setIsSubmitting(true);
    // Send mailData to the server
    try {
      const result = await sendMail.mutateAsync(newMailData);
      navigate("/mail");
      setIsSubmitting(false);

      if (result.status === "success") {
        notify("Sent successfully", "success");
      } else {
        notify("Sent fail!", "error");
      }
      console.log("sending mail:", result);
    } catch (error) {
      notify("Sent fail!", "error");
      console.error("Error sending mail:", error);
    }
  };

  if (isUserError || isSupplierError) {
    return <div>Error...</div>;
  }

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Send Mail
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-sm">Email Template</label>
        <select
          name="name"
          value={selectedTemplate}
          onChange={handleChangeTemplate}
          className="border p-2 rounded focus:outline-orange-500"
        >
          <option value="" className=" bg-green-600/50">
            Select Template
          </option>
          {emailTemplates.map((template) => (
            <option key={template.type} value={template.type}>
              {template.type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex gap-3 mt-3">
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Send To <RedStar />
            </label>
            <select
              name="name"
              value={mailData.name}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            >
              {isUserLoading ? (
                <option value="Loading">Loading...</option>
              ) : (
                <>
                  <option value="" className=" bg-green-600/50">
                    Select User
                  </option>{" "}
                  {users?.map((user) => (
                    <option key={user._id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </>
              )}

              {isSupplierLoading ? (
                <option value="Loading">Loading...</option>
              ) : (
                <>
                  <option value="" className=" bg-green-600/50">
                    Select Supplier
                  </option>
                  {suppliers?.map((supplier) => (
                    <option key={supplier._id} value={supplier?.name}>
                      {supplier?.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Email <RedStar />
            </label>
            <input
              type="email"
              name="email"
              value={mailData.email}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 mt-3">
          <label className="font-medium text-sm">CC</label>
          <Multiselect
            selectedValues={mailData.cc}
            placeholder="Select CC (optional)"
            className="rounded border"
            options={options}
            name="endStates"
            displayValue="nameEmail"
            showArrow={true}
            onSelect={(e) => handleOnSelect(e)} // Function will trigger on select event
            onRemove={(e) => handleOnSelect(e)} // Function will trigger on remove event
          />
        </div>

        <div className="flex flex-col gap-2  mt-3">
          <label className="font-medium text-sm">Attactments</label>
          <div className="flex items-center gap-3">
            {attachmentFiles?.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white  p-1.5 rounded bg-green-600  "
              >
                <span className="text-sm inline-block truncate">
                  {file.filename}
                </span>

                <button
                  className="text-red-500"
                  onClick={() => {
                    setAttachmentFiles((prevFiles) =>
                      prevFiles.filter(
                        (prevFile) => prevFile.filename !== file.filename
                      )
                    );
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          {
            <input
              type="file"
              //   name="attachments"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded focus:outline-orange-500"
            />
          }
        </div>

        <div className="flex flex-col gap-2  mt-3">
          <label className="font-medium text-sm">
            Subject <RedStar />
          </label>
          <input
            type="text"
            name="subject"
            value={mailData.subject}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="mt-3">
          <label className="font-medium text-sm">
            Content <RedStar />
          </label>
          <CKeditor
            handleEditorChange={handleEditorChange}
            contentToUpdate={selectedTemplate ? mailData.html : ""}
          />
        </div>

        {/*create mailData button */}
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 px-5 mt-2 rounded"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Mail;
