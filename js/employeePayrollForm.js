class EmployeePayrollData {
    id;

    get name() {
        return this._name;
    }

    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
        if (nameRegex.test(name)) {
            this._name = name;
        }
        else throw 'Name is incorrect!';
    }

    get profilePic() {
        if (this._profilePic == undefined) {
            return "Profile Pic None!!";
        }
        return this._profilePic;
    }

    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }

    get salary() {
        return this._salary;
    }

    set salary(salary) {
        let salaryRegex = RegExp('^[1-9]{1}[0-9]{0,}$');
        if (salaryRegex.test(salary)) {
            this._salary = salary;
        }
        else throw 'Salary is incorrect';
    }

    get gender() {
        return this._gender;
    }

    set gender(gender) {
        this._gender = gender;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(startDate) {
        let now = new Date();
        if (startDate > now)
            throw 'Start date is a future date.';

        var diff = Math.abs(now.getTime() - startDate.getTime());

        if (diff / (1000 * 60 * 60 * 24) > 30)
            throw 'Start date is beyond 30 days!!';
        this._startDate = startDate;
    }

    get departments() {
        return this._departments;
    }

    set departments(departments) {
        if (departments == undefined) {
            departments.push("None");
            this._departments = departments;
        }
        this._departments = departments;
    }

    get note() {
        if (this._note == undefined) {
            return "Note None!!";
        }
        return this._note;
    }

    set note(note) {
        this._note = note;
    }

    toString() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const empDate = this.startDate === undefined ? "undefined" :
            this.startDate.toLocaleDateString("en-US", options);
        return "id: " + this.id + ", name: " + this.name + ", profile Pic: " + this.profilePic + ", salary: " + this.salary + ", gender: "
            + this.gender + ", startDate: " + empDate + ", departments: " + this.departments + ", note: " + this.note;
    }
}

let isUpdate = false;
let empPayrollObj = {};

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
        setEmployeePayrollObject();
        if (site_properties.use_local_storage.match("true")) {
            createAndUpdateStorage();
            resetForm();
            window.location = "../pages/home.html";
        } else {
            createOrUpdateEmployeePayroll();
        }
    } catch (e) {
        return;
    }
}

const createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if (isUpdate) {
        methodCall = "PUT";
        postURL = postURL + empPayrollObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, empPayrollObj)
        .then(responseText => {
            resetForm();
            window.location = "../pages/home.html";
        })
        .catch(error => {
            throw error;
        });
}

const setEmployeePayrollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        empPayrollObj.id = createNewEmployeeId();
    }
    empPayrollObj._name = getInputValueById('#name');
    empPayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    empPayrollObj._gender = getSelectedValues('[name=gender]').pop();
    empPayrollObj._departments = getSelectedValues('[name=departments]');
    empPayrollObj._salary = getInputValueById('#salary');
    empPayrollObj._note = getInputValueById('#notes');

    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
    empPayrollObj._startDate = date;
}

function createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(empData => empData.id == empPayrollObj.id);
        if (!empPayrollData) {
            employeePayrollList.push(empPayrollObj);
        } else {
            const index = employeePayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, empPayrollObj);
        }

    } else {
        employeePayrollList = [empPayrollObj];
    }
    alert("Local Storage Updated Successfully!\nTotal Employees : " + employeePayrollList.length);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    if (empID == undefined) {
        empID = 0;
    }
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if (item.checked) setItems.push(item.value);
    });
    return setItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

window.addEventListener('DOMContentLoaded', (event) => {

    //event listener for date validation!!!!
    const date = document.querySelector('#date');
    const dateTextError = document.querySelector('.date-text-error');

    date.addEventListener('input', function () {
        let startDate = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
        try {
            checkStartDate(new Date(Date.parse(startDate)));
            dateTextError.textContent = "";
        } catch (e) {
            dateTextError.textContent = e;
        }
    });

    //event listener for name validation!!!!
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    const textErrorNew = document.querySelector('.text-error-new');

    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            textError.textContent = "";
            return;
        }

        try {
            checkName(name.value);
            textError.textContent = "";
            textErrorNew.textContent = "Fine!!";
        } catch (e) {
            textErrorNew.textContent = "";
            textError.textContent = e;
        }
    });

    //event listener for salary range bar!!!!
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });

    checkForUpdate();
});

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    empPayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name', empPayrollObj._name);
    setSelectedValues('[name=profile]', empPayrollObj._profilePic);
    setSelectedValues('[name=gender]', empPayrollObj._gender);
    setSelectedValues('[name=departments]', empPayrollObj._departments);
    setValue('#salary', empPayrollObj._salary);
    setTextValue('.salary-output', empPayrollObj._salary);
    setValue('#notes', empPayrollObj._note);
    let date = stringifyDate(empPayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=departments]');
    setValue('#salary', '');
    setValue('#notes', '');
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
}

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value === value) item.checked = true;
    });
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}