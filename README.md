# Video Downloader for RWTHmoodle

This Chrome/Firefox Extension adds the ability to easily download Opencast videos in RWTHmoodle to view them offline.

> [!IMPORTANT]
> This add-on is an independent project and is **not officially affiliated with or endorsed by RWTH Aachen University** or the RWTHmoodle platform. Please ensure you respect all applicable copyright laws and university policies when downloading content.

## Key Features
- **Effortless Downloads:** Automatically detects videos on your current RWTHmoodle page and provides a direct download button.
- **Open in New Tab:** Prefer to watch videos with your browsers native video player? Easily open any detected video in a new tab.
- **Quality Selection:** Choose to download lecture videos in various available quality resolutions (e.g., 720p, 1080p), ensuring you get the perfect balance of quality and file size.
- **Automatic Naming:** Downloads are automatically named with the video's title and quality (e.g., "720p-LectureTitle.mp4") for hassle-free organization.
- **Localized Interface:** The add-on interface adapts to your browser's language settings for a more intuitive user experience.

## Installation

> [!NOTE]
> This Extension is currently not available on the Chrome or Firefox Web Store!

<details>
  <summary>

<h3> Firefox Release/Beta </h3>
  </summary>

1. Download the latest .xpi from the GitHub Releases.
2. Open `about:debugging`.
3. Switch to "This Firefox" on this page.
4. Click "Load Temporary Add-on" and select the downloaded .xpi.

</details>

> [!IMPORTANT]
> You can only install add-ons temporarily in the release and beta versions of Firefox! They will vanish when you restart the browser.

<details>
  <summary>

<h3> Firefox Nightly/Developer Edition </h3>
  </summary>

#### Temporary add-on:

See installation for Firefox Realese/Beta.

#### Permanent add-on:

1. Open `about:config`.
2. Change xpinstall.signatures.required to false. This will deactivate the requirement that add-ons need to be signed. Change back to true to revers this action.
3. Download the latest .xpi from the GitHub Releases.
4. Open `about:addons`.
5. Click the gear icon next to "Manage Your Extensions".
6. Choose "Install add-on from file" and select the downloaded .xpi.

</details>

<details>
  <summary>

<h3> Chrome/Edge/Arc </h3>
  </summary>

1. Download and unpack the latest .zip from the GitHub Releases.
2. Open `chrome://extensions` or `edge://extensions` or `arc://extensions`.
3. Enable developer mode on this page.
4. Click "load unpacked extension" and select the unpacked folder that contains the manifest.json.

</details>

## How to Use
1. Navigate to a video lecture page on RWTHmoodle.
2. Click on the add-on icon in your Firefox toolbar.
3. The popup will display a list of detected video qualities available for download.
4. **To Download:** Click the Download button next to your desired quality.
5. **To Open in a New Tab:** Click the Open button next to your desired quality to play the video directly in a new browser tab with native video controls.
