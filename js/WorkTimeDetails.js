
function CreateTable(data) {
    let table = "";
    let content = "";
    let details = data[0];

    if (details != null && details != undefined) {
        table = `
            <table userLastName="${details.lastName}" class="userDetailsTable hip-item show text-center ">
            <caption style="caption-side: top;text-align: center;color: #000;">
                <h4 class="header">
                    ${details.userId} ${details.firstName} ${details.lastName}
                </h4>
            </caption>    
            <thead>
                <tr>
                    <th class="text-center d-none">کد پرسنلی</th>
                    <th class="text-center d-none">نام</th>
                    <th class="text-center d-none">نام خانوادگی</th>
                    <th class="text-center">روز</th>
                    <th class="text-center">تاریخ</th>
                    <th class="text-center">ساعت ورود و خروج</th>
                    <th>
                        <div class="text-center d-flex justify-content-center">
                            <button class="addNewRow btn btn-primary btn-sm ml-2" userId = "${details.userId}" firstName = "${details.firstName}" lastName = "${details.lastName}">اضافه کردن</button>
                            <button class="saveUserTableData btn btn-warning btn-sm" >
                                ذخیره تغییرات <i class="fa fa-check" style="display:none;"></i>
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
        `;

        data = data.sort((a, b) => (a["date"] > b["date"]) ? true : false);

        data.forEach(element => {

            let times = element["workTime"].filter(item => item);
            times = times.sort((a, b) => (a > b) ? true : false);
            let strTime = "";
            times.forEach(t => {
                strTime += t + "-";
            });

            if ((times.filter(item => item).length % 2) == 0) {
                content += `
                    <tr>
                        <td class="info_id d-none">${element["userId"]}</td>
                        <td class="info_name d-none">${element["firstName"]}</td>
                        <td class="info_family d-none">${element["lastName"]}</td>
                        <td class="info_day">${element["day"]}</td>
                        <td class="info_date">${element["date"]}</td>
                        <td dir="ltr" class="info_time">
                            ${strTime.substring(0, strTime.length - 1)}
                        </td>
                        <td>
                            <div class="btn-group pull-right">
                                <button type="button" class="WTT_EditRowBtn btn btn-sm btn-info rounded ml-2 ">ویرایش</button>
                                <button type="button" class="WTT_RemoveRowBtn btn btn-sm btn-outline-danger rounded">حذف</button>
                                <button type="button" class="WTT_UpdateRowBtn btn btn-sm btn-success rounded ml-2" style="display:none;">بروزرسانی</button>
                                <button type="button" class="WTT_CancelEditRowBtn btn btn-sm btn-secondary rounded" style="display:none;">لغوکردن</button>
                            </div>
                        </td>
                    </tr>
                `;
            }
            else {
                content += `
                    <tr class="hasProblem">
                        <td class="info_id d-none">${element["userId"]}</td>
                        <td class="info_name d-none">${element["firstName"]}</td>
                        <td class="info_family d-none">${element["lastName"]}</td>
                        <td class="info_day">${element["day"]}</td>
                        <td class="info_date">${element["date"]}</td>
                        <td dir="ltr" class="info_time">
                            ${strTime}
                        </td>
                        <td>
                            <div class="btn-group pull-right">
                                <button type="button" class="WTT_EditRowBtn btn btn-sm btn-info rounded ml-2 ">ویرایش</button>
                                <button type="button" class="WTT_RemoveRowBtn btn btn-sm btn-outline-danger rounded">حذف</button>
                                <button type="button" class="WTT_UpdateRowBtn btn btn-sm btn-success rounded ml-2" style="display:none;">بروزرسانی</button>
                                <button type="button" class="WTT_CancelEditRowBtn btn btn-sm btn-secondary rounded" style="display:none;">لغوکردن</button>
                            </div>
                        </td>
                    </tr>
                `;
            }

        });
        table += content;
        table += `
            </tbody>
            </table>
        `;
        $("#allUserTable").append(table);
    }
}

$("body").on("click", ".addNewRow", function () {
    let userId = $(this).attr("userId");
    let firstName = $(this).attr("firstName");
    let lastName = $(this).attr("lastName");
    let content = "";
    content = `
       <tr>
            <td class="d-none">${userId}</td>
            <td class="d-none">${firstName}</td>
            <td class="d-none">${lastName}</td>
            <td style="max-width: 130px;">
                <input name="day" type="text" class="form-control"/>   
            </td>
            <td style="max-width: 130px;">
                <input name="date" type="text" class="form-control"/>   
            </td>
            <td style="max-width: 250px;">
                <div class = "d-flex justify-content-center align-items-center">
                    <input name="workTime" type="text" class="ml-1 form-control"/>   
                    <input name="workTime" type="text" class="ml-1 form-control"/>  
                    <a class = "addTimeToNewRow rounded-circle text-white bg-info d-inline-block px-2 py-1 ml-1" ><i class = "fa fa-plus"></i></a>
                </div>
            </td>
            <td>
                <button class="saveRowToTable btn btn-sm btn-success ">ذخیره</button> 
                <button class="cancelAddRowToTable btn btn-sm btn-danger ">لغو</button> 
            </td>
       </tr>
    `;
    $(this).closest(".userDetailsTable").find("tbody").append(content);

});

