document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
  
    ($("#btnSubmitForm")[0]).addEventListener("click", (event: Event) => {
      event.preventDefault();
      validateForm((event.target as HTMLElement).getAttribute("action"));
    });
  
    ($("#userForm")[0]).addEventListener("reset", () => {
      resetUserForm();
    });
  
    ($("[custom-validation]") as NodeListOf<HTMLInputElement>).forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        elementValidation(inputElement);
      });
    });
  
    ($("#colorPicker")[0] as HTMLInputElement).addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      $(".form-heading-graphic").forEach((item) => {
        (item as HTMLElement).style.backgroundColor = target.value;
      });
    });
  
    ($("#btnConfirmModal")[0] as HTMLElement).addEventListener("click", (event: Event) => {
      handleDelete((event.target as HTMLElement).getAttribute("userId"));
    });
  });
  
  function resetUserForm(): void {
    ($(".form-heading-text")[0] as HTMLElement).innerText = "Register";
    ($("#btnSubmitForm")[0] as HTMLInputElement).setAttribute("action", "0");
    ($("#btnSubmitForm")[0] as HTMLInputElement).value = "Submit";
  }
  
  function elementValidation(element: HTMLInputElement): boolean {
    const validator = Validator(element);
    const requiredValidations = element.getAttribute("custom-validation")?.split("|") || [];
    return requiredValidations.every((validation) => {
      let [validationFunc, validationParam] = validation.split(":");
      return (validator as any)[validationFunc](validationParam);
    });
  }
  
  function validateForm(action: string | null): void {
    const elements = $("[custom-validation]");
    let isValid = true;
    elements.forEach((ele) => {
      if (!elementValidation(ele as HTMLInputElement)) {
        isValid = false;
      }
    });
    if (isValid) {
      if (action === "0") {
        addDetails();
        customAlert("User added successfully");
      } else {
        editDetails(Number(action));
        customAlert("User edited successfully");
      }
      fetchUsers();
      ($("#userForm")[0] as HTMLFormElement).reset();
    }
  }
  
  function fetchUsers(): void {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    ($(".row-group")[0] as HTMLElement).innerHTML = "";
    if (userList.length) {
      userList.forEach((user: any) => {
        ($(".row-group")[0] as HTMLElement).innerHTML += generateUserRow(user);
      });
    } else {
      ($(".row-group")[0] as HTMLElement).innerHTML =
        "<div class='error-message'>No user found, add one</div>";
    }
  }
  
  function generateUserRow(user: any): string {
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
  
  function handleEdit(id: number): void {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const user = userList.find((user: any) => user.id == id);
    $("[name]").forEach((element) => {
      const inputElement = element as HTMLInputElement;
      if (inputElement.type == "radio") {
        inputElement.checked = inputElement.id == user[inputElement.name];
      } else {
        inputElement.value = user[inputElement.name];
      }
    });
    ($(".form-heading-text")[0] as HTMLElement).innerText = "Edit";
    ($("#btnSubmitForm")[0] as HTMLInputElement).setAttribute("action", id.toString());
    ($("#btnSubmitForm")[0] as HTMLInputElement).value = "Edit";
  }
  
  function handleDelete(id: string | null): void {
    if (!id) return;
    let userList = JSON.parse(localStorage.getItem("userList") || "[]");
    userList = userList.filter((user: any) => user.id != Number(id));
    localStorage.setItem("userList", JSON.stringify(userList));
    ($(".modal")[0] as HTMLElement).style.display = "none";
    fetchUsers();
  }
  
  function showConfirmModal(id: number): void {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userName = userList.find((user: any) => user.id == id)?.firstName || '';
    ($(".modal")[0] as HTMLElement).style.display = "flex";
    ($(".modal-body")[0] as HTMLElement).textContent = `Are you sure you want to delete user '${userName}'.`;
    ($("#btnConfirmModal")[0] as HTMLElement).setAttribute("userId", id.toString());
  }
  
  function getUserFromForm(id: number): any {
    const userObj: any = { id };
    $("[name]:not(meta)").forEach((element) => {
      const inputElement = element as HTMLInputElement;
      if (inputElement.type == "radio") {
        if (inputElement.checked) {
          userObj[inputElement.name] = inputElement.id;
        }
      } else {
        userObj[inputElement.name] = inputElement.value;
      }
    });
    return userObj;
  }
  
  function addDetails(): void {
    const userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userId = userList.length ? userList[userList.length - 1].id + 1 : 1;
    const userObj = getUserFromForm(userId);
    userList.push(userObj);
    localStorage.setItem("userList", JSON.stringify(userList));
  }
  
  function editDetails(userId: number): void {
    let userList = JSON.parse(localStorage.getItem("userList") || "[]");
    const userObj = getUserFromForm(userId);
    userList = userList.map((user: any) => (user.id == userObj.id ? userObj : user));
    localStorage.setItem("userList", JSON.stringify(userList));
  }
  
  function customAlert(msg: string): void {
    const alert = $(".alert")[0] as HTMLElement;
    alert.textContent = msg;
    alert.classList.add("show");
    setTimeout(() => {
      alert.classList.remove("show");
    }, 3000);
  }
  