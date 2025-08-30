# yt-mp3
Capture mp3 from videos and add metadata.

## Disclaimer

The code was initially built with GEMINI and adjusted, not the best code ever but does the job.

## Setup

* Clone the repository (either use `git clone` or download the zip from GitHub through the green `[<> Code]` button)

* Install dependencies with `npm install`

* Make the following executables available (either in PATH or copied in the project folder) :

  * [yt-dlp](https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files)

  * [ffmpeg & ffprobe](https://ffmpeg.org/download.html)

## List

Create a CSV of music to download, for example :

```csv
ARTIST,TITLE,URL
Fleetwood Mac,The Chain,https://youtu.be/xwTPvcPYaOo
```

## Execution

* `node . list.csv`

The download sometimes fail, an inbuilt retry mechanism will retry up to 3 times after a 10s delay.