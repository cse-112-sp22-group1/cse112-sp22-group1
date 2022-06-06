# Week 5 Product Meeting

Created: April 29, 2022 4:05 PM
Last Edited Time: May 19, 2022 5:27 PM
Participants: Anonymous, Anonymous, Anonymous, Anonymous, Anonymous, Anonymous, Anonymous, Anonymous, Anonymous
Type: Product Meeting

# Agenda

- [x]  CI/CD Pipeline
- [x]  Javascript onboarding issues
- [x]  Testing

# What did we do last week?

- Waynar and Darin integrated webhack so all js files and sent to server quickly and then the next problem is ssh proble ms. on pr merge this action will have the server run a git checkout to pull the.
- git repo was made and people will be added to the org
- Backend was left untouched, Front-end has a bundler that makes a product js code that will be much much faster.
- Decided on using forking
- two new branches which are back-end and front-end for pushing to make sure they run well
- Linting has been done so that we can check with git-hub actions running ‘lint’ should run the check and fixing it can be done with a command that Waynar brought up.
- Initial guideline doc has been made for making testing tools
- James is going to deal with back-end testing whereas Richard will be doing front-end testing. By that this means they will be working closely with that team in order to keep them in check.

# What are we doing this week?

- Sunday Richard and James are meeting for doing tooling for tests
- Darin - version control guidelines needs to be doced
- Leo was saying that we need a more user centric approach from what sanat was speaking about.
- Waynar is going over his old Miro

Back-End

- In schema.js backend should be weary of creating ONE Instance of mongoose connection to the database.
- Then use this one exported connection throughout the database.
- Get rid of all the useless functions.

Front-End

- We should just use js-x so that we can make the css into syntatically a better readable presentation.
- We also have to delete the trash files, where basically if any exports are not being used then we delete them.
- Fonts and other forward facing imports that we use MUST be under the public folder.
- Import CSS files within the index.js and not with the client call.
- Index.js IS WHERE the magic happens. the entire app is an SPA (single page app), so its just javascript refreshing. Do `npm run dev` where basically any changes will reflect.
- Front end should be fixing all the small things that are broken
- 1 is safari broken spacing bug.
- mobile has bugs with sizing.
- The shadow dom does not work well with safari and it will not play nice. Basically shadow dom does not interact with anything outside of its bubble.
- Frontend decided to do jsx

Everyone has to do 

- Clone the repo
- Run npm install in your portion of the repo
- Do not upload the npm folder dependencies.
- BEFORE you push to the repo, make sure to run the build so we have all the necessary resources. `npm run build` should be run

# Potential blockers?

- Understanding the Repo