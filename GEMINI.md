Please create a Node.js command line using the following guidelines :
* The command must accept a path parameter that points to a CSV file :
  * If the file does not exist or does not look like a CSV, fail the command by showing an explicit error
* The CSV file must be read sequentially and for each record :
  * The following information is extracted : ARTIST, TITLE and URL (these values will be referred as <ARTIST>, <TITLE> and <URL> through the prompt)
  * A child process must be created to execute the command: yt-dlp -x --audio-format mp3 <URL> -o "<ARTIST> - <TITLE>.mp3"
  * Wait for the child process to succeed, if it fails, fail the whole command with an explicit error
  * Then use the package node-id3 to set the following metadata to "<ARTIST> - <TITLE>.mp3" :
    * title: <TITLE>
    * artist: <ARTIST>
* In the command output, show a progress indicator to let the user know :
  * how many files were processed
  * how much is left to complete
  * an estimation of time to completion
