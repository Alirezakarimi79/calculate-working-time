
let errors = [];
let errors_UserNotFound = [];

let NowMonth = "";
let classifiedData = [];
let oldClassifiedData = [];
let classifiedVacationData = [];
let monthWorkTime = [];
let finalResult = [];
let detailesData = [];
let newVacationDB = [];
let oldVacationDB = [];
let dataFinalResult = [];
let arrayHoliday = [];
let arrayUserWorkTime = [];
let userWorkDaysArray = [];
let excelUsersIdArray = [];

let jsDateTime = new Date();



GetUserWorkTimeFromDatabase();

function GetHolidaysFromDatabase(dateLabel) {
    $.ajax({
        type: "GET",
        url: "/Holidays/GetHolidaysByDateLabel",
        data: { dateLabel: dateLabel.toString() },
        success: function (response) {
            if (response.status == "Succeed") {

                CalculateHolidays(response.data.dateLabel, response.data.firstFriday, response.data.holidaysDates);
            }
            else {
                toastr.error(response.message, null, toastOption);
            }
        },
        error: function (err) {
            toastr.error(err, null, toastOption);
        },
    });
}

function GetUserWorkTimeFromDatabase() {
    $.ajax({
        type: "GET",
        url: "/Employees/GetEmployeesWorkTime",
        data: {},
        success: function (response) {
            if (response.status == "Succeed") {

                arrayUserWorkTime = [];
                response.data.forEach(item => {
                    arrayUserWorkTime.push(item);
                    newVacationDB.push({
                        UserId: item.id,
                        Estehghaghi: item.timeOfEstehghaghi,
                        Estelagi: item.timeOfEstelagi
                    });

                    oldVacationDB.push({
                        UserId: item.id,
                        Estehghaghi: item.timeOfEstehghaghi,
                        Estelagi: item.timeOfEstelagi
                    });
                });
            }
            else {
                toastr.error(response.message, null, toastOption);
            }
        },
        error: function (err) {
            toastr.error(err, null, toastOption);
        },
    });
}

function CalculateHolidays(dateLabel, firstFriday, holidays) {

    arrayHoliday = [];

    let firstFr = firstFriday.substring(8);

    for (var i = Number(firstFr); i <= 31; i = i + 7) {
        let obj = { date: "", type: "جمعه" }

        if (i < 10) {
            obj.date = dateLabel + "/0" + i.toString();
            arrayHoliday.push(obj);
        }
        else {
            obj.date = dateLabel + "/" + i.toString();
            arrayHoliday.push(obj);
        }
    }


    //arrayHoliday.forEach(element => {
    //    if (element.type == "جمعه") {
    //        let thursday = { date: "", type: "پنجشنبه" };
    //        let day = Number(element.date.slice(8, 10)) - 1;

    //        if (day > 0) {
    //            if (day < 10) {
    //                thursday.date = element.date.slice(0, 8) + "0" + day;
    //                arrayHoliday.push(thursday);
    //            }
    //            else {
    //                thursday.date = element.date.slice(0, 8) + day;
    //                arrayHoliday.push(thursday);
    //            }
    //        }
    //    }
    //});

    let holidaysArray = holidays.split("-");


    holidaysArray.forEach(item => {
        let holiday = { date: "", type: "تعطیل رسمی" };
        let finded = arrayHoliday.find(el => el.date == item);

        if (finded == null) {
            holiday.date = item;
            arrayHoliday.push(holiday);
        }
    });

    arrayUserWorkTime.forEach(item => {
        let obj = {
            UserId: item[userWorkTime.id],
            Data: UserMonthWorkDate(item[userWorkTime.id])
        };

        userWorkDaysArray.push(obj);
    });
}

function GetUserDataByUserId(userId) {
    let data;
    classifiedData.forEach(item => {
        if (item["UserId"] == userId) {
            data = item["Data"];
        }
    });
    return data;
};

function GetInitialDataByUserId(userId) {
    let data;
    oldClassifiedData.forEach(item => {
        if (item["UserId"] == userId) {
            data = item["Data"];
        }
    });
    return data;
};

function GetUserVacationByUserId(userId) {
    let data;
    classifiedVacationData.forEach(item => {
        if (item["UserId"] == userId) {
            data = item["Data"];
        }
    });
    return data;
};

document.getElementById('excelFile').addEventListener("change", (event) => {
    ExportMainData(event.target.files[0]);
})

$("#vacationFile").change(function () {
    ExportVacationData(event.target.files[0]);
});

