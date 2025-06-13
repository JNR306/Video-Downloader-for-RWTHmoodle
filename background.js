// background.js -- Version 1.2
// Copyright (c) 2025 JNR306
// https://github.com/JNR306/Video-Downloader-for-RWTHmoodle

let extractedLinks = []; //the video urls for all different qualitys
let title = chrome.i18n.getMessage("unknownTitle"); //the video title to display

//load currently stored video links
async function loadSessionData() {
    try {
        const result = await chrome.storage.session.get(['extractedLinks', 'title']);
        if (result.extractedLinks) {
            extractedLinks = result.extractedLinks;
        }
        if (result.title) {
            title = result.title;
        }
    } catch (error) {
        console.error("Loading session data was not possible:", error);
    }
}

loadSessionData();

//extract links if episode.json?id=xxx is loaded by RWTHmoodle streaming service
chrome.webRequest.onCompleted.addListener(
    function(details) {

        //anchor to stop recursive excution of this function
        if (details.url.includes("vdm=true")) {
            return;
        }

        //get the content of the episode.json by loading it again
        if (details.url.includes("engage.streaming.rwth-aachen.de/search/episode.json?id=")) {
            fetch(`${details.url}&vdm=true`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Fetching of ${details.url} not possible`);
                    }
                    return response.json();
                })
                .then(data => {
                    extractedLinks = [];

                    //parse episode.json to get the video links and the video title
                    if (data && data.result && data.result.length > 0 && data.result[0].mediapackage && data.result[0].mediapackage.media && data.result[0].mediapackage.media.track) {
                        const tracks = data.result[0].mediapackage.media.track;

                        tracks.forEach(track => {
                            if (track.mimetype === "video/mp4" && track.url) {
                                let quality = "-";
                                if (track.tags && track.tags.tag && track.tags.tag.length > 0) {
                                    const qualityTag = track.tags.tag[0];
                                    const match = qualityTag.match(/(\d+p)/);
                                    if (match && match[0]) {
                                        quality = parseInt(match[0]);
                                    } else {
                                        quality = qualityTag;
                                    }
                                }

                                extractedLinks.push({
                                    url: track.url,
                                    quality: quality
                                });
                            }
                        });

                        extractedLinks.sort((a, b) => {
                            return b.quality - a.quality;
                        });

                        if (data.result[0].mediapackage.title) {
                            title = data.result[0].mediapackage.title;
                        }

                        //console.log("Extracted Links:", extractedLinks);

                        //store the video links for the current session (so they don't randomly disappear because the script is unloaded)
                        chrome.storage.session.set({extractedLinks: extractedLinks, title: title}).catch(error => console.error("Error saving to session storage:", error));
                        
                        //tell the popup to update its UI
                        chrome.runtime.sendMessage({
                            type: "updateLinks",
                            links: extractedLinks,
                            title: title
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.warn("Error sending message to popup:", chrome.runtime.lastError.message);
                            }
                        });
                    }

                });
        }
    },
    { urls: ["*://engage.streaming.rwth-aachen.de/search/episode.json?id=*"]}
);

//send the video links to the popup if it requests them
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "requestLinks") {
        sendResponse({
            links: extractedLinks,
            title: title
        });
        return true;
    }
});

//clear stored video links if the popup requests it
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "clearLinks") {
        extractedLinks = [];
        title = chrome.i18n.getMessage("unknownTitle");

        chrome.storage.session.remove(['extractedLinks', 'title']).catch(error => console.error("Error clearing session data:", error));
        
        sendResponse({
            links: extractedLinks,
            title: title
        });
        return true;
    }
});