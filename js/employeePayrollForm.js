class EmployeePayrollData {

    constructor(...params) {
        this.name = params[0];
        this.salary = params[1];
        this.gender = params[2];
        this.startDate = params[3];
        this.departments = params[4];
    }

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
        let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}$');
        if (nameRegex.test(name)) {
            this._name = name;
        }
        else throw 'Name is incorrect';
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


function save() {
    let result;

    var name = document.getElementById("name").value;
    result = nameCheckRegex(name);

    var gender;
    if (document.getElementById("male").checked == true) gender = document.getElementById("male").value;
    else gender = document.getElementById("female").value;

    var salary = document.getElementById("salary").value;

    var day = document.getElementById("day").value;
    let month = document.getElementById("month").value;
    var year = document.getElementById("year").value;

    let result1 = dateCheck(day, month, year);

    let departmentArray = new Array();
    if (document.getElementById("hr").checked == true) departmentArray.push(document.getElementById("hr").value);
    if (document.getElementById("sales").checked == true) departmentArray.push(document.getElementById("sales").value);
    if (document.getElementById("finance").checked == true) departmentArray.push(document.getElementById("finance").value);
    if (document.getElementById("engineer").checked == true) departmentArray.push(document.getElementById("engineer").value);
    if (document.getElementById("others").checked == true) departmentArray.push(document.getElementById("others").value);

    if (result == false || result1 == false) alert("Correct the details!");
    else {
        alert("Details submitted successfully!!!");

        if (gender == "male") gender = "m";
        else gender = "f";

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

        let startDate = new Date(year, month - 1, day);

        let employeePayrollData = new EmployeePayrollData(name, salary, gender, startDate, departmentArray);

        var returnedValue = employeePayrollData.toString();
        alert("Populared employee payroll object : " + returnedValue);
    }
}

function nameCheckRegex(name) {
    let result = true;
    let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}$');
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