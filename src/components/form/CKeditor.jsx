import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../../App.css";
// import { useUploadImage } from "../../hooks/editorImageUpload/useUploadImage";
const CKeditor = ({ handleEditorChange, contentToUpdate, editorName }) => {
  const [content, setContent] = useState(contentToUpdate || "");

  useEffect(() => {
    if (contentToUpdate) {
      setContent(contentToUpdate);
    }
  }, [contentToUpdate]);

  // const uploadImage = useUploadImage();

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const customUploadAdapter = (loader) => {
  //   return {
  //     upload: () => {
  //       return new Promise((resolve, reject) => {
  //         loader.file
  //           .then((file) => {
  //             convertToBase64(file)
  //               .then((base64) => {
  //                 const formData = { image: base64 };
  //                 console.log("Uploading file:", file);

  //                 uploadImage.mutate(formData, {
  //                   onSuccess: (response) => {
  //                     console.log("Upload successful:", response);
  //                     resolve({ default: response.body.image_url });
  //                   },
  //                   onError: (error) => {
  //                     console.error("Upload failed:", error);
  //                     reject(error);
  //                   },
  //                 });
  //               })
  //               .catch((error) => {
  //                 console.error("Error converting to base64:", error);
  //                 reject(error);
  //               });
  //           })
  //           .catch((error) => {
  //             console.error("Error getting file:", error);
  //             reject(error);
  //           });
  //       });
  //     },
  //   };
  // };

  // function MyCustomUploadAdapterPlugin(editor) {
  //   editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
  //     return customUploadAdapter(loader);
  //   };
  // }

  return (
    <div className="prose prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-h4:m-0 prose-p:m-0 prose-p:mt-2 prose-a:text-blue-500 prose-a:cursor-pointer max-w-full">
      <CKEditor
        id="editor"
        className="editor"
        // config={{
        //   extraPlugins: [MyCustomUploadAdapterPlugin],
        // }}
        editor={ClassicEditor}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);

          if (editorName) {
            handleEditorChange(data, editorName);
          } else {
            handleEditorChange(data);
          }

          // console.log("edior:", { event, editor, data });
        }}
      />
    </div>
  );
};
CKeditor.propTypes = {
  handleEditorChange: PropTypes.func.isRequired,
  contentToUpdate: PropTypes.string,
  editorName: PropTypes.string,
};
export default CKeditor;
