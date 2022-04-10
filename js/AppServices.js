
/* -------------------- Start Global Function -------------------- */
function ArrayDifference(array1, array2) {
    let array = [],
        difference = [];
    for (let i = 0; i < array1.length; i++) {
        array[array1[i]] = true;
    }
    for (let i = 0; i < array2.length; i++) {
        if (array[array2[i]]) {
            delete array[array2[i]];
        } else {
            array[array2[i]] = true;
        }
    }
    for (let k in array) {
        difference.push(k);
    }
    return difference;
}

function DifferenceInMinute(entranceTime, leavingTime) {
    let entranceMinute;
    let leavingMinute;
    let ArrivalTime = String(entranceTime).split(":");
    let ExitTime = String(leavingTime).split(":");
    entranceMinute = (parseInt(ArrivalTime[0]) * 60) + parseInt(ArrivalTime[1]);
    leavingMinute = (parseInt(ExitTime[0]) * 60) + parseInt(ExitTime[1]);
    return (leavingMinute - entranceMinute);
};

function DifferenceInHours(entranceTime, leavingTime) {
    let entranceMinute;
    let leavingMinute;
    let ArrivalTime = String(entranceTime).split(":");
    let ExitTime = String(leavingTime).split(":");
    entranceMinute = (parseInt(ArrivalTime[0]) * 60) + parseInt(ArrivalTime[1]);
    leavingMinute = (parseInt(ExitTime[0]) * 60) + parseInt(ExitTime[1]);
    let newHour = parseInt((leavingMinute - entranceMinute)) / 60;
    let newMinute = Math.abs((leavingMinute - entranceMinute) % 60);
    return Math.trunc(newHour) + ":" + newMinute;
};

function MinuteToHour(minute) {
    let newHour = parseInt(minute) / 60;
    let newMinute = Math.abs(minute % 60);
    return Math.trunc(newHour) + ":" + newMinute;
}

function HourToMinute(hour) {
    let ArrivalTime = String(hour).split(":");
    let newHour = parseInt(ArrivalTime[0]) * 60;
    let newMinute = parseInt(ArrivalTime[1]);
    return Math.trunc((newHour) + newMinute);
}

function TotalHours(entranceTime, leavingTime) {
    let entranceMinute;
    let leavingMinute;
    let ArrivalTime = String(entranceTime).split(":");
    let ExitTime = String(leavingTime).split(":");
    entranceMinute = (parseInt(ArrivalTime[0]) * 60) + parseInt(ArrivalTime[1]);
    leavingMinute = (parseInt(ExitTime[0]) * 60) + parseInt(ExitTime[1]);
    let newHour = parseInt((leavingMinute + entranceMinute)) / 60;
    let newMinute = Math.abs((leavingMinute + entranceMinute) % 60);
    return Math.trunc(newHour) + ":" + newMinute;
};

function RepeatedInformation(Data, SelectedField) {
    let data = Data;
    let arrayInput = [];
    let toFindDuplicates;
    let duplicateElements;
    let uniqueList = [];
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            arrayInput.push(data[i][SelectedField]);
            toFindDuplicates = arrayInput => arrayInput.filter((item, index) => arrayInput.indexOf(item) !== index)
            duplicateElements = toFindDuplicates(arrayInput);
        };
        if (duplicateElements != null) {
            uniqueList = duplicateElements.filter((c, index) => {
                return duplicateElements.indexOf(c) === index;
            });
        }
    }
    return uniqueList;
}

function ConvertToUniqueList(Data) {
    let data = Data;
    let uniqueList = [...new Set(data)];
    return uniqueList;
}

function DataWithoutDuplication(Data, SelectedField) {
    let data = Data;
    let array = [];
    let newArray = [];
    if (data != null) {
        data.forEach(element => {
            array.push(element[SelectedField]);
        });
    }
    newArray = ArrayDifference(array, RepeatedInformation(data, SelectedField));
    return newArray;
}

/* -------------------- End Global Function -------------------- */