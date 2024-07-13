  const $ = document.querySelectorAll.bind(document);
  
  type Validators = {
    isRequired: () => boolean;
    isPattern: (pattern: string) => boolean;
    isMaxLength: (value: string) => boolean;
    validateRadio: (value: string) => boolean;
  }

  function Validator(element: HTMLInputElement): Validators {
    const errorMsgEle = $(`#${element.id}Msg`)[0];
    const resetErrorMsg = element
      .getAttribute("custom-validation")
      ?.includes("isRequired:true")
      ? "*"
      : "";
  
    function setError(msg: string): boolean {
      if (errorMsgEle) {
        errorMsgEle.textContent = msg;
      }
      element.style.border = "1px solid red";
      return false;
    }
  
    function resetField(): boolean {
      if (errorMsgEle) {
        errorMsgEle.textContent = resetErrorMsg || "";
      }
      element.style.border = "1px solid black";
      return true;
    }
  
    function isRequired(): boolean {
      if (element.value.trim() === "") {
        return setError("*Required");
      }
      return resetField();
    }
  
    function isPattern(pattern: string): boolean {
      const regex = new RegExp(pattern, "g");
      if (!regex.test(element.value)) {
        const errorMsg = element.getAttribute("error-message");
        return setError(errorMsg ?? "*Not valid");
      }
      return resetField();
    }
  
    function isMaxLength(value: string): boolean {
      const maxLength = parseInt(value, 10);
      if (element.value.length > maxLength) {
        return setError(`*Max length - ${value} chars.`);
      }
      return resetField();
    }
  
    function validateRadio(value: string): boolean {
      const radioElements = value.split(",").map((item) => $(`#${item}`)[0] as HTMLInputElement);
      if (!radioElements.some((radioElement) => radioElement.checked)) {
        if (errorMsgEle) {
          errorMsgEle.textContent = `*Required`;
        }
        return false;
      }
      if (errorMsgEle) {
        errorMsgEle.textContent = "*";
      }
      return true;
    }
  
    return {
      isRequired,
      isPattern,
      isMaxLength,
      validateRadio,
    };
  }
  