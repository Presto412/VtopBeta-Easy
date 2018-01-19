course = "";
faculty_slotname = "";
var fileRename = {};

chrome.webRequest.onCompleted.addListener(function (details) {
    var link = details["url"];
    if (link.substr(link.length - 30) == "processViewStudentCourseDetail") {
        returnMessage("CoursePageLoaded");
    }
}, {
    urls: ["*://vtopbeta.vit.ac.in/vtop/*"]
});

chrome.extension.onMessage.addListener(function (request, sender) {
    // alert("Background script has received a message from contentscript:'" + request.message + "'");
    if (request.message == "YesClearCookiePls") {
        chrome.cookies.remove({
            "url": "https://vtopbeta.vit.ac.in/vtop/",
            "name": "JSESSIONID"
        }, function () {
            chrome.tabs.getSelected(null, function (tab) {
                var code = 'window.location.reload();';
                chrome.tabs.executeScript(tab.id, {
                    code: code
                });
            });
        });
    } else {
        downloadIt(request);
    }
});

var downloadIt = function (request) {
    course = request.message[2];
    faculty_slotname = request.message[3];
    for (i = 0; i < request.message[0].length; i++) {
        var url = request.message[0][i];
        var file_name = request.message[1][i];
        fileRename[url] = file_name;
        chrome.downloads.download({
            url: request.message[0][i],
            conflictAction: "uniquify"
        });
    }
};


function returnMessage(MessageToReturn) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {
            message: MessageToReturn
        });
    });
}

//to not interfere with other downloads
var getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};


chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    if (getLocation(item.url).hostname == "vtopbeta.vit.ac.in" || getLocation(item.url).hostname == "27.251.102.132" && course && faculty_slotname) {
        var fname = item.filename;
        var title = "";
        var count = 0;
        for (var i = 0; i < fname.length; i++) {
            if (fname[i] == '_') {
                count += 1;
            }
            if (count == 5) {
                if (fileRename[item.url] == "") {
                    title = fname.substr(i + 1, fname.length);
                    break;
                } else {
                    title = fileRename[item.url] + fname.substr(i, fname.length);
                    break;
                }
            }
        }
        if (course && faculty_slotname) {
            suggest({
                filename: "VIT Downloads/" + course + '/' + faculty_slotname + '/' + title
            });
        }
    }
});

chrome.tabs.onUpdated.addListener(function () {
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, function (tabs) {
        var id = tabs[0].id;
        returnMessage("ClearCookie?");
    });
});