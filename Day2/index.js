document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();

  $("#btnSubmitForm")[0].addEventListener("click", (event) => {
    event.preventDefault();
    validateForm(event.target.getAttribute("action"));
  });

  $("#btnAddNew")[0].addEventListener("click", (event) => {
    event.preventDefault();
    $("#userForm")[0].reset();
    $("#btnSubmitForm")[0].setAttribute("action", 0);
    $("#btnSubmitForm")[0].value = "Submit";
  });
  // $("#userForm")[0].addEventListener("reset", () => {
  //   $("#filename")[0].textContent = "";
  // });

  $("[custom-validation]").forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      elementValidation(inputElement);
    });
  });

  // $("#docResume")[0].addEventListener("change", (event) => {
  //   elementValidation(event.target);
  // });

  $("#colorPicker")[0].addEventListener("input", (event) => {
    $(".form-heading-graphic").forEach((item) => {
      item.style.backgroundColor = event.target.value;
    });
  });
});

function elementValidation(element) {
  const validator = Validator(element);
  const requiredValidations = element
    .getAttribute("custom-validation")
    .split("|");
  return requiredValidations.every((validation) => {
    let [validationFunc, validationParam] = validation.split(":");
    return validator[validationFunc](validationParam);
  });
}

function validateForm(action) {
  let elements = $("[custom-validation]");
  let isValid = true;
  elements.forEach((ele) => {
    if (!elementValidation(ele)) {
      isValid = false;
    }
  });
  if (isValid) {
    if (action == 0) {
      addDetails();
    } else {
      editDetails(action);
    }
    fetchUsers();
    $("#userForm")[0].reset();
  }
}

function fetchUsers() {
  let userList = JSON.parse(localStorage.getItem("userList")) ?? [];
  $(".row-group")[0].innerHTML = "";
  if (userList.length) {
    userList.forEach((user) => {
      $(".row-group")[0].innerHTML += generateUserRow(user);
    });
  } else {
    $(".row-group")[0].innerHTML =
      "<div class='error-message'>No user found, add one</div>";
  }
}

function generateUserRow(user) {
  return `<div class="row">
              <div class="table-element">${
                user.firstName + " " + user.lastName
              }</div>
              <div class="table-element">${user.email}</div>
              <div class="table-element">${user.gender}</div>
              <div class="table-element">${user.dateOfBirth}</div>
              <div class="table-element">${user.domain}</div>
              <div class="table-element">${user.phone}</div>
              <div class="table-element">
                <button onClick=handleEdit(${
                  user.id
                })><i class="fa-solid fa-pen"></i></button>
                <button onClick=handleDelete(${
                  user.id
                })><i class="fa-solid fa-trash"></i></button>            
              </div>
          </div> `;
}

function handleEdit(id) {
  let userList = JSON.parse(localStorage.getItem("userList"));
  let user = userList.find((user) => user.id == id);
  $("[name]").forEach((element) => {
    if (element.type == "radio") {
      element.checked = element.id == user[element.name];
    } else {
      element.value = user[element.name];
    }
  });
  $("#btnSubmitForm")[0].setAttribute("action", id);
  $("#btnSubmitForm")[0].value = "Edit";
}

function handleDelete(id) {
  let userList = JSON.parse(localStorage.getItem("userList"));
  userList = userList.filter((user) => user.id != id);
  localStorage.setItem("userList", JSON.stringify(userList));
  fetchUsers();
}

function getUserFromForm(id) {
  const userObj = { id: id };
  $("[name]:not(meta)").forEach((element) => {
    if (element.type == "radio") {
      if (element.checked) {
        userObj[element.name] = element.id;
      }
    } else {
      userObj[element.name] = element.value;
    }
  });
  return userObj;
}

function addDetails() {
  let userList = JSON.parse(localStorage.getItem("userList")) ?? [];
  let userId = userList.length ? userList[userList.length - 1].id + 1 : 1;
  let userObj = getUserFromForm(userId);
  userList.push(userObj);
  localStorage.setItem("userList", JSON.stringify(userList));
}

function editDetails(userId) {
  let userList = JSON.parse(localStorage.getItem("userList"));
  let userObj = getUserFromForm(userId);
  userList = userList.map((user) => (user.id == userObj.id ? userObj : user));
  localStorage.setItem("userList", JSON.stringify(userList));
}