$(document).on("click", ".WTT_EditRowBtn", function () {
    let day = $(this).closest("tr").find(".info_day");
    let date = $(this).closest("tr").find(".info_date");
    let time = $(this).closest("tr").find(".info_time");

    let dayVal = $.trim(day.text());
    let dateVal = $.trim(date.text());
    let timeVal = $.trim(time.text());

    day.html(`<input type="text" name="day" class="form-control" value="${dayVal}" />`);
    date.html(`<input dir="ltr" type="text" name="date" class="form-control" value="${dateVal}" />`);
    time.html(`<input dir="ltr" type="text" name="time" class="form-control" value="${timeVal}" />`);

    $(this).hide();
    $(this).siblings(".WTT_RemoveRowBtn").hide();
    $(this).siblings(".WTT_UpdateRowBtn").show();
    $(this).siblings(".WTT_CancelEditRowBtn").show();

});

$(document).on("click", ".WTT_CancelEditRowBtn", function () {
    let day = $(this).closest("tr").find(".info_day");
    let date = $(this).closest("tr").find(".info_date");
    let time = $(this).closest("tr").find(".info_time");

    let dayVal = $.trim(day.find("input").val());
    let dateVal = $.trim(date.find("input").val());
    let timeVal = $.trim(time.find("input").val());

    day.html(dayVal);
    date.html(dateVal);
    time.html(timeVal);

    $(this).hide();
    $(this).siblings(".WTT_UpdateRowBtn").hide();
    $(this).siblings(".WTT_RemoveRowBtn").show();
    $(this).siblings(".WTT_EditRowBtn").show();

});

$(document).on("click", ".WTT_UpdateRowBtn", function () {
    let day = $(this).closest("tr").find(".info_day");
    let date = $(this).closest("tr").find(".info_date");
    let time = $(this).closest("tr").find(".info_time");

    let dayVal = $.trim(day.find("input[name='day']").val());
    let dateVal = $.trim(date.find("input[name='date']").val());
    let timeVal = $.trim(time.find("input[name='time']").val());

    if (timeVal.split("-").filter(item => item).length % 2 == 0) {
        $(this).closest("tr").removeClass("hasProblem");
    }

    day.html(dayVal);
    date.html(dateVal);
    time.html(timeVal);

    $(this).hide();
    $(this).siblings(".WTT_CancelEditRowBtn").hide();
    $(this).siblings(".WTT_RemoveRowBtn").show();
    $(this).siblings(".WTT_EditRowBtn").show();

    $(this).closest("table").find(".saveUserTableData").removeClass("btn-success").addClass("btn-warning").find("i").hide();
    $("#SaveAllUsersData").addClass("btn-outline-success").removeClass("btn-success").find("i").hide();
});

$(document).on("click", ".WTT_RemoveRowBtn", function () {
    $(this).closest("tr").remove();
});

$(document).on("click", ".saveRowToTable", function () {
    let userId = $(this).closest(".userDetailsTable").find("tbody tr").eq(0).find("td").eq(0).text();
    let firstName = $(this).closest(".userDetailsTable").find("tbody tr").eq(0).find("td").eq(1).text();
    let lastName = $(this).closest(".userDetailsTable").find("tbody tr").eq(0).find("td").eq(2).text();
    let day = $.trim($(this).closest("tr").find("input[name='day']").val());
    let date = $.trim($(this).closest("tr").find("input[name='date']").val());
    let times = "";

    $.each($(this).closest("tr").find("input[name='workTime']"), function (index, item) {
        if ($.trim(item.value) != "") {
            times += ("-" + item.value)
        }
    });

    if (day != "" && date != "" && times != "--") {
        let content = `
            <tr>
                <td class="info_id d-none">${userId}</td>
                <td class="info_name d-none">${firstName}</td>
                <td class="info_family d-none">${lastName}</td>
                <td class="info_day">${day}</td>
                <td class="info_date">${date}</td>
                <td class="info_time">
                    ${times.slice(1)}
                </td>
                <td>
                    <div class="btn-group pull-right">
                        <button type="button" class="WTT_EditRowBtn btn btn-sm btn-info rounded ml-2 ">ویرایش</button>
                        <button type="button" class="WTT_RemoveRowBtn btn btn-sm btn-outline-danger rounded">حذف</button>
                        <button type="button" class="WTT_UpdateRowBtn btn btn-sm btn-success rounded ml-2" style="display:none;">بروزرسانی</button>
                        <button type="button" class="WTT_CancelEditRowBtn btn btn-sm btn-secondary rounded" style="display:none;">لغوکردن</button>
                    </div>
                </td>
            </tr>
        `;

        $(this).closest("tbody").append(content);
        $(this).closest("tr").remove();
    }
    else {
        toastr.error("مقادیر وارد نشده است", null, toastOption);
        //alert("مقادیر وارد نشده است");
    }
});

