document.addEventListener("DOMContentLoaded", () => {
    const linklist = document.getElementById("links");
    const titleElement = document.getElementById("title");
    const errorElement = document.getElementById("error");

    const reloadElement = document.getElementById("reload");
    const clearElement = document.getElementById("clear");

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
                //download.download = `${item.quality}p-${title}.mp4`;
                download.textContent = "Download";

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

    reloadElement.addEventListener('click', (event) => {
        event.preventDefault();

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs && tabs.length > 0) {
                chrome.tabs.reload(tabs[0].id, {bypassCache: false}, () => {})
            }
        });
    });

    clearElement.addEventListener('click', (event) => {
        event.preventDefault();

        chrome.runtime.sendMessage({type: "clearLinks"}, (response) => {
            if (response && response.links) {
                displayLinks(response.links, response.title);
                displayTitle(response.title);
            }
        });
    });

    function displayTitle(title) {
        titleElement.innerHTML = title;
    }

    chrome.runtime.sendMessage({type: "requestLinks"}, (response) => {
        if (response && response.links) {
            displayLinks(response.links, response.title);
            displayTitle(response.title);
        }
    });

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

function updateIcon() {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    chrome.action.setIcon({
        path: {
            16: theme ? "IconDark16.png" : "IconLight16.png",
            32: theme ? "IconDark32.png" : "IconLight32.png"
        }
    });
}