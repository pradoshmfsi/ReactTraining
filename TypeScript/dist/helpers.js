"use strict";
const $ = document.querySelectorAll.bind(document);
function Validator(element) {
    var _a;
    const errorMsgEle = $(`#${element.id}Msg`)[0];
    const resetErrorMsg = ((_a = element
        .getAttribute("custom-validation")) === null || _a === void 0 ? void 0 : _a.includes("isRequired:true"))
        ? "*"
        : "";
    function setError(msg) {
        if (errorMsgEle) {
            errorMsgEle.textContent = msg;
        }
        element.style.border = "1px solid red";
        return false;
    }
    function resetField() {
        if (errorMsgEle) {
            errorMsgEle.textContent = resetErrorMsg || "";
        }
        element.style.border = "1px solid black";
        return true;
    }
    function isRequired() {
        if (element.value.trim() === "") {
            return setError("*Required");
        }
        return resetField();
    }
    function isPattern(pattern) {
        const regex = new RegExp(pattern, "g");
        if (!regex.test(element.value)) {
            const errorMsg = element.getAttribute("error-message");
            return setError(errorMsg !== null && errorMsg !== void 0 ? errorMsg : "*Not valid");
        }
        return resetField();
    }
    function isMaxLength(value) {
        const maxLength = parseInt(value, 10);
        if (element.value.length > maxLength) {
            return setError(`*Max length - ${value} chars.`);
        }
        return resetField();
    }
    function validateRadio(value) {
        const radioElements = value.split(",").map((item) => $(`#${item}`)[0]);
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