$(document).on("click", ".cancelAddRowToTable", function () {
    $(this).closest("tr").remove();
});

$(document).on("click", ".addTimeToNewRow", function () {
    let content = `
        <div class= "d-flex jestify-content-center align-items-center mx-1 mb-2 ml-5">
            <input name="workTime" type="text" class="  d-block form-control"/>   
            <input name="workTime" type="text" class="mr-1 d-block form-control"/>  
        </div>
    `;
    $(this).closest("td").append(content);

});

$(document).on("click", ".saveUserTableData", function (e) {
    e.preventDefault();
    let array = [];
    $(this).closest(".userDetailsTable").find("tbody tr").each(function () {
        let object = {
            firstName: null,
            lastName: null,
            day: null,
            entryDate: null,
            startTime: null,
            leavingDate: null,
            exitTime: null
        };
        object.firstName = $(this).find(".info_name").text();
        object.lastName = $(this).find(".info_family").text();
        object.day = $(this).find(".info_day").text();
        object.entryDate = $(this).find(".info_date").text();
        object.leavingDate = $(this).find(".info_date").text();

        let time = $.trim($(this).find(".info_time").text()).split("-");
        time = time.sort((a, b) => {
            if (Number(a.split(":")[0] + a.split(":")[1]) >= Number(b.split(":")[0] + b.split(":")[1])) {
                return 1;
            } else {
                return -1;
            }
        });
        if (time.length == 2) {
            object.startTime = time[0];
            object.exitTime = time[1];
            array.push(object);
        } else {
            for (let i = 0; i < (time.length / 2); i++) {
                let newObject = { ...object };
                newObject.startTime = time[i * 2];
                newObject.exitTime = time[(i * 2) + 1];
                array.push(newObject);
                newObject = {};
            }
        }
    });
    let userId = $(this).closest(".userDetailsTable").find("tbody tr").eq(0).find("td").eq(0).text();
    let finalObject = { UserId: "", Data: "" };

    classifiedData = classifiedData.filter(item => {
        return item.UserId != userId
    });

    finalObject.UserId = userId;
    finalObject.Data = array;
    classifiedData.push(finalObject);

    $(this).find("i").show();
    $(this).removeClass("btn-warning").addClass("btn-success");
});



function UpdateWorkInfoTable(data) {
    let table = "";
    let content = "";
    let workInfo = data.WorkInfo;
    let userId = data.UserId;
    let firstName = data.FirstName;
    let lastName = data.LastName;

    table = `
            <table userLastName="${lastName}" class="userDetailsTable hip-item show text-center ">
            <caption style="caption-side: top;text-align: center;color: #000;">
                <h4 class="header">
                    ${userId} ${firstName} ${lastName}
                </h4>
            </caption>    
            <thead>
                <tr>
                    <th class="text-center d-none">کد پرسنلی</th>
                    <th class="text-center d-none">نام</th>
                    <th class="text-center d-none">نام خانوادگی</th>
                    <th class="text-center">روز</th>
                    <th class="text-center">تاریخ</th>
                    <th class="text-center">ساعت ورود و خروج</th>
                    <th>
                        <div class="text-center d-flex justify-content-center">
                            <button class="addNewRow btn btn-primary btn-sm ml-2" userId = "${userId}" firstName = "${firstName}" lastName = "${lastName}">اضافه کردن</button>
                            <button class="saveUserTableData btn btn-warning btn-sm" >
                                ذخیره تغییرات <i class="fa fa-check" style="display:none;"></i>
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
    `;

    workInfo = workInfo.sort((a, b) => (a["date"] > b["date"]) ? true : false);

    workInfo.forEach(element => {
        let times = element.Time.split("-").filter(item => item);
        times = times.sort((a, b) => (a > b) ? true : false);
        let strTime = "";
        times.forEach(t => {
            strTime += t + "-";
        });

        if ((times.filter(item => item).length % 2) == 0) {
            content += `
                <tr>
                    <td class="info_id d-none">${userId}</td>
                    <td class="info_name d-none">${firstName}</td>
                    <td class="info_family d-none">${lastName}</td>
                    <td class="info_day">${element.Day}</td>
                    <td class="info_date">${element.Date}</td>
                    <td dir="ltr" class="info_time">${strTime.substring(0, strTime.length - 1)}</td>
                    <td>
                        <div class="btn-group pull-right">
                            <button type="button" class="WTT_EditRowBtn btn btn-sm btn-info rounded ml-2 ">ویرایش</button>
                            <button type="button" class="WTT_RemoveRowBtn btn btn-sm btn-outline-danger rounded">حذف</button>
                            <button type="button" class="WTT_UpdateRowBtn btn btn-sm btn-success rounded ml-2" style="display:none;">بروزرسانی</button>
                            <button type="button" class="WTT_CancelEditRowBtn btn btn-sm btn-secondary rounded" style="display:none;">لغوکردن</button>
                        </div>
                    </td>
                </tr>
            `;
        }
        else {
            content += `
                <tr class="hasProblem">
                    <td class="info_id d-none">${userId}</td>
                    <td class="info_name d-none">${firstName}</td>
                    <td class="info_family d-none">${lastName}</td>
                    <td class="info_day">${element.Day}</td>
                    <td class="info_date">${element.Date}</td>
                    <td dir="ltr" class="info_time">${strTime}</td>
                    <td>
                        <div class="btn-group pull-right">
                            <button type="button" class="WTT_EditRowBtn btn btn-sm btn-info rounded ml-2 ">ویرایش</button>
                            <button type="button" class="WTT_RemoveRowBtn btn btn-sm btn-outline-danger rounded">حذف</button>
                            <button type="button" class="WTT_UpdateRowBtn btn btn-sm btn-success rounded ml-2" style="display:none;">بروزرسانی</button>
                            <button type="button" class="WTT_CancelEditRowBtn btn btn-sm btn-secondary rounded" style="display:none;">لغوکردن</button>
                        </div>
                    </td>
                </tr>
            `;
        }

    });

    table += content;
    table += `</tbody></table>`;

    $("#allUserTable").append(table);
}


