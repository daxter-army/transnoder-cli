<div align="center">
  <h1>transnode</h1>
  <h2>send files over internet without leaving cli</h2>
</div>

## General Info

Made with the magic of Node.js and sockets.io, transnode is a command line interface tool which enables you to send any kind of file directly, from cli without using any third party software.

## Technologies

The Project is created with:

- Node.js
- Sockets.io
- Express

## Setup

To run this project, **Nodejs should be installed on your system, if not you can download it from [here](https://nodejs.org/en/)**

## Run

**Server**

- After cloning, go to server and client directory, and hit

```js
npm install
```

- Go to server directory and type

```js
npm run start
```

This will start the server, and this server will be the mediator between both our clients, i.e sender and receiver

**Client**

- Client as **receiver**, **should be run first.**
- Go to Client directory and hit

```js
node client.js <user_name>
```

- **user_name:** it is alphanumeric string, must be given by user, to make unique user connection.

<hr/>

- Client as receiver, **should be run after receiver script, when terminal is saying this:**

```js
Waiting for sender to send data...
```

- Go to Client directory and hit, in a different terminal

```js
node client.js <user_name> <file_name>
```

where,

- **user_name:** it is an alphanumeric string with max length of 10 characters, must be given by user, to make unique user connection.

- **file_name:** it is the desired file that is supposed to be send by the sender, should be in the directory of this current file. **That means you need to move your target file here, to send before launching the script.**

* On successfull completion, you will see the new file created in the current working directory.

## Things in motion

- It supports sending any kind of file, whether audio, video, text, any file.
- Messaging can also be implemented with this, and is currently in development.

## Suggestions/Collaboration

- You are open to give suggestions, or to contribute to this project, feel free to create pull requests 😊.

## Issues

- Currently, I have faced no issues while using this, but if you notice one, feel free to raise an issue.

## License

MIT License