function ExportMainData(excelFile) {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;

    if (regex.test($("#excelFile").val().toLowerCase())) {
        var xlsxflag = false;
        if ($("#excelFile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }

        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;

                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }


                let SheetLastRow = workbook.Sheets.Sheet1["!ref"].split(':')[1];
                let SheetLenght = Number(SheetLastRow.substring(1));

                let usersIdArray = [];
                let StratUserIdCell = 7;

                for (let u = StratUserIdCell; u < SheetLenght; u += 71) {
                    let UserID = workbook.Sheets.Sheet1["K" + u.toString()].w;
                    usersIdArray.push(UserID);
                }

                excelUsersIdArray = usersIdArray;

                let userNumber = usersIdArray.length;
                let finalArray = [];
                const increment = 71;

                for (let i = 0; i < userNumber; i++) {
                    let StratCell = 10 + (i * increment);
                    let EndCell = StratCell + 64;
                    let userIdCellNumber = Number(Number(StratCell) - 3).toString()
                    let UserIdCell = "K" + userIdCellNumber;
                    let FirstNameCell = "J" + userIdCellNumber;
                    let LastNameCell = "H" + userIdCellNumber;

                    let userId = workbook.Sheets.Sheet1[UserIdCell];
                    let firstName = workbook.Sheets.Sheet1[FirstNameCell];
                    let lastName = workbook.Sheets.Sheet1[LastNameCell];


                    for (let j = StratCell; j < EndCell; j++) {
                        let day = workbook.Sheets.Sheet1["K" + Number(j).toString()];

                        if (day != undefined) {
                            let dateV = workbook.Sheets.Sheet1["I" + Number(j).toString()];
                            let dateK = workbook.Sheets.Sheet1["F" + Number(j).toString()];
                            let timeV = workbook.Sheets.Sheet1["H" + Number(j).toString()];
                            let timeK = workbook.Sheets.Sheet1["E" + Number(j).toString()];

                            let dateV_Value = "";
                            let dateK_Value = "";
                            let timeV_Value = "";
                            let timeK_Value = "";

                            if (dateV != undefined) {
                                dateV_Value = dateV.w;
                            }

                            if (dateK != undefined) {
                                dateK_Value = dateK.w;
                            }
                            else {
                                dateK_Value = dateV.w
                            }

                            if (timeV != undefined) {
                                timeV_Value = timeV.w;
                            }
                            if (timeK != undefined) {
                                timeK_Value = timeK.w;
                            }

                            let obj = {
                                id: userId.w,
                                firstName: firstName.v,
                                lastName: lastName.v,
                                day: day.w,
                                entryDate: dateV_Value,
                                leavingDate: dateK_Value,
                                startTime: timeV_Value,
                                exitTime: timeK_Value
                            }

                            finalArray.push(obj);
                        }
                    }
                }

                InitialInformation(finalArray);
                NowMonth = finalArray[0].entryDate.substring(0, 7);

                GetHolidaysFromDatabase(finalArray[0].entryDate.substring(0, 7));
            }

            if (xlsxflag) {
                reader.readAsArrayBuffer(excelFile);
            }
            else {
                reader.readAsBinaryString(excelFile);
            }
        }
        else {
            alert("مرورگر شما HTML5 را پشتیبانی نمیکند لطفا از مرورگری دیگر استفاده کنید");
        }
    }
    else {
        alert("فقط میتوانید فایل اکسل وارد کنید");
    }
}

function UserMonthWorkDate(userId) {
    let yearDate = NowMonth;
    let UserId = userId;
    let monthDate = yearDate.substring(5, 7);
    let finish = [];

    if (Number(monthDate) <= 6) {
        for (let i = 1; i <= 31; i++) {
            let item;
            let flag = 0;
            if (i < 10) {
                item = NowMonth + "/" + "0" + i;
            } else {
                item = NowMonth + "/" + i;
            }

            let finded = arrayHoliday.find(el => el.date == item.toString());

            if (finded != null) {
                flag = 1;
            }

            if (flag == 0) {
                finish.push(item);
            }
        }

    } else {
        for (let i = 1; i <= 30; i++) {
            let item;
            let flag = 0;
            if (i < 10) {
                item = NowMonth + "/" + "0" + i;
            } else {
                item = NowMonth + "/" + i;
            }

            let finded = arrayHoliday.find(el => el.date == item.toString());

            if (finded != null) {
                flag = 1;
            }

            if (flag == 0) {
                finish.push(item);
            }
        }
    }

    let array = [];
    let workDays = arrayUserWorkTime.find(el => el[userWorkTime.id] == UserId).workDays;
    let workDaysArray = workDays.split("-");


    finish.forEach(element => {
        let day = GetDayOfWeekByDate(element);
        let findedDay = workDaysArray.find(item => item == day);

        if (findedDay != null) {
            array.push(element);
        }
    });

    return array;
}

function GetDayOfWeekByDate(date) {
    let day = moment.from(date, 'fa', 'YYYY/MM/DD')["_i"].substring(0, 10);
    let finded = new Date(day);
    let findDay = finded.getDay();
    switch (findDay) {
        case 0:
            return workDay[0]
        case 1:
            return workDay[1]
        case 2:
            return workDay[2]
        case 3:
            return workDay[3]
        case 4:
            return workDay[4]
        case 5:
            return workDay[5]
        case 6:
            return workDay[6]
    }
}

function ExportVacationData(selectedFile) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
        let excelJson;
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        let sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function (y) {
            excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
            excelJson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
            UserVacation(excelJson);
        });
    }
}

function AllUsersId() {
    let data = arrayUserWorkTime;
    let newArray = [];
    data.forEach(element => {
        newArray.push(element.id)
    });
    let arrayId = ConvertToUniqueList(newArray);
    return arrayId;
}

function UserInformation(Data) {
    let data = Data;
    let usersId = AllUsersId();
    usersId.forEach(element => {
        let userData = [];
        data.forEach(item => {
            if (element == item[present.id]) {
                userData.push(item)
            }
        });
        let newObj = { UserId: element, Data: userData }
        classifiedData.push(newObj);
    });
}

function InitialInformation(Data) {
    let data = Data;
    let usersId = AllUsersId();
    usersId.forEach(element => {
        let userData = [];
        data.forEach(item => {
            if (element == item[present.id]) {
                userData.push(item)
            }
        });
        let newObj = { UserId: element, Data: userData }
        oldClassifiedData.push(newObj);
    });


    // هشدار به کاربر برای کاربرانی که در اکسل ساعت زنی وجود دارند ولی در اطلاعات کارمندان ثبت نشده اند
    let notFoundedUser = ArrayDifference(excelUsersIdArray, usersId);

    notFoundedUser.forEach(item => {
        let existInDB = usersId.find(u => u == item);

        if (existInDB == null) {
            errors_UserNotFound.push(`کارمند با شماره ی ${item} در اطلاعات کارمندان یافت نشد`);

            let content = `
                <span dir="rtl" class="d-block alert alert-danger">
                    کارمند با شماره ی ${item} در اطلاعات کارمندان یافت نشد
                </span>
            `;

            $("#ExcelErrorsModal_ErrContainer").append(content);
        }
    });

    if (errors_UserNotFound.length <= 0) {
        $("#ShowExcelErrors").hide();
    }

    $("#ShowExcelErrors small").html(errors_UserNotFound.length);
}

