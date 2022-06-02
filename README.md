<div align="center">

[![BooJo Logo](admin/branding/logo.png)](https://boojo.bitfrost.app/)

## A Notion-inspired bullet journal

</div>

# Mission Statement

We hope to create a virtual bullet journal that will help users organize tasks
and projects in agile fashion.

In pursuit of improving on existing software, BooJo hopes to create a truly
cohesive user experience without having to start from scratch.

# Building

1. Clone the repository with `git clone https://github.com/cse-112-sp22-group1/cse112-sp22-group1.git`
2. Download and install [NodeJS](https://nodejs.org/en/).
3. Set up a MongoDB server.
   There are several ways to do this.
   One method is to use [MongoDB's hosting service](https://www.mongodb.com/).
4. Open the project root directory in a terminal and run `npm install`

## Backend

1. Navigate to `src/back-end` with `cd src/back-end`
2. Run `npm install`
3. Create a file named `.env`
4. Add the following keys. The values below are just placeholders.
   ```
   DB=<address of the MongoDB server>
   SESSION_SECRET=ARandomlyGeneratedStringOfCharactersToKeepSecret
   HASHKEY=ADifferentRandomlyGeneratedStringOfCharactersToKeepSecret
   ```
5. Start the server with `npm run index.js`
6. Leave this server running in the background.

## Frontend

1. Navigate to with `cd src/front-end`
2. Run `npm install`
3. Run `npm run dev`
4. A window should open in your default browser with BooJo.

# Team

Built by CSE 112, Team 1: Caffeinated Fast Fingers.

Members:
* [Waynar Bocangel](https://github.com/waynarbocangel)
* [e5chang](https://github.com/e5chang)
* [Ed5443](https://github.com/Ed5443)
* [Darin8](https://github.com/Darin8)
* [Ehson12](https://github.com/Ehson12)
* [jamestylee](https://github.com/jamesytlee)
* [rr-zhou](https://github.com/rr-zhou)
* [forschoolandnothingelse](https://github.com/forschoolandnothingelse)
* [rltoSD](https://github.com/rltoSD)

Based on the work of [CSE 110, Group 11](https://github.com/forschoolandnothingelse/cse112-sp22-group1).

# Project Layout

* `src`: The source code directory.
  * `back-end`: Source code for the back-end API.
  * `front-end`: Source code for the front-end.
  * `unitTests`: Unit tests for our CI pipeline.
* `docs`: JSDoc files for our codebase.
* `specs`: Project design documents.
* `admin`: Administrative files such as product branding, planning documents, etc.

# Contributing

For contributing guidelines, please read [CONTRIBUTING.md](CONTRIBUTING.md).
