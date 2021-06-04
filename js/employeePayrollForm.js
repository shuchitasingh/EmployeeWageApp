class EmployeePayrollData {

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

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
        if (this._gender == undefined) {
            this._gender = "m";
        } else {
            let genderRegex = RegExp('^[a-zA-Z]{1}$');
            if (genderRegex.test(gender)) this._gender = gender;
            else throw 'Gender is incorrect';
        }
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(startDate) {
        if (startDate == undefined) {
            this._startDate = new Date();
        } else {
            this._startDate = startDate;
        }
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
        this._id = 1;
        return "id: " + this.id + ", name: " + this.name + ", profile Pic: " + this.profilePic + ", salary: " + this.salary + ", gender: "
            + this.gender + ", startDate: " + empDate + ", departments: " + this.departments + ", note: " + this.note;
    }
}

const save = () => {
    try {
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
    } catch (e) {
        return;
    }
}

function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData];
    }
    alert("Local Storage Updated Successfully!\nTotal Employees : " + employeePayrollList.length);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));

}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.departments = getSelectedValues('[name=departments]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');

    let month = getInputValueById('#month');
    if (month == "Jan") month = 1;
    if (month == "Feb") month = 2;
    if (month == "Mar") month = 3;
    if (month == "Apr") month = 4;
    if (month == "May") month = 5;
    if (month == "June") month = 6;
    if (month == "July") month = 7;
    if (month == "Aug") month = 8;
    if (month == "Sep") month = 9;
    if (month == "Oct") month = 10;
    if (month == "Nov") month = 11;
    if (month == "Dec") month = 12;

    let startDate = new Date(getInputValueById('#year'), month - 1, getInputValueById('#day'));
    if (dateCheck(getInputValueById('#day'), getInputValueById('#month'), getInputValueById('#year'))) {
        employeePayrollData.startDate = startDate;
        alert(employeePayrollData.toString());
        return employeePayrollData;
    } else {
        alert("Correct details");
    }
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

function nameCheckRegex(name) {
    let result = true;
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if (!(nameRegex.test(name))) {
        alert("Name incorrect");
        result = false;
    }
    return result;
}

function dateCheck(day, month, year) {
    let result = true;

    if (month == "Feb" && year == "2020" || month == "Feb" && year == "2016") {
        if (day > 29) {
            alert("date invalid!");
            result = false;
            return result;
        }
    }

    if (month == "Feb") {
        if (day > 28) {
            alert("date invalid!");
            result = false;
            return result;
        }
    }

    if (month == "Apr" || month == "June" || month == "Oct" || month == "Nov") {
        if (day > 30) {
            alert("date invalid!");
            result = false;
            return result;
        }
    }

    return result;
}


window.addEventListener('DOMContentLoaded', (event) => {

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
            new EmployeePayrollData().name = name.value;
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
});

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=departments]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#month', 'January');
    setValue('#year', '2020');
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