function UserVacation(Data) {
    let data = Data;
    let usersId = AllUsersId();
    usersId.forEach(element => {
        let userData = [];
        data.forEach(item => {
            if (item[vacation.id].indexOf(element) > 0) {
                if (item[vacation.confirmed] == "بله") {
                    userData.push(item);
                }
            }
        });
        let newObj = { UserId: element, Data: userData }
        classifiedVacationData.push(newObj);
    });
}

function getUserWorkTimeByUserId(userId) {
    let data = [];
    if (data != null) {
        data = { StartTime: "", ExitTime: "" };
        arrayUserWorkTime.forEach(item => {
            if (item[userWorkTime.id] == userId) {
                data.StartTime = item[userWorkTime.startTime];
                data.ExitTime = item[userWorkTime.exitTime];
            }
        });
    }
    return data;
}

function getUserConsumedVacationByUserId(userId) {
    let data = { TimeOfEstelagi: "", TimeOfEstehghaghi: "" };
    newVacationDB.forEach(item => {
        if (item.UserId == userId) {
            data.TimeOfEstelagi = item.Estelagi;
            data.TimeOfEstehghaghi = item.Estehghaghi;
        }
    });
    return data;
}

function ChangeRemainingVacation(userId, type, amount) {
    let finded = newVacationDB.find(item => item.UserId == userId);

    let obj = {
        UserId: userId,
        Estelagi: finded.Estelagi,
        Estehghaghi: finded.Estehghaghi,
    }

    let total;

    if (type == vacationType.estehghaghi) {
        total = Number(finded.Estehghaghi) - Number(amount);
        obj.Estehghaghi = total.toString();
    }

    if (type == vacationType.estelagi) {
        total = Number(finded.Estelagi) - Number(amount);
        obj.Estelagi = total.toString();
    }

    newVacationDB = newVacationDB.filter(item => item.UserId != userId);
    newVacationDB.push(obj);
}

function IsUserWorkDay(date, userId) {

    let userHolidays = userWorkDaysArray.find(el => el.UserId == userId).Data.find(item => item == date);
    if (userHolidays != null) {
        return true;
    }
    else {
        return false;
    }
}

function Presence(userId) {
    let data = GetUserDataByUserId(userId);
    if (data != null) {
        let newArray = [];
        let repeatedDate = RepeatedInformation(data, present.entryDate);
        let doNotRepeat = DataWithoutDuplication(data, present.entryDate);
        let totalTimeInDay = [];
        let totalInMonth = 0;

        data.forEach(item => {
            let exist = false;
            let object = { Day: "", TotalTime: "" }
            let total = 0;
            doNotRepeat.forEach(element => {
                if (element == item[present.entryDate]) {
                    object.Day = item[present.entryDate];
                    total = DifferenceInMinute(item[present.startTime], item[present.exitTime])
                    object.TotalTime = total;
                    totalTimeInDay.push(object);
                }
            });
            repeatedDate.forEach(element => {
                let object = { Day: "", TotalTime: "" }
                let total = 0;
                if (!exist) {
                    if (element == item[present.entryDate]) {
                        object.Day = element;
                        total = DifferenceInMinute(item[present.startTime], item[present.exitTime])
                        object.TotalTime = total;
                        newArray.push(object);
                    }
                }
            });
        });

        let repeated = RepeatedInformation(newArray, "Day");
        repeated.forEach(item => {
            let totalInRepeated = 0;
            newArray.forEach(element => {
                if (element["Day"] == item) {
                    totalInRepeated += element["TotalTime"];
                }
            });
            let Obj = { Day: item, TotalTime: totalInRepeated }
            totalTimeInDay.push(Obj);
        });

        let objectPresence = { UserId: "", Data: "" };
        objectPresence.UserId = userId;
        objectPresence.Data = totalTimeInDay;

        totalTimeInDay.forEach(element => {
            totalInMonth += element["TotalTime"];
        });
        return {
            totalInMonth: totalInMonth,
            dailyTime: totalTimeInDay
        }
    }

    return null;
}

function OverTime(userId) {
    let totalTimeInDay = [];
    let newArray = [];
    let holidayArray = [];
    let data = GetUserDataByUserId(userId);
    let holidayDateExist = false;

    if (data != null) {
        let specifiedTime = getUserWorkTimeByUserId(userId);
        let repeatedDate = RepeatedInformation(data, present.entryDate);
        let doNotRepeat = DataWithoutDuplication(data, present.entryDate);

        data.forEach(item => {
            let exist = false;
            let total = 0;
            let object = { Day: "", TotalTime: 0 };
            doNotRepeat.forEach(element => {
                if (element == item[present.entryDate]) {
                    if (!IsUserWorkDay(item[present.entryDate], userId)) {
                        object.Day = item[present.entryDate];
                        object.TotalTime = DifferenceInMinute(item[present.startTime], item[present.exitTime]);
                        totalTimeInDay.push(object);
                    }
                    else {
                        object.Day = item[present.entryDate];
                        if (HourToMinute(item[present.startTime]) < HourToMinute(specifiedTime["StartTime"])) {
                            total = DifferenceInMinute(item[present.startTime], specifiedTime["StartTime"]);
                            object.TotalTime = total;
                        }
                        if (HourToMinute(item[present.exitTime]) > HourToMinute(specifiedTime["ExitTime"])) {
                            total = DifferenceInMinute(specifiedTime["ExitTime"], item[present.exitTime]);
                            object.TotalTime += total;
                        }
                        totalTimeInDay.push(object);
                    }
                }
            });
            repeatedDate.forEach(element => {
                let sum = 0;
                if (element == item[present.entryDate]) {
                    if (!exist) {
                        if (!IsUserWorkDay(item[present.entryDate], userId)) {
                            if (!holidayDateExist) {
                                object.Day = item[present.entryDate];
                                sum = DifferenceInMinute(item[present.startTime], item[present.exitTime]);
                                object.TotalTime = sum;
                                holidayArray.push(object);
                                holidayDateExist = true;
                            } else {
                                sum = DifferenceInMinute(item[present.startTime], item[present.exitTime]);
                                holidayArray[0].TotalTime += sum;
                                totalTimeInDay.push(holidayArray[0]);
                            }
                        } else {
                            object.Day = element;
                            if (HourToMinute(item[present.startTime]) < HourToMinute(specifiedTime["StartTime"])) {
                                sum = DifferenceInMinute(item[present.startTime], specifiedTime["StartTime"]);
                                object.TotalTime += sum;
                            }
                            if (HourToMinute(item[present.exitTime]) > HourToMinute(specifiedTime["ExitTime"])) {
                                if (HourToMinute(item[present.startTime]) > HourToMinute(specifiedTime["ExitTime"])) {
                                    sum += DifferenceInMinute(item[present.startTime], item[present.exitTime]);
                                } else {
                                    sum += DifferenceInMinute(specifiedTime["ExitTime"], item[present.exitTime]);
                                }
                                object.TotalTime += sum;
                            }
                            newArray.push(object);
                        }
                    }
                }
            });
        });
        let repeated = RepeatedInformation(newArray, "Day");
        repeated.forEach(item => {
            let totalInRepeated = 0;
            newArray.forEach(element => {
                if (element["Day"] == item) {
                    totalInRepeated += element["TotalTime"];
                }
            });
            let Obj = { Day: item, TotalTime: totalInRepeated }
            totalTimeInDay.push(Obj);
        });
        let totalOverTimeInMonth = 0;
        totalTimeInDay.forEach(element => {
            totalOverTimeInMonth += element["TotalTime"];
        });
        let objectOver = { UserId: "", Data: "" };
        objectOver.UserId = userId;
        objectOver.Data = totalTimeInDay;

        return {
            totalInMonth: totalOverTimeInMonth,
            dailyTime: totalTimeInDay
        }
    }
    return null;
}

