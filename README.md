# Web components applications

A suite of web applications built with web components. All applications are frontend only, built with HTML, CSS and Javascript, without any additional frameworks, and what they handle stays in the browser. Every application keeps its data access in a `services.js` file, which makes connecting them to a backend possible - how much work that is depends on the application, as explained in [Connecting a backend](#connecting-a-backend).

The project tries to highlight the advancements of HTML 5 Web Components and other HTML 5 APIs, which allow us to build fully featured applications without the need of a backend. Of course, some features will be missing: the applications that scan a folder (Music, Photos, Videos and Mail) cannot keep the scanned library between sessions, and Mail cannot send email.

All applications share the same interface inspired by Microsoft's Zune media player and function similarly, as explained below. The first applications have been tested mostly on Chrome and Safari, on both desktop and mobile, to make sure they work on multiple platforms. Photos, Videos and Mail have been verified mostly on Chrome. They will have bugs and inconsistencies. The applications are available [here](https://raduzaharia-medium.github.io/web-components-apps/).

## Running the applications

The applications are plain files, but they use Javascript modules, which browsers do not load from `file://`. Serve the folder with any static web server, for example `python3 -m http.server`, and open `http://localhost:8000`.

## Browser support and limitations

- **Folder access.** Music, Photos, Videos and Mail ask for a folder. Browsers with the File System Access API (Chrome, Edge) open a folder picker and read the files when they are needed. Other browsers (Safari, Firefox) fall back to a folder input, which hands over the whole folder at once and cannot write to it.
- **Nothing is kept between sessions** for the applications above. The File System Access API would allow remembering the folder in Chrome, but this is not implemented. The other applications keep their data in HTML local storage, which is limited to a few megabytes and is lost when the site data is cleared.
- **External libraries** are loaded from CDNs when the application opens, so they need an internet connection: ical.js (Calendar, Contacts), jsPDF (Calendar), id3js and jsmediatags (Music), exifr (Photos) and postal-mime (Mail). All of them are pinned to a version, except ical.js and id3js.
- **Formats.** The browser plays and shows what it supports. Videos are not transcoded and the thumbnails of unsupported videos stay a placeholder.

## Calendar

The Calendar application offers to load `ics` files and stores them in HTML local storage, showing them on a graphical calendar. It allows editing and deleting events and the export of the rendering to PDF.

## Contacts

The Contacts application offers to load `vcf` files and stores them in HTML local storage, showing them on a graphical list and details panel. It allows creating, editing and deleting contacts.

## Music

The Music application offers to load a folder with `mp3` files. It reads the title, artist, album, genre and album art from the `mp3` metadata and shows them on graphical lists, allowing media browsing by different categories. The scanned library lives in memory and has to be loaded again in the next session.

## News

The News application is an RSS reader which offers to load an `opml` file with RSS feeds and store the articles in HTML local storage, showing them on a graphical list and details panel. It loads new articles when pressing the synchronization button. Keeping track of the read articles is still in progress. In order to load the articles for an RSS feed, the feed needs to have CORS access allowed. This is controlled by the feed provider, so in the absence of a backend we can only rely on feed URLS with CORS access.

## Expenses

The Expenses application is a yearly expenses tracker, showing the paid amounts for each expense on a month by month grid, grouped by category, with monthly totals. Years are stored in HTML local storage. Since there is no backend to keep the data files, it allows importing and exporting the expenses of a year as `json` files.

## Shopping

The Shopping application is a shopping list planner. In the planning view it shows a catalog of products grouped by category and lets you pick the ones to buy, and in the shopping view it shows the resulting list, allowing you to add other items and check off the ones you have bought. The list is stored in HTML local storage.

## Photos

The Photos application offers to load a folder with pictures and browses them by folder, by album (a folder with " - " in its name) and by month. It reads the date each picture was taken from its EXIF metadata, falling back to the file date, and builds the thumbnails in the browser.

## Videos

The Videos application offers to load a folder with videos, where each subfolder is a category (movies, shows, etc.), each folder inside a category is a title and any folders inside a title are seasons. It shows the titles and episodes on graphical lists, builds the thumbnails from a frame of each video and plays them in the page.

## Mail

The Mail application offers to load a folder with mail in the Maildir format, where each subfolder is an account, and shows its folders and emails, opening the messages in a safe frame (no scripts and no remote content) and offering their attachments for download. Browsers cannot connect to IMAP or SMTP servers, so the mail has to be downloaded by another tool (like `mbsync` or `offlineimap`) into that folder. Where the browser allows writing to it (Chrome), it can also mark emails as read, move and delete them, and manage folders. A new message, a reply or a forward cannot be sent: it can be handed to the mail application or saved as an `.eml` file.

## Connecting a backend

Every application reads and writes its data through the functions exported by its `services.js` file, and the pages and components only use those functions. A backend can replace their bodies with API calls, no matter what this backend is. Some things need attention:

- **Keep the models.** The applications expect the data in the shape their `services.js` returns. Translate the backend models to it, and do not change what the components receive.
- **Make everything asynchronous.** Most service functions are already `async`, but a few getters (mostly in Calendar, Contacts and News) return their data directly, because local storage is synchronous. Make them `async` and `await` them in the pages.
- **Replace files with URLs.** In Music, Photos, Videos and Mail the items carry a browser file (or file handle), and the services turn it into an object URL to play, show or download. With a backend, return the URL of a stream, thumbnail, image or attachment instead, and have the `getFileUrl`, `getImageUrl`, `getVideoUrl` and `getThumbnailUrl` functions hand it to the components.
- **Move the work to the server.** What the browser does the hard way can be done better by a backend: scanning the library once instead of in every session, making thumbnails, reading metadata and fetching feeds without CORS.

How much work this is depends on the application:

| Application | Replace | Notes |
| --- | --- | --- |
| Expenses | `getAvailableYears`, `getData`, `saveData` | The easiest one: three calls that map to a list of years and to reading and writing one document per year. The import and export functions can stay as a convenience. |
| Shopping | `getCategories`, `getProducts`, `getShoppingList`, `setShoppingList`, `deleteShoppingList` | Straightforward, with a products catalog and a shopping list per user. The catalog lives in `scripts/products.js` today. |
| Contacts | load, get, create, update and delete functions | Fits CardDAV or a simple contacts API. Importing a `vcf` file can become an upload. |
| Calendar | load, get and save functions for events | Fits CalDAV or a simple events API. Some getters are synchronous today. |
| News | feeds, articles and read state functions | A backend removes the CORS limit by fetching the feeds itself, and can keep the read state. |
| Music | scanning, lists and `getFileUrl`, `getAlbumArt` | The server scans the library, so nothing is lost between sessions, and returns stream and album art URLs. Songs carry a file today. |
| Photos | `getFolders`, `getAlbums`, `getPhotos`, `getTimeline`, `getImageUrl`, `getThumbnailUrl` | The server lists folders and photos, makes the thumbnails and can build the timeline from an index of the dates taken, instead of reading the file headers. |
| Videos | `getCategories`, `getTitles`, `getEpisodes`, `getVideoUrl`, `getThumbnailUrl` | The server scans the library, streams the files (and can transcode them) and makes the thumbnails. |
| Mail | folders, emails, message, attachments, mark, move, delete and folder functions, plus sending | The hardest one: a backend keeps the mailbox in sync with the IMAP server and serves it, and sending mail needs SMTP or a provider API. The compose page would post the message instead of saving it as an `.eml` file. |

## Roadmap and currently available applications

- [x] Calendar
- [x] Contacts
- [x] Music
- [x] News
- [x] Photos
- [x] Videos
- [x] Mail
- [x] Expenses tracker
- [x] Shopping list
