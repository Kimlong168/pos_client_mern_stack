import html2canvas from "html2canvas";

const downloadQrcode = (qrcode) => {
  html2canvas(
    document.querySelector(`#${qrcode.location.replace(/\s+/g, "")}`)
  ).then(function (canvas) {
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    console.log(a.href, "and", a);
    a.download = `${qrcode.location}_${qrcode.radius}.png`;
    a.click();
  });
};

export default downloadQrcode;