function LaborDeficit(userId) {
    let newArrayLabor = [];
    let totalTimeInDay = [];
    let newArray = [];
    // let absence = Absence(userId);
    let data = GetUserDataByUserId(userId);

    if (data != null) {
        let specifiedTime = getUserWorkTimeByUserId(userId);
        let repeatedDate = RepeatedInformation(data, present.entryDate);
        let doNotRepeat = DataWithoutDuplication(data, present.entryDate);
        let sub = DifferenceInMinute(specifiedTime["StartTime"], specifiedTime["ExitTime"]);

        data.forEach(item => {
            let exist = false;
            let total = 0;
            let object = { Day: "", TotalTime: 0 };
            doNotRepeat.forEach(element => {
                if (element == item[present.entryDate]) {
                    if (IsUserWorkDay(item[present.entryDate], userId)) {
                        object.Day = item[present.entryDate];
                        if (HourToMinute(item[present.startTime]) > HourToMinute(specifiedTime["StartTime"])) {
                            total = DifferenceInMinute(specifiedTime["StartTime"], item[present.startTime]);
                            object.TotalTime = total;
                        }

                        if (HourToMinute(item[present.exitTime]) < HourToMinute(specifiedTime["ExitTime"])) {
                            total = DifferenceInMinute(item[present.exitTime], specifiedTime["ExitTime"]);
                            object.TotalTime += total;
                        }
                        totalTimeInDay.push(object);
                    }
                }
            });
            repeatedDate.forEach(element => {
                let sum = 0;
                if (element == item[present.entryDate]) {
                    if (IsUserWorkDay(item[present.entryDate], userId)) {
                        if (!exist) {
                            object.Day = element;
                            if (HourToMinute(item[present.startTime]) <= HourToMinute(specifiedTime["StartTime"])) {
                                if (HourToMinute(item[present.exitTime]) > HourToMinute(specifiedTime["StartTime"])) {
                                    sum = DifferenceInMinute(specifiedTime["StartTime"], item[present.exitTime]);
                                    object.TotalTime += sum;
                                }
                            }
                            if (HourToMinute(item[present.startTime]) > HourToMinute(specifiedTime["StartTime"])) {
                                if (HourToMinute(item[present.exitTime]) < HourToMinute(specifiedTime["ExitTime"])) {
                                    sum += DifferenceInMinute(item[present.startTime], item[present.exitTime]);
                                    object.TotalTime += sum;
                                }
                            }
                            if (HourToMinute(item[present.startTime]) < HourToMinute(specifiedTime["ExitTime"])) {
                                if (HourToMinute(item[present.exitTime]) >= HourToMinute(specifiedTime["ExitTime"])) {
                                    sum += DifferenceInMinute(item[present.startTime], specifiedTime["ExitTime"]);
                                    object.TotalTime += sum;
                                }
                            }
                            newArray.push(object);
                        }
                    }
                }
            });
            newArrayLabor.push(item[present.entryDate]);
        });
        let repeated = RepeatedInformation(newArray, "Day");
        if (repeated != null) {
            repeated.forEach(item => {
                let totalInRepeated = 0;
                newArray.forEach(element => {
                    if (element["Day"] == item) {
                        totalInRepeated += element["TotalTime"];
                    }
                });
                let Obj = { Day: item, TotalTime: (sub - totalInRepeated) }
                totalTimeInDay.push(Obj);
            });
        }


        let labor = userWorkDaysArray.find(el => el.UserId == userId).Data;
        newArrayLabor.forEach((element) => {
            labor = labor.filter(item => item != element);
        });

        labor.forEach(element => {
            let object = { Day: "", TotalTime: 0 };
            object.Day = element;
            object.TotalTime = sub;
            totalTimeInDay.push(object);
        });

        let totalLaborDeficitInMonth = 0;
        totalTimeInDay.forEach(element => {
            totalLaborDeficitInMonth += element["TotalTime"];
        });

        return {
            totalInMonth: totalLaborDeficitInMonth,
            dailyTime: totalTimeInDay
        }
    }
    return null;

}

