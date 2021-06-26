"use strict";

// importing necessary client-side files
const io = require("socket.io-client");
//? WRITE SERVER ADDRESS HERE
// const socket = io("http://localhost:3000");
const url = "https://dax-transnoder.herokuapp.com";
const socket = io(url);
const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
var dataChunks = [];
var reconnectAttempts = 0;
var liveConnection = false;

// getting cmd-line args
const username = process.argv[2];
console.log(chalk.yellow(`Connecting to => ${url}`));

// when client gets connected with server
socket.on("connect", () => {
  liveConnection = true;

  if (process.argv.length < 4) {
    console.log(chalk.blue("Connected with server"));
    console.log(chalk.cyan("Ready to receive data..."));
  } else {
    sendFile(process.argv[3]);
  }
});

// emitting the "hello" event on first contact with server
socket.emit("hello", username);

// checking if we established a connection with server or not
socket.io.on("error", () => {
  liveConnection = false;
  if (reconnectAttempts > 10) {
    console.log(chalk.red("Server is unreachable...please try again!"));
    process.exit();
  }
  console.log(chalk.yellow("Connection failed...trying to reconnect!"));
  reconnectAttempts++;
});

// when first not connected, but then reconnected
socket.io.on("reconnect", () => {
  liveConnection = true;
  console.log(chalk.blue("Re-connected with server"));
});

// for receiving files
socket.on("data-chunk-rec", (chunk) => {
  dataChunks.push(chunk);
  console.log(chalk.blue("Receiving file..."));
});

// to save file on local disk
socket.on("stream-end-rec", (filename) => {
  // concatanating the whole array into a single base64 string, omitting the commas(,)
  const wholeFileString = dataChunks.join("");
  console.log(
    chalk.cyan("Writing ") +
      chalk.cyan.bold(filename) +
      chalk.cyan(" to local disk...")
  );

  // writing the file to the system
  try {
    // checking file existence
    // if (fs.existsSync(filename)) {
    // console.log(chalk.yellow(`File: ${filename} already exists!`));
    // } else {
    fs.writeFileSync(
      filename,
      wholeFileString,
      { encoding: "base64" },
      function (err) {
        // if any error occurs
        if (err) {
          console.log(chalk.red("Unable to write file to system...try again!"));
        }
      }
    );
    // }
  } catch (err) {
    console.log(chalk.red("Something unexpected happened...Please try again!"));
    console.log(chalk.red(`Error: ${err.message}`));
  }

  // everything is good!
  console.log(chalk.green.bold("Success!"));

  // formatting the dataChunks to clear for next file
  dataChunks = [];

  // waiting for user to exit if he/she wants to
  console.log(
    "\nPress any key to exit, if you have no more files to receive..."
  );
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
});

// for sending file
function sendFile(filename) {
  // only when we have live connection
  if (liveConnection) {
    var readStream = fs.createReadStream(
      path.resolve(__dirname, `./${filename}`),
      {
        encoding: "base64",
      }
    );

    readStream.on("start", () => {
      console.log("File Loading");
    });

    readStream.on("data", (chunk) => {
      console.log(chalk.blue("Sending file..."));
      socket.emit("data-chunk", chunk);
    });

    readStream.on("end", () => {
      console.log(chalk.green("File sent successfully!"));
      socket.emit("stream-end", filename);

      console.log(chalk.white.bold("Exitting!"));
      // exitting the process
      setTimeout(() => {
        process.exit();
      }, 1500);
    });
  }
}

// DRIVER CODE
// index 3 contains filename,
// if it's not there that means you are a receiver
if (process.argv[3] && process.argv.length === 4) {
  // checking username to be alphanumeric only
  const regEx = /^[0-9a-zA-Z]+$/;
  if (process.argv[2].match(regEx) && process.argv[3].length <= 10) {
    // checking sending file existence
    if (fs.existsSync(process.argv[3])) {
      sendFile(process.argv[3]);
    } else {
      console.log(
        chalk.red(
          "The desired file to be sent, doesn't exists...Try again with correct file name!"
        )
      );
      process.exit();
    }
  } else {
    console.log(
      chalk.red(
        "Invalid arguments: Username should be alpha-numeric chars with length <= 10 chars!"
      )
    );
    process.exit();
  }
} else if (process.argv.length >= 4) {
  console.log(chalk.red("Invalid arguments"));
  process.exit();
}
