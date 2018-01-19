function addCheckBoxes(links) {
    for (var href_number = 0; href_number < links.length; href_number++) {
        var box = document.createElement("input");

        var att = document.createAttribute("type");
        att.value = "checkbox";
        box.setAttributeNode(att);

        var att1 = document.createAttribute("name");
        att1.value = "downloadSelect";
        box.setAttributeNode(att1);

        var att2 = document.createAttribute("value");
        att2.value = links[href_number].href;
        box.setAttributeNode(att2);

        var att3 = document.createAttribute("class");
        att3.value = "sexy-input";
        box.setAttributeNode(att3);

        var att4 = document.createAttribute("data-filename");
        att4.value = links[href_number];
        box.setAttributeNode(att4);

        links[href_number].parentNode.insertBefore(box, links[href_number]);
    }
}

function addButton(referenceButton, buttonValue) {
    var button = document.createElement("input");

    var att = document.createAttribute("type");
    att.value = "button";
    button.setAttributeNode(att);

    var att = document.createAttribute("class");
    att.value = "btn btn-primary";
    button.setAttributeNode(att);

    var att = document.createAttribute("name");
    att.value = buttonValue;
    button.setAttributeNode(att);

    var att = document.createAttribute("value");
    att.value = buttonValue;
    button.setAttributeNode(att);

    var att = document.createAttribute("style");
    att.value = "padding:3px 16px;font-size:13px;background-color:black;"
    button.setAttributeNode(att);

    referenceButton.parentNode.insertBefore(button, referenceButton.nextSibling);
}

function modifyPage() {
    // add selectAll checkbox
    var selectAll = document.createElement("input");
    var att = document.createAttribute("type");
    att.value = "checkbox";
    selectAll.setAttributeNode(att);
    var att = document.createAttribute("class");
    att.value = "selectAll";
    selectAll.setAttributeNode(att);

    var selectAllText = document.createElement("p");
    selectAllText.innerHTML = "Select All";

    var div = document.getElementsByClassName("table-responsive")[0];
    div.appendChild(selectAllText);
    div.appendChild(selectAll);

    // add checkboxes
    var links = document.getElementsByClassName("btn btn-link");
    addCheckBoxes(links);

    // add new buttons
    var oldButtons = document.getElementsByClassName("btn btn-primary");
    var prevButton = oldButtons[oldButtons.length - 1];
    var downloadAllButton = oldButtons[oldButtons.length - 1];
    downloadAllButton.innerHTML = "Download All Files"
    downloadAllButton.style["backgroundColor"] = "black";
    downloadAllButton.removeAttribute('href');

    addButton(prevButton, "Download Selected Files");
    newButtons = document.getElementsByClassName("btn btn-primary");
    var downloadSelectButton = newButtons[newButtons.length - 1]

    downloadSelectButton.addEventListener("click", downloadSelected, false);
    downloadAllButton.addEventListener("click", downloadAll, false);
    selectAll.addEventListener("click", selectAllLinks, false);


    // add credits
    var credsLocation = document.getElementsByClassName("col-sm-12 col-md-11 col-md-offset-0")[0];
    var credsText = document.createElement("p");
    credsText.innerHTML = "<center>CoursePage Download Manager- Made with ♥, Priyansh Jain</center>";
    credsLocation.appendChild(credsText);
}

function selectAllLinks() {
    var links1 = document.getElementsByClassName("table")[1].getElementsByClassName("sexy-input");
    var links2 = document.getElementsByClassName("table")[2].getElementsByClassName("sexy-input");
    for (i = 0; i < links1.length; i++) {
        links1[i]["checked"] = true;
    }
    for (i = 0; i < links2.length; i++) {
        links2[i]["checked"] = true;
    }
}

function downloadAll() {
    var detailsTable = document.getElementsByClassName("table")[0].getElementsByTagName("td");
    var course = detailsTable[7].innerText + '-' + detailsTable[8].innerText;
    var facultySlotName = detailsTable[12].innerText + '-' + detailsTable[11].innerText;
    facultySlotName = facultySlotName.replace(/[/]/g, '-');
    var links1 = document.getElementsByClassName("table")[1].getElementsByClassName("sexy-input");
    var links2 = document.getElementsByClassName("table")[2].getElementsByClassName("sexy-input");
    var selectedLinks = []
    var linkTitles = []
    for (k = 0; k < links1.length; k++) {
        selectedLinks.push(links1[k].value);
        title = "";
        linkTitles.push(title);
    }
    for (k = 0; k < links2.length; k++) {
        selectedLinks.push(links2[k].value);
        description = links2[k].parentElement.parentElement.previousElementSibling.innerText;
        date = links2[k].parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
        var title = (k + 1).toString() + '-' + description + '-' + date;
        title = title.replace(/[/:*?"<>|]/g, '_')
        linkTitles.push(title);
    }
    triggerDownloads([selectedLinks, linkTitles, course, facultySlotName]);
}

function downloadSelected() {
    var detailsTable = document.getElementsByClassName("table")[0].getElementsByTagName("td");
    var course = detailsTable[7].innerText + '-' + detailsTable[8].innerText;
    var facultySlotName = detailsTable[12].innerText + '-' + detailsTable[11].innerText;
    facultySlotName = facultySlotName.replace(/[/]/g, '-');
    var links1 = document.getElementsByClassName("table")[1].getElementsByClassName("sexy-input");
    var links2 = document.getElementsByClassName("table")[2].getElementsByClassName("sexy-input");
    var selectedLinks = []
    var linkTitles = []
    for (k = 0; k < links1.length; k++) {
        if (links1[k]["checked"]) {
            selectedLinkslinks.push(links1[k].value);
            title = "";
            linkTitles.push(title);
        }
    }
    for (k = 0; k < links2.length; k++) {
        if (links2[k]["checked"]) {
            selectedLinks.push(links2[k].value);
            description = links2[k].parentElement.parentElement.previousElementSibling.innerText;
            date = links2[k].parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText
            var title = (k + 1).toString() + '-' + description + '-' + date;
            title = title.replace(/[/:*?"<>|]/g, '_')
            linkTitles.push(title);
        }
    }
    triggerDownloads([selectedLinks, linkTitles, course, facultySlotName]);
}

function triggerDownloads(downloadList) {
    // alert("Contentscript is sending a message to background script: '" + contentScriptMessage  + "'");
    chrome.extension.sendMessage({
        message: downloadList
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender) {
        // alert("Contentscript has received a message from from background script: '" + request.message + "'");
        if (request.message == "ClearCookie?") {
            try {
                if (document.getElementsByTagName('h1')[0].innerHTML == "Mutl-Tab Access Error") {
                    chrome.extension.sendMessage({
                        message: "YesClearCookiePls"
                    });
                }
            } catch (error) {
                ;
            }
        } else {
            modifyPage();
        }
    });