function Vacations(userId) {
    let finalArray = []
    let totalVacationInMonth = {
        vacationWithoutSalaryDFO: 0,
        vacationEstelagi: 0,
        vacationEstehghaghi: 0
    }
    // let totalVacationInMonth = 0;
    let userInfo = getUserConsumedVacationByUserId(userId);
    let data = GetUserVacationByUserId(userId);
    let specifiedTime = getUserWorkTimeByUserId(userId);
    let sub = DifferenceInMinute(specifiedTime["StartTime"], specifiedTime["ExitTime"]);
    let newDailyLaborDeficit = [];
    let laborDeficit = LaborDeficit(userId);
    let overTime = OverTime(userId);
    let newLaborDeficit = { ...laborDeficit };
    let newOverTime = overTime.totalInMonth;
    if (data != null) {
        data.forEach(item => {
            newLaborDeficit.dailyTime.forEach(element => {
                let totalVacationInMonth = { date: "", data: [] };
                let dataObj = { type: "", total: "" }
                if (item[vacation.vacationDateHourly] != null) {
                    if (element.Day == item[vacation.vacationDateHourly]) {
                        switch ($.trim(item[vacation.vacationType])) {
                            case vacationType.withoutSalaryDFO:
                                totalVacationInMonth.date = element.Day;
                                dataObj.type = vacationType.withoutSalaryDFO;
                                dataObj.total = element.TotalTime;
                                totalVacationInMonth.data.push(dataObj);
                                element.TotalTime = 0;
                                break;
                            case vacationType.estelagi:
                                if (Number(userInfo.TimeOfEstelagi) >= Number(element.TotalTime)) {
                                    // از دیتا بیس مقدار مرخصی کم شود
                                    ChangeRemainingVacation(userId, vacationType.estelagi, element.TotalTime);

                                    totalVacationInMonth.date = element.Day;
                                    dataObj.type = vacationType.estelagi;
                                    dataObj.total = element.TotalTime;
                                    totalVacationInMonth.data.push(dataObj);
                                    element.TotalTime = 0;
                                } else {
                                    errors.push(` کاربر ${userId} از تمام مرخصی استعلاجی خود استفاده کرده است (${element.Day})`);
                                }
                                break;
                            case vacationType.estehghaghi:
                                if (Number(userInfo.TimeOfEstehghaghi) >= Number(element.TotalTime)) {
                                    // از دیتا بیس مقدار مرخصی کم شود
                                    ChangeRemainingVacation(userId, vacationType.estehghaghi, element.TotalTime);

                                    totalVacationInMonth.date = element.Day;
                                    dataObj.type = vacationType.estehghaghi;
                                    dataObj.total = element.TotalTime;
                                    totalVacationInMonth.data.push(dataObj);
                                    element.TotalTime = 0;
                                } else {
                                    errors.push(` کاربر ${userId} از تمام مرخصی استحقاقی خود استفاده کرده است (${element.Day})`);
                                }
                                break;
                        }
                        finalArray.push(totalVacationInMonth);
                    }
                }
                if (item[vacation.vacationStartDateDaily] != null) {
                    let userWorkTime = userWorkDaysArray.find(el => el.UserId == userId).Data;
                    userWorkTime.forEach(extend => {
                        if (item[vacation.vacationStartDateDaily] <= extend && item[vacation.vacationExitDateDaily] >= extend) {
                            if (element.Day == extend) {
                                switch (item[vacation.vacationType]) {
                                    case vacationType.withoutSalaryDFO:
                                        totalVacationInMonth.date = extend;
                                        dataObj.type = item[vacation.vacationType];
                                        dataObj.total = element.TotalTime;
                                        totalVacationInMonth.data.push(dataObj);
                                        element.TotalTime = 0;
                                        break;
                                    case vacationType.estelagi:
                                        if (Number(userInfo.TimeOfEstelagi) >= Number(element.TotalTime)) {
                                            // از دیتا بیس مقدار مرخصی کم شود
                                            ChangeRemainingVacation(userId, vacationType.estelagi, element.TotalTime);

                                            totalVacationInMonth.date = extend;
                                            dataObj.type = item[vacation.vacationType];
                                            dataObj.total = element.TotalTime;
                                            totalVacationInMonth.data.push(dataObj);
                                            element.TotalTime = 0;
                                        } else {
                                            errors.push(` کاربر ${userId} از تمام مرخصی استعلاجی خود استفاده کرده است (${element.Day})`);
                                        }
                                        break;
                                    case vacationType.estehghaghi:
                                        if (Number(userInfo.TimeOfEstehghaghi) >= Number(element.TotalTime)) {
                                            // از دیتا بیس مقدار مرخصی کم شود
                                            ChangeRemainingVacation(userId, vacationType.estehghaghi, element.TotalTime);

                                            totalVacationInMonth.date = extend;
                                            dataObj.type = item[vacation.vacationType];
                                            dataObj.total = element.TotalTime;
                                            totalVacationInMonth.data.push(dataObj);
                                            element.TotalTime = 0;
                                        } else {
                                            errors.push(` کاربر ${userId} از تمام مرخصی استحقاقی خود استفاده کرده است (${element.Day})`);
                                        }
                                        break;
                                }
                                finalArray.push(totalVacationInMonth);
                            }
                        }
                    });
                }
            });
        });
        finalArray.forEach(el => {
            el["data"].forEach(item => {
                switch (item["type"]) {
                    case vacationType.withoutSalaryDFO:
                        totalVacationInMonth.vacationWithoutSalaryDFO += item["total"]
                        break;
                    case vacationType.estelagi:
                        totalVacationInMonth.vacationEstelagi += item["total"]
                        break;
                    case vacationType.estehghaghi:
                        totalVacationInMonth.vacationEstehghaghi += item["total"]
                        break;
                }
            });
        });



        newOverTime -= totalVacationInMonth.vacationWithoutSalaryDFO;


        let laborTime = 20 * 60;
        let total = 0;
        newLaborDeficit.dailyTime.forEach(labor => {
            total += labor.TotalTime
        });
        newLaborDeficit.totalInMonth = total;
        if (Number(newLaborDeficit.totalInMonth) <= laborTime) {
            if (Number(userInfo.TimeOfEstehghaghi) >= Number(newLaborDeficit.totalInMonth)) {
                totalVacationInMonth.vacationEstehghaghi += newLaborDeficit.totalInMonth;
                // از دیتابیس مقدار مرخصی حذف شود
                ChangeRemainingVacation(userId, vacationType.estehghaghi, newLaborDeficit.totalInMonth);

                newLaborDeficit.totalInMonth = 0;
            } else {
                errors.push(` کاربر ${userId} از تمام مرخصی استحقاقی خود استفاده کرده است`);
            }
        } else {
            newLaborDeficit.totalInMonth = newLaborDeficit.totalInMonth;
        }

        return {
            finalVacation: finalArray,
            totalInMonth: totalVacationInMonth,
            newLabor: newLaborDeficit,
            newLaborInMonth: newLaborDeficit.totalInMonth,
            newOverTime: newOverTime
        };
    }
}

