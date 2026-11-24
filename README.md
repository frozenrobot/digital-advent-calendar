# 🎄 Digital Advent Calendar

An animated advent calendar: 24 little windows that unlock one per day through December, and one big window for the 25th. Snow, twinkling lights, a flying sleigh and a built-in music box playing carols.

## Make it yours

Everything personal lives in **`content.js`**:

- `config` – his name, your name, the title, the year.
- `days` – what's behind each window: `emoji`, `title`, `message`, and optionally `image`, `link` + `linkLabel`, or `coupon: true`.

Put photos in a `photos/` folder and reference them like `image: "photos/day2.jpg"`.

To use your own song instead of the music box, drop an mp3 next to `index.html` and set `musicFile: "our-song.mp3"`.

## Test it

Open `index.html` in a browser, then add to the address:

| URL ending | What it does |
| --- | --- |
| `?preview=all` | unlocks every window |
| `?preview=12` | pretends it's 12 December |
| `?reset` | closes all the windows again |

## Put it online

In the GitHub repo: **Settings → Pages → Deploy from a branch**, pick the branch and `/ (root)`. Send him the link it gives you.

Opened windows are remembered in his browser. Windows unlock by the date on his device.
