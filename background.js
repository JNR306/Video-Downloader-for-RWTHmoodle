// background.js -- Version 1.2
// Copyright (c) 2025 JNR306
// https://github.com/JNR306/Video-Downloader-for-RWTHmoodle

let extractedLinks = [];
let title = chrome.i18n.getMessage("unknownTitle");

chrome.webRequest.onCompleted.addListener(
    function(details) {

        if (details.url.includes("vdm=true")) {
            return;
        }

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "requestLinks") {
        sendResponse({
            links: extractedLinks,
            title: title
        });
        return true;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "clearLinks") {
        extractedLinks = [];
        title = chrome.i18n.getMessage("unknownTitle");
        sendResponse({
            links: extractedLinks,
            title: title
        });
        return true;
    }
});