function DetailsData(userId) {
    let userInfoFromDB = arrayUserWorkTime.find(item => item[userWorkTime.id] == userId);
    let userInClassifiedData = classifiedData.find(item => item.UserId == userId);

    if (userInfoFromDB != null && userInClassifiedData != null) {
        let finalArray = [];
        let presence = Presence(userId);
        let overTime = OverTime(userId).dailyTime;
        let vacation = Vacations(userId);


        let id = userInfoFromDB.id;
        let firstName = userInfoFromDB.firstName;
        let lastName = userInfoFromDB.lastName;
        for (let i = 1; i <= 31; i++) {
            let date;
            if (i < 10) {
                date = NowMonth + "/" + "0" + i;
            } else {
                date = NowMonth + "/" + i;
            }
            let userInfo = {
                userId: id,
                firstName: firstName,
                lastName: lastName,
                date: date,
                totalWorkTime: null,
                overTime: null,
                laborDeficit: null,
                vacationEstelagi: null,
                vacationEstehghaghi: null,
                vacationWithoutSalaryDFO: null
            };
            let datePresence = presence.dailyTime.find(item => item.Day == date);
            if (datePresence != null) {
                userInfo.totalWorkTime = datePresence.TotalTime;
            };
            let dateOverTime = overTime.find(item => item.Day == date);
            if (dateOverTime != null) {
                userInfo.overTime = dateOverTime.TotalTime;
            };

            let dateLaborDeficit = vacation.newLabor.dailyTime.find(item => item.Day == date);
            if (dateLaborDeficit != null) {
                userInfo.laborDeficit = dateLaborDeficit.TotalTime;
            }
            let dateVacation = vacation.finalVacation.find(item => item.date == date);
            if (dateVacation != null) {
                dateVacation.data.forEach(element => {
                    switch (element.type) {
                        case vacationType.withoutSalaryDFO:
                            userInfo.vacationWithoutSalaryDFO = element.total;
                            break;
                        case vacationType.estelagi:
                            userInfo.vacationEstelagi = element.total;
                            break;
                        case vacationType.estehghaghi:
                            userInfo.vacationEstehghaghi = element.total;
                            break;
                    }
                });
            }
            if (userInfo.totalWorkTime != null || userInfo.laborDeficit != null || userInfo.vacationWithoutSalaryDFO != null ||
                userInfo.vacationEstelagi != null || userInfo.vacationEstehghaghi != null) {
                finalArray.push(userInfo)
            }
        }



        // ----------------------------------

        let uId = userInfoFromDB[userWorkTime.id];

        let finalObj = {
            UserId: uId,
            firstName: userInfoFromDB.firstName,
            lastName: userInfoFromDB.lastName,
            workType: userInfoFromDB.workType,
            totalWorkInMonth: null,
            totalOverTime: null,
            totalLaborDeficit: null,
            totalVacationEstehghaghi: null,
            totalVacationWithoutSalaryDFO: null,
            totalVacationEstelagi: null,
            LaborDeficitAfterCalculateVacations: null,
            OverTimeAfterVacationWithoutSalaryDFO: null,
            WithoutSalaryVacation: 0,
            remainingVacationEstehghaghi: null,
            remainingVacationEstelagi: null
        }

        let vacations = vacation;


        if (userInfoFromDB[userWorkTime.workType] == contractType.Contractual) {
            let vacationResult = vacations.totalInMonth;
            finalObj.totalWorkInMonth = presence.totalInMonth;
            finalObj.totalOverTime = OverTime(userInfoFromDB[userWorkTime.id]).totalInMonth;
            finalObj.totalLaborDeficit = LaborDeficit(userInfoFromDB[userWorkTime.id]).totalInMonth;
            finalObj.totalVacationWithoutSalaryDFO = vacationResult.vacationWithoutSalaryDFO;
            finalObj.totalVacationEstehghaghi = vacationResult.vacationEstehghaghi;
            finalObj.totalVacationEstelagi = vacationResult.vacationEstelagi;
            finalObj.LaborDeficitAfterCalculateVacations = vacations.newLaborInMonth;
            
            if (vacations.newOverTime < 0) {
                finalObj.OverTimeAfterVacationWithoutSalaryDFO = 0;
                finalObj.WithoutSalaryVacation = Math.abs(vacations.newOverTime);
            }
            else {
                finalObj.OverTimeAfterVacationWithoutSalaryDFO = vacations.newOverTime;
                finalObj.WithoutSalaryVacation = 0;
            }

            

            // اتصال به دیتا بیس
            let dbVacation = newVacationDB.find(item => item.UserId == userInfoFromDB[userWorkTime.id]);
            finalObj.remainingVacationEstehghaghi = dbVacation.Estehghaghi;
            finalObj.remainingVacationEstelagi = dbVacation.Estelagi;
        }
        else if (userInfoFromDB[userWorkTime.workType] == contractType.Hourly) {
            finalObj.totalWorkInMonth = presence.totalInMonth;
            finalObj.remainingVacationEstehghaghi = 0;
            finalObj.remainingVacationEstelagi = 0;
        }


        dataFinalResult = dataFinalResult.filter(item => item.UserId != finalObj.UserId);

        dataFinalResult.push(finalObj);

        // ----------------------------------



        return finalArray;
    }
    else {
        return null;
    }
}