function SaveEditedDataInDB() {
    let finalData = [];
    let tables = $("#allUserTable table.userDetailsTable");

    $.each(tables, function (index, table) {
        let tableRow = $(table).find("tbody tr");
        let workData = [];

        $.each(tableRow, function (index, row) {
            let obj = {
                Day: $.trim($(row).find("td.info_day").text()),
                Date: $.trim($(row).find("td.info_date").text()),
                Time: $.trim($(row).find("td.info_time").text()),
            };
            workData.push(obj);
        });

        let finalObj = {
            UserId: $.trim($(tableRow).eq(0).find("td.info_id").text()),
            FirstName: $.trim($(tableRow).eq(0).find("td.info_name").text()),
            LastName: $.trim($(tableRow).eq(0).find("td.info_family").text()),
            WorkInfo: workData
        }

        finalData.push(finalObj);
    });

    $('#SaveEmployeeWorkInfoModal').modal('hide');

    $.ajax({
        type: "POST",
        url: "/Employees/SaveEmployeesWorkInfo",
        data: {
            dateLabel: NowMonth,
            data: JSON.stringify(finalData),
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
            toastr.error(err.message, null, toastOption);
        },
    });
}


$("#SaveAllUsersData").click(function (e) {
    e.preventDefault();
    $(this).removeClass("btn-outline-success");
    $(this).addClass("btn-success");
    $(this).find("i").show();
    $(".saveUserTableData").trigger("click");
});


$("#SaveEmployeeWorkInfoBtn").click(function (e) {
    e.preventDefault();
    SaveEditedDataInDB();
});

$("#LoadEmployeeWorkInfoBtn").click(function (e) {
    e.preventDefault();
    $('#LoadEmployeeWorkInfoModal').modal('hide');
    $.ajax({
        type: "GET",
        url: "/Employees/GetEmployeesWorkInfo",
        data: { dateLabel: NowMonth },
        beforeSend: function () {
            $("#CustomLoading").show();
        },
        complete: function () {
            $("#CustomLoading").hide();
        },
        success: function (response) {
            if (response.status == "Succeed") {
                FillWorkInfoData(JSON.parse(response.data));
            }
            else {
                toastr.error(response.message, null, toastOption);
            }
        },
        error: function (err) {
            toastr.error(err.message, null, toastOption);
        },
    });

    function FillWorkInfoData(data) {
        let workInfo = data;

        $("#WorkTimeTableContainer").html("");
        $("#WorkTimeTableContainer").html('<div id="allUserTable" style="overflow-x:auto;" class="hip-grid"></div>');

        workInfo.forEach(item => {
            UpdateWorkInfoTable(item);
        });

        $("#allUserTable").hip({
            itemsPerPage: 1,
            itemsPerRow: 1
        });

        $("#SaveAllUsersData").addClass("btn-outline-success").removeClass("btn-success").find("i").hide();

        toastr.success("اطلاعات با استفاده از آخرین فایل ذخیره شده در سامانه بازنشانی شد", null, toastOption);
    }
});