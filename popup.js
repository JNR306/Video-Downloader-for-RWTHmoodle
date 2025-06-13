// popup.js -- Version 1.2
// Copyright (c) 2025 JNR306
// https://github.com/JNR306/Video-Downloader-for-RWTHmoodle

document.addEventListener("DOMContentLoaded", () => {
    const linklist = document.getElementById("links");
    const titleElement = document.getElementById("title");
    const errorElement = document.getElementById("error");

    const reloadElement = document.getElementById("reload");
    const clearElement = document.getElementById("clear");

    //update labels of HTML elements with translated strings
    document.getElementById("popuptitle").textContent = chrome.i18n.getMessage("popupTitle");
    document.getElementById("sectionheader").textContent = chrome.i18n.getMessage("sectionHeader");
    document.getElementById("info").textContent = chrome.i18n.getMessage("infoMessage");
    document.getElementById("errormessage").textContent = chrome.i18n.getMessage("noVideoFound");
    document.getElementById("title").textContent = chrome.i18n.getMessage("unknownTitle");
    reloadElement.textContent = chrome.i18n.getMessage("reloadPageButton");
    clearElement.textContent = chrome.i18n.getMessage("clearButton");

    //update the HTML that displays the video links
    function displayLinks(links, title) {
        linklist.innerHTML = "";

        if (links && links.length > 0) {
            titleElement.style.display = 'block';
            errorElement.style.display = 'none';
            linklist.style.display = 'flex';

            links.forEach(item => {
                const link = document.createElement("div");
                const quality = document.createElement("span");
                const open = document.createElement("a");
                const download = document.createElement("a");

                link.classList.add("link");
                quality.classList.add("quality");
                open.classList.add("open");
                download.classList.add("download");

                quality.textContent = `${item.quality}p`;

                open.href = item.url;
                open.target = "_blank";

                download.href = item.url;
                download.textContent = chrome.i18n.getMessage("downloadLink");

                //download the video from the collected url if the user requests to by pressing the corresponding button
                download.addEventListener('click', (event) => {
                    event.preventDefault();
                    const filename = `${item.quality}p-${title}.mp4`;

                    chrome.downloads.download({
                        url: item.url,
                        filename: filename,
                        saveAs: false
                    }, (id) => {});
                });

                link.appendChild(quality);
                link.appendChild(open);
                link.appendChild(download);
                linklist.appendChild(link);
            });
        } else {
            titleElement.style.display = 'none';
            errorElement.style.display = 'flex';
            linklist.style.display = 'none';
        }
    }

    //reload current browser page if the user presses the corresponding button for troubleshooting
    reloadElement.addEventListener('click', (event) => {
        event.preventDefault();

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs && tabs.length > 0) {
                chrome.tabs.reload(tabs[0].id, {bypassCache: false}, () => {})
            }
        });
    });

    //request deletion of video links if the user presses the corresponding button
    clearElement.addEventListener('click', (event) => {
        event.preventDefault();

        chrome.runtime.sendMessage({type: "clearLinks"}, (response) => {
            if (response && response.links) {
                displayLinks(response.links, response.title);
                displayTitle(response.title);
            }
        });
    });

    //update the HTML that displays the video title
    function displayTitle(title) {
        titleElement.textContent = title;
    }

    //request the video links from the background script to display them if the popup is opened
    chrome.runtime.sendMessage({type: "requestLinks"}, (response) => {
        if (response && response.links) {
            displayLinks(response.links, response.title);
            displayTitle(response.title);
        }
    });

    //receiving the request by the background script to update the UI
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "updateLinks") {
            if (request.links) {
                displayLinks(request.links, request.title);
                displayTitle(request.title);
            }
            sendResponse({status: "receivedLinks"});
            return true;
        }
    });

    updateIcon();
});

//update the toolbar icon of the extension according to light or dark mode
function updateIcon() {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    chrome.action.setIcon({
        path: {
            16: theme ? "icons/IconDark16.png" : "icons/IconLight16.png",
            32: theme ? "icons/IconDark32.png" : "icons/IconLight32.png"
        }
    });
}