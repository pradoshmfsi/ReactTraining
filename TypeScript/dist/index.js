"use strict";
document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    ($("#btnSubmitForm")[0]).addEventListener("click", (event) => {
        event.preventDefault();
        validateForm(event.target.getAttribute("action"));
    });
    ($("#userForm")[0]).addEventListener("reset", () => {
        resetUserForm();
    });
    $("[custom-validation]").forEach((inputElement) => {
        inputElement.addEventListener("input", () => {
            elementValidation(inputElement);
        });
    });
    $("#colorPicker")[0].addEventListener("input", (event) => {
        const target = event.target;
        $(".form-heading-graphic").forEach((item) => {
            item.style.backgroundColor = target.value;
        });
    });
    $("#btnConfirmModal")[0].addEventListener("click", (event) => {
        handleDelete(event.target.getAttribute("userId"));
    });
});
function resetUserForm() {
    $(".form-heading-text")[0].innerText = "Register";
    $("#btnSubmitForm")[0].setAttribute("action", "0");
    $("#btnSubmitForm")[0].value = "Submit";
}
function elementValidation(element) {
    var _a;
    const validator = Validator(element);
    const requiredValidations = ((_a = element.getAttribute("custom-validation")) === null || _a === void 0 ? void 0 : _a.split("|")) || [];
    return requiredValidations.every((validation) => {
        let [validationFunc, validationParam] = validation.split(":");
        return validator[validationFunc](validationParam);
    });
}
function validateForm(action) {
    const elements = $("[custom-validation]");
    let isValid = true;
    elements.forEach((ele) => {
        if (!elementValidation(ele)) {
            isValid = false;
        }
    });
    if (isValid) {
        if (action === "0") {
            addDetails();
            customAlert("User added successfully");
        }
        else {
            editDetails(Number(action));
            customAlert("User edited successfully");
        }
        fetchUsers();
        $("#userForm")[0].reset();
    }
}
function fetchUsers() {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    $(".row-group")[0].innerHTML = "";
    if (userList.length) {
        userList.forEach((user) => {
            $(".row-group")[0].innerHTML += generateUserRow(user);
        });
    }
    else {
        $(".row-group")[0].innerHTML =
            "<div class='error-message'>No user found, add one</div>";
    }
}
function generateUserRow(user) {
    return `<div class="row">
                <div class="table-element">${user.firstName + " " + user.lastName}</div>
                <div class="table-element">${user.email}</div>
                <div class="table-element">${user.gender}</div>
                <div class="table-element">${user.dateOfBirth}</div>
                <div class="table-element">${user.domain}</div>
                <div class="table-element">${user.phone}</div>
                <div class="table-element">
                  <button onClick=handleEdit(${user.id})><i class="fa-solid fa-pen"></i></button>
                  <button onClick=showConfirmModal(${user.id})><i class="fa-solid fa-trash"></i></button>            
                </div>
            </div>`;
}
function handleEdit(id) {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const user = userList.find((user) => user.id == id);
    $("[name]").forEach((element) => {
        const inputElement = element;
        if (inputElement.type == "radio") {
            inputElement.checked = inputElement.id == user[inputElement.name];
        }
        else {
            inputElement.value = user[inputElement.name];
        }
    });
    $(".form-heading-text")[0].innerText = "Edit";
    $("#btnSubmitForm")[0].setAttribute("action", id.toString());
    $("#btnSubmitForm")[0].value = "Edit";
}
function handleDelete(id) {
    if (!id)
        return;
    let userList = JSON.parse(localStorage.getItem("userList") || "[]");
    userList = userList.filter((user) => user.id != Number(id));
    localStorage.setItem("userList", JSON.stringify(userList));
    $(".modal")[0].style.display = "none";
    fetchUsers();
}
function showConfirmModal(id) {
    var _a;
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userName = ((_a = userList.find((user) => user.id == id)) === null || _a === void 0 ? void 0 : _a.firstName) || '';
    $(".modal")[0].style.display = "flex";
    $(".modal-body")[0].textContent = `Are you sure you want to delete user '${userName}'.`;
    $("#btnConfirmModal")[0].setAttribute("userId", id.toString());
}
function getUserFromForm(id) {
    const userObj = { id };
    $("[name]:not(meta)").forEach((element) => {
        const inputElement = element;
        if (inputElement.type == "radio") {
            if (inputElement.checked) {
                userObj[inputElement.name] = inputElement.id;
            }
        }
        else {
            userObj[inputElement.name] = inputElement.value;
        }
    });
    return userObj;
}
function addDetails() {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userId = userList.length ? userList[userList.length - 1].id + 1 : 1;
    const userObj = getUserFromForm(userId);
    userList.push(userObj);
    localStorage.setItem("userList", JSON.stringify(userList));
}
function editDetails(userId) {
    let userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userObj = getUserFromForm(userId);
    userList = userList.map((user) => (user.id == userObj.id ? userObj : user));
    localStorage.setItem("userList", JSON.stringify(userList));
}
function customAlert(msg) {
    const alert = $(".alert")[0];
    alert.textContent = msg;
    alert.classList.add("show");
    setTimeout(() => {
        alert.classList.remove("show");
    }, 3000);
}
