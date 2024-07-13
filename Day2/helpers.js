// function $() {
//   return document.querySelectorAll();
// }

const $ = document.querySelectorAll.bind(document);

function Validator(element) {
  let errorMsgEle = $(`#${element.id}Msg`)[0];
  let resetErrorMsg = element
    .getAttribute("custom-validation")
    .includes("isRequired:true")
    ? "*"
    : "";

  function isRequired() {
    if (element.value.trim() == "") {
      errorMsgEle.textContent = "*Required";
      return false;
    }
    errorMsgEle.textContent = resetErrorMsg;
    return true;
  }

  function isPattern(pattern) {
    pattern = new RegExp(pattern, "g");
    if (!pattern.test(element.value)) {
      errorMsgEle.textContent = "*Not valid";
      return false;
    }
    errorMsgEle.textContent = resetErrorMsg;
    return true;
  }

  function isMaxLength(value) {
    if (element.value.length > parseInt(value)) {
      errorMsgEle.textContent = `*Max length - ${value} chars.`;
      return false;
    }
    errorMsgEle.textContent = resetErrorMsg;
    return true;
  }

  function validateRadio(value) {
    let radioElements = value.split(",").map((item) => $(`#${item}`)[0]);
    if (!radioElements.some((element) => element.checked)) {
      errorMsgEle.textContent = `*Required`;
      return false;
    }
    errorMsgEle.textContent = "*";
    return true;
  }

  // function validateDoc(fileNameElement){
  //     const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
  //     if (!element.files[0]) {
  //         $(`#${fileNameElement}`)[0].textContent = "";
  //         errorMsgEle.textContent=`*Required`;
  //         return false;
  //     } else if (!allowedFormats.includes(element.files[0].type)) {
  //         $(`#${fileNameElement}`)[0].textContent = "";
  //         errorMsgEle.textContent=`*Invalid file format`;
  //         return false;
  //     } else {
  //         $(`#${fileNameElement}`)[0].textContent = element.files[0].name;
  //         errorMsgEle.textContent=`*`;
  //         return true;
  //     }
  // }

  return {
    isRequired,
    isPattern,
    isMaxLength,
    validateRadio,
    // validateDoc
  };
}