function ShowWorkTime(userId) {
    let presenceInDay = [];
    let data = GetInitialDataByUserId(userId);
    let repeatedDate = RepeatedInformation(data, present.entryDate);
    let doNotRepeat = DataWithoutDuplication(data, present.entryDate);
    if (data != null) {
        doNotRepeat.forEach(item => {
            let objectWork = { userId: "", firstName: "", lastName: "", day: "", date: "", workTime: [] };
            let findData = data.find(element => element[present.entryDate] == item);
            if (findData != null) {
                objectWork.userId = findData[present.id];
                objectWork.firstName = findData[present.firstName];
                objectWork.lastName = findData[present.lastName];
                objectWork.day = findData[present.day];
                objectWork.date = item;
                objectWork.workTime.push(findData[present.startTime]);
                objectWork.workTime.push(findData[present.exitTime]);
                presenceInDay.push(objectWork);
            }

        });
        repeatedDate.forEach(extend => {
            let exist = false;
            let objectWorkRepeated = { userId: "", firstName: "", lastName: "", day: "", date: "", workTime: [] };
            let newArray = data.filter(el => el[present.entryDate] == extend)
            newArray.forEach(element => {
                if (!exist) {
                    objectWorkRepeated.userId = element[present.id];
                    objectWorkRepeated.firstName = element[present.firstName];
                    objectWorkRepeated.lastName = element[present.lastName];
                    objectWorkRepeated.day = element[present.day];
                    objectWorkRepeated.date = extend;
                    objectWorkRepeated.workTime.push(element[present.startTime]);
                    objectWorkRepeated.workTime.push(element[present.exitTime]);
                    exist = true;
                } else {
                    objectWorkRepeated.workTime.push(element[present.startTime]);
                    objectWorkRepeated.workTime.push(element[present.exitTime]);
                }
            });
            presenceInDay.push(objectWorkRepeated);
        });

        CreateTable(presenceInDay);
        //return presenceInDay;
    }

}


$("#showDetailsPresence").click(function (e) {
    let usersId = AllUsersId();

    usersId.forEach(item => {
        ShowWorkTime(item);
    });

    $("#allUserTable").hip({
        itemsPerPage: 1,
        itemsPerRow: 1
    });

    $("#mainSection").hide();
    $("#showDetails").show();
});


function ShowFinalResult() {
    return dataFinalResult;
}


let allDetailsTable = $("#allDetailsTable").DataTable({
    data: [],
    columns: [
        { title: "کد پرسنلی", data: "userId" },
        { title: "نام", data: "firstName" },
        { title: "نام خانوادگی", data: "lastName" },
        { title: "تاریخ", data: "date" },
        { title: "حضور", data: "totalWorkTime" },
        { title: " اضافه کار", data: "overTime" },
        { title: " کسری کار", data: "laborDeficit" },
        { title: " مرخصی استحقاقی", data: "vacationEstehghaghi" },
        { title: " مرخصی بدون حقوق کسر از اضافه کار", data: "vacationWithoutSalaryDFO" },
        { title: " مرخصی استعلاجی", data: "vacationEstelagi" },
    ],
    columnDefs: [{
        render: function (data, type, row) {
            if (data == null || data == 0) {
                return 0;
            } else {
                return MinuteToHour(data);
            }
        },
        targets: [4, 5, 6, 7, 8, 9]
    }],
    order: [
        [
            3, "asc"
        ]
    ],
    pageLength: 30,
    lengthMenu: [[5, 10, 20, 30, 50, -1], [5, 10, 20, 30, 50, "همه"]],
});
$('#allDetailsTable').wrap('<div style="overflow-x: auto;clear: both;"></div>');


$("#goToAllDetails").click(function (e) {
    e.preventDefault();

    if ($("#SaveAllUsersData").hasClass("btn-success")) {
        let showFinalResult = [];
        arrayUserWorkTime.forEach(element => {
            let finalDetails = DetailsData(element[userWorkTime.id]);
            if (finalDetails != null) {
                showFinalResult = showFinalResult.concat(finalDetails);
            }
        });


        allDetailsTable.clear();
        allDetailsTable.rows.add(showFinalResult);
        allDetailsTable.draw();


        $("#showAllDetails").slideDown();
        $("#showDetails").slideUp();


        let errContent = "";

        errors.forEach(item => {
            errContent += `
            <span dir="rtl" class="d-block alert alert-danger">
                ${item}
            </span>
        `;
        });

        $("#ShowErrors small").html(errors.length);

        $("#ErrorsModal_ErrContainer").empty();
        $("#ErrorsModal_ErrContainer").html(errContent);
    }
    else {
        toastr.warning("تغییرات ذخیره نشده است لطفا ابتدا دکمه ی ذخیره ی تغییرات همه کاربران را بزنید", null, toastOption);
    }
});

$("#returnToShowDetailsBtn").click(function (e) {
    e.preventDefault();
    allDetailsTable.clear();

    newVacationDB = [];
    newVacationDB = oldVacationDB;

    $("#showDetails").show();
    $("#showAllDetails").hide();
});



