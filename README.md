# Web components applications

A suite of web applications built with web components. All applications are frontend only, built with HTML, CSS and Javascript, without any additional frameworks. Connecting them to a backend should be trivial - all applications have a `services.js` file which points to local HTML storage. All service functions can be redirected to backend API calls, no matter what this backend is. Mind the model format required by the applications, and translate the backend models to it first.

The project tries to highlight the advancements of HTML 5 Web Components and other HTML 5 APIs, which allow us to build fully featured applications without the need of a backend. Of course, some features will be missing (the Music application cannot save the scanned media library due to HTML file access considerations of privacy).

All applications share the same interface inspired by Microsoft's Zune media player and function similarly, as explained below. They have been tested mostly on Chrome and Sfari, on both desktop and mobile, to make sure they work on multiple platforms, but they will have bugs and inconsistencies. The applications are available [here](https://raduzaharia-medium.github.io/web-components-apps/).

## Calendar

The Calendar application offers to load `ics` files and stores them in HTML local storage, showing them on a graphical calendar. It allows the export of the rendering to PDF.

## Contacts

The Contacts applications offers to load `vcf` files and stores them in HTML local storage, showing them on a graphical list and details panel. It allows contact editing.

## Music

The Music application offers to load a folder with `mp3` files and stores the metadata in HTML local storage. It reads the title, artist, album, year of release and album art from the `mp3` metadata and shows them on graphical lists, allowing media browsing by different categories.

## News

The News application is an RSS reader which offers to load an `opml` file with RSS feeds and store the articles in HTML local storage, showing them on a graphical list and details panel. It marks the read articles when they are opened and loads new articles when pressing the synchronization button. In order to load the articles for an RSS feed, the feed needs to have CORS access allowed. This is controlled by the feed provider, so in the absence of a backend we can only rely on feed URLS with CORS access.

## Roadmap and currently available applications

- [x] Calendar
- [x] Contacts
- [x] Music
- [x] News
- [ ] Photos
- [ ] Mail
- [ ] Expenses tracker
- [ ] Shopping list (currently in progress)
