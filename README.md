# Wallpaper with Time and Date

Small Mac utility to display time and date on the desktop wallpaper.

![screenshot of the wallpaper](./screenshot.png)

Also hides the notch.

## What it does

- Render `html_wallpaper/index.html` on a webview on a hidden window every minute.
- `html_wallpaper/index.html` draws on a canvas. Save the contents of that canvas as png.
- Set the png as a wallpaper (and ensure that it stays set).

## Works Used:

- The AMAZING background that I'm using: [Marcelo Vaz on ArtStation](https://www.artstation.com/artwork/xD4EY1)
- The Nepali Date formatter (not in its original form): [sharingapples/nepali-date](https://github.com/sharingapples/nepali-date)
