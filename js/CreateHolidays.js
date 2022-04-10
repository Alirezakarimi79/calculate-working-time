const toastOption = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-left",
    "preventDuplicates": false,
    "onclick": "null",
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "7000",
    "extendedTimeOut": "5000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "show",
    "hideMethod": "hide",
    // iconClasses: {
    //     error: 'toast-error',
    //     info: 'toast-info',
    //     success: 'toast-success',
    //     warning: 'toast-warning'
    // },
}

let finalObject = { Name: "", FirstFriday : "" , Data: [] };
let list = document.querySelector('.list');
let yearInput = document.querySelector('#year');
let monthInput = document.querySelector('#month');
let dayInput = document.querySelector('#day');

function removeDate(thisItem) {
    thisItem.closest("li").remove();
    let remove = thisItem.closest("li").attr("date");

    var removedIndex = finalObject.Data.findIndex(item => item == remove);

    finalObject.Data = finalObject.Data.filter(function (item, index) {
        return index !== removedIndex;
    });
}

function Confirmation() {
    let year = Number(yearInput.value).toString();
    let month = Number(monthInput.value).toString();
    if (year.length == 4) {
        let template;
        if (1 <= Number(month) && Number(month) <= 12) {
            if (month.length != 2) {
                let newMonth = "0" + month;
                template = year + "/" + newMonth;
            } else {
                template = year + "/" + month;
            }
            finalObject.Name = template;
            $("#year").attr("disabled", "true");
            $("#month").attr("disabled", "true");
            $("#editInputDisabledBtn").show();
            $("#day").show();
            $("#confirmBtn").show();
            $("#confirm").hide();

        } else {
            toastr.error("ماه انتخاب شده نا معتبر است", null, toastOption);
        }
    } else {
        toastr.error(`سال انتخاب شده نا معتبر است <br/> نمونه صحیح: 1400/01/01`, null, toastOption);
    }
}

$("#editInputDisabledBtn").click(function (e) {
    e.preventDefault();
    $("#day").hide();
    $("#confirmBtn").hide();
    $("#year").removeAttr("disabled");
    $("#month").removeAttr("disabled");
    $("#confirm").show();
    $(this).hide();
});


function AddNewDate() {
    let year = Number(yearInput.value).toString();
    let month = Number(monthInput.value).toString();
    let day = Number(dayInput.value).toString();

    if (year.length == 4) {
        let template;
        let newTemplate;
        if (1 <= Number(month) && Number(month) <= 12) {
            if (1 <= Number(day) && Number(day) <= 31) {
                if (month.length != 2) {
                    let newMonth = "0" + month;
                    template = year + "/" + newMonth;
                    if (day.length != 2) {
                        let newDay = "0" + day;
                        newTemplate = year + "/" + newMonth + "/" + newDay;
                    }
                    else {
                        newTemplate = year + "/" + newMonth + "/" + day;
                    }
                } else {
                    template = year + "/" + month;
                    newTemplate = year + "/" + month + "/" + day;
                }
                finalObject.Name = template;
                finalObject.Data.push(newTemplate);
                list.innerHTML += "<li date='" + newTemplate + "' class='px-3 mb-2 d-inline-block' style='font-size: 18px'>" + newTemplate + " <i onclick='removeDate($(this))' class='fa fa-times text-danger' style='cursor: pointer; font-size: 16px' ></i></li>";
            } else {
                toastr.error("روز انتخاب شده نا معتبر است", null, toastOption)
            }
        } else {
            toastr.error("ماه انتخاب شده نا معتبر است", null, toastOption)
        }
    } else {
        toastr.error(`سال انتخاب شده نا معتبر است <br/> نمونه صحیح: 1400/01/01`, null, toastOption)
    }
}

$("#confirmBtn").click(function (e) {
    e.preventDefault();
    AddNewDate()
});


$(document).on('keypress', function (e) {
    if (e.which == 13) {
        AddNewDate();
    }
});

$("#SaveHolidaysInDbBtn").click(function (e) {
    e.preventDefault();
    let dates = "";

    let array = finalObject.Data.sort(function (a, b) {
        if (a >= b) {
            return 1;
        }
        else {
            return -1;
        }
    });

    $.each(array, function (index, value) {
        dates += ("-" + value);
    });

    $("#DateLabel").attr("value", finalObject.Name);
    $("#FirstFriday").attr("value", finalObject.FirstFriday);
    $("#HolidaysDates").attr("value", dates.substring(1));

    $("#SaveHolidaysForm").submit();
});

$("#EditHolidaysInDbBtn").click(function (e) {
    e.preventDefault();
    let dates = "";

    let array = finalObject.Data.sort(function (a, b) {
        if (a >= b) {
            return 1;
        }
        else {
            return -1;
        }
    });

    $.each(array, function (index, value) {
        dates += ("-" + value);
    });

    $("#DateLabel").attr("value", finalObject.Name);
    $("#FirstFriday").attr("value", finalObject.FirstFriday);
    $("#HolidaysDates").attr("value", dates.substring(1));

    $("#EditHolidaysForm").submit();
});


let fridayInput = $("#friday");

$("#confirmFirdayBtn").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#editInputFridayDisabledBtn").show();
    fridayInput.attr("disabled", "disabled");
    finalObject.FirstFriday = fridayInput.val();
});



$("#editInputFridayDisabledBtn").click(function (e) {
    e.preventDefault();
    $("#confirmFirdayBtn").show();
    fridayInput.removeAttr("disabled");
    $(this).hide();
    fridayInput.empty();
    finalObject.FirstFriday = "";
});