let finalResultDataTable = $("#showFinalTable").DataTable({
    data: [],
    columns: [
        { title: "کد پرسنلی", data: "UserId" },
        { title: "نام", data: "firstName" },
        { title: "نام خانوادگی", data: "lastName" },
        { title: "نوع قرارداد", data: "workType" },
        { title: "جمع ساعات حضور", data: "totalWorkInMonth" },
        { title: "جمع اضافه کار", data: "totalOverTime" },
        { title: "جمع کسری کار", data: "totalLaborDeficit" },
        { title: "جمع مرخصی استحقاقی", data: "totalVacationEstehghaghi" },
        { title: "جمع مرخصی بدون حقوق کسر از اضافه کار", data: "totalVacationWithoutSalaryDFO" },
        { title: "جمع مرخصی استعلاجی", data: "totalVacationEstelagi" },
        { title: "کسری کار بعد از محاسبه مرخصی", data: "LaborDeficitAfterCalculateVacations" },
        { title: "اضافه کار بعد از محاسبه مرخصی", data: "OverTimeAfterVacationWithoutSalaryDFO" },
        { title: "مرخصی بدون حقوق", data: "WithoutSalaryVacation" },
        { title: "مانده مرخصی استحقاقی", data: "remainingVacationEstehghaghi" },
        { title: "مانده مرخصی استعلاجی", data: "remainingVacationEstelagi" }
    ],
    columnDefs: [{
        render: function (data, type, row) {
            if (data == null || data == 0) {
                return 0;
            } else {
                return MinuteToHour(data);
            }
        },
        targets: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14]
    }],
    order: [
        [
            0, "asc"
        ]
    ],
    pageLength: 30,
    lengthMenu: [[5, 10, 20, 30, 50, -1], [5, 10, 20, 30, 50, "همه"]],
    dom: '<"top"flB>rt<"bottom"ip><"clear">',
    buttons: [
        {
            extend: 'copy',
            text: 'کپی'
        },
        {
            extend: 'print',
            text: 'چاپ',
            title: `محققان یاسین - کارکرد ماهانه`
        },
        {
            extend: 'csv',
            text: 'CSV',
            title: `کارکرد ماهانه_${jsDateTime.getFullYear()}${jsDateTime.getMonth() + 1}${jsDateTime.getDate()}`
        },
        {
            extend: 'excel',
            text: 'EXCEL',
            title: `کارکرد ماهانه_${jsDateTime.getFullYear()}${jsDateTime.getMonth()+1}${jsDateTime.getDate()}`
        },
    ],
});
$('#showFinalTable').wrap('<div style="overflow-x: auto;clear: both;"></div>');


$("#goToResultTable").click(function (e) {
    e.preventDefault();
    let showFinalResults = ShowFinalResult();


    finalResultDataTable.clear();
    finalResultDataTable.rows.add(showFinalResults);
    finalResultDataTable.draw();


    $("#showFinalResult").slideDown();
    $("#showAllDetails").slideUp();
});

$("#returnToShowFinalResultBtn").click(function (e) {
    e.preventDefault();

    newVacationDB = [];
    newVacationDB = oldVacationDB;
    $("#showAllDetails").show();
    $("#showFinalResult").hide();
});



$("#excelFile").on('change', function (e) {
    e.preventDefault();
    let files = e.originalEvent.target.files;
    if (files[0] != null) {
        HandleFileUpload(files, excelfileLabel);
        $(this).closest("div").find(".label-icon-file").removeClass("fa-folder-open").addClass("fa-folder");
    }
});

$("#vacationFile").on('change', function (e) {
    e.preventDefault();
    let files = e.originalEvent.target.files;
    if (files[0] != null) {
        HandleFileUpload(files, vacationfileLabel);
        $(this).closest("div").find(".label-icon-file").removeClass("fa-folder-open").addClass("fa-folder");
    }
});

let excelfileLabel = $("#excelFile-label");

excelfileLabel.on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
excelfileLabel.on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
excelfileLabel.on('drop', function (e) {
    e.preventDefault();
    let files = e.originalEvent.dataTransfer.files;
    HandleFileUpload(files, excelfileLabel);
    ExportMainData(files[0]);
    $(this).find(".label-icon-file").removeClass("fa-folder-open").addClass("fa-folder");
});

let vacationfileLabel = $("#vacationFile-label");
vacationfileLabel.on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
vacationfileLabel.on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
vacationfileLabel.on('drop', function (e) {
    e.preventDefault();
    let files = e.originalEvent.dataTransfer.files;
    HandleFileUpload(files, vacationfileLabel);
    ExportVacationData(files[0]);
    $(this).find(".label-icon-file").removeClass("fa-folder-open").addClass("fa-folder");

});

$(document).on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
$(document).on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
$(document).on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
});

function HandleFileUpload(files, object) {
    for (let i = 0; i < files.length; i++) {
        let fd = new FormData();
        fd.append('file', files[i]);
        let status = new createStatusbar(object);
        status.setFileNameSize(files[i].name, files[i].size);
    }
}

let rowCount = 0;
function createStatusbar(Object) {
    rowCount++;
    let row = "odd";
    if (rowCount % 2 == 0) row = "even";
    this.statusbar = $("<div></div>");
    this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
    this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
    Object.find(".ExcelFileInfo").html(this.statusbar);

    this.setFileNameSize = function (name, size) {
        let sizeStr = "";
        let sizeKB = size / 1024;
        if (parseInt(sizeKB) > 1024) {
            let sizeMB = sizeKB / 1024;
            sizeStr = sizeMB.toFixed(2) + " MB";
        }
        else {
            sizeStr = sizeKB.toFixed(2) + " KB";
        }

        this.filename.html(name);
        this.size.html(sizeStr);
    }
    // this.setProgress = function (progress) {
    //     let progressBarWidth = progress * this.progressBar.width() / 100;
    //     this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");
    //     if (parseInt(progress) >= 100) {
    //         this.abort.hide();
    //     }
    // }
    // this.setAbort = function (jqxhr) {
    //     let sb = this.statusbar;
    //     this.abort.click(function () {
    //         jqxhr.abort();
    //         sb.hide();
    //     });
    // }
}


$("#SaveRemainingVacationInDB").click(function (e) {
    e.preventDefault();

    $('#SaveRemainingVacationInDBModal').modal('hide');

    $.ajax({
        type: "POST",
        url: "/Employees/ChangeEmployeeVacation",
        data: {
            remainingVacation: JSON.stringify(newVacationDB),
            __RequestVerificationToken: $("input[name='__RequestVerificationToken']").val()
        },
        beforeSend: function () {
            $("#CustomLoading").show();
        },
        complete: function () {
            $("#CustomLoading").hide();
        },
        success: function (response) {
            if (response.status == "Succeed") {
                toastr.success(response.message, null, toastOption);
            }
            else {
                toastr.error(response.message, null, toastOption);
            }
        },
        error: function (err) {
            toastr.error("خطایی رخ داده است " + err.message, null, toastOption);
        },
    });
});