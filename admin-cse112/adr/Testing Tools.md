# Testing Tools

Created: May 9, 2022 11:54 PM
Last Edited Time: May 10, 2022 3:47 PM
Type: Tech Stack

# Context

Our current front-end codebase utilizes JSX/JavaScript based off of the previous 110 project. In 112 we will be still developing in JSX/JavaScript. We will need to test the UI/UX using a testing suite still. The original backend codebase utilizes Express and MongoDB. In 112, we will still be utilizing these stacks and will make more use of Mongoose, which is a library that allows a connection between MongoDB and the Express web application framework. 

# Decision Summary

We will be using Jest and Jest/Puppeteer to test our application in terms of unit tests and E2E tests. This is because the groundwork for using them was already set up since the base repository already used these. Some added complexity will be unavoidable as we move towards more thoroughly testing our application due to database mocking as well as thorough E2E testing, but sticking to the current tools will minimize the time cost of adopting new tools.

# Jest

## Pros (Front End)

- Current repo utilizes jest as a testing suite
- Can create unit tests with ease
- Integrated with Node.js and can run tests with ease
- integrated with GitHub actions
- ensures that different unit tests do not interfere with each other for their results
- Tests run in parallel

## Cons (Front End)

- Poor documentation
- Possible issues with text translation

## Pros (Back End)

- Provides mocking functionality out of the box (without the need for MongoDB driver)
- Makes the tests more reliable as they don’t rely on HTTP requests or connections with MongoDB
- Once the mocks are ready, it is fast to write and run the tests

## Cons (Back End)

- Creating extra mocks may present more code
- Tests rely a lot on the mocks so badly written or complex mocks can result in test misbehavior

# Puppeteer Pros and Cons

## Pros

- Current project utilizes Puppeteer as a testing suite
- Allows for screenshot testing, performance testing, web scraping, and web automation
- Automate form submission, UI testing, keyboard input, etc.
- Handles elements on webpages can interact with buttons, links, textboxes, etc.

## Cons

- Puppeteer is technically an automation tool and not a “testing tool”
- Limited to the Chrome browser due to its utilization of the Chrome DevTools protocol

# Other Testing Tools Pros and Cons

## Selenium

## Pros

- Supports multiple browsers and cross-platform support is provided
- Supports web and mobile automation, while Puppeteer supports only web
- Supports multiple programming languages, while Puppeteer supports only Node.js
- Functionalities like record and playback, which are useful for testing web applications
- Utilized in industry more than puppeteer

## Cons

- More difficult to use as it only has a programming interface (will require more code for specifying each step)
- Limited support for Image Testing
- Execution speed is slower than Puppeteer

## Docker

## Pros

- Maintain the database in a virtual environment so it does not affect anything else
- Easily able to run the environment to launch separate containers of the database/MongoDB
- Updating large databases across different computers would be easier since everything is virtualized
- Create tests to check for the establishment of the database and check for the shutting down of the database

## Cons

- the first setup of the environment may be complex and may take awhile
- Knowledge of docker is difficult to learn since it requires a lot of knowledge
- Setting up your containers for complex services will take a lot more time

# Conclusion

We decided to select jest/puppeteer as the testing suite for both the front-end and backend. The reason why we wanted to utilize jest/puppeteer is because it is a popular well-maintained testing suite that is widely used in both regular projects and industry. It is easy to create unit tests and end-to-end tests utilizing jest and puppeteer. Specifically for the backend, since we are using MongoDB, we will need a mock to emulate the functionality and spy on the arguments that the function was called with. Jest is convenient in that it provides mocking functionality out of the box.

While looking for new viable testing tools, we found Selenium to be a good candidate for E2E testing. Selenium’s popularity is long-established and continues to grow within the industry. However, considering the fact that the project previously utilized Puppeteer and the amount of time it takes to configure Selenium, we decided to stick with Puppeteer. Most of the team members use Google Chrome and since the project will not require mobile automation, some of the missing features of Puppeteer compared to Selenium wouldn’t block any of the project’s progress. 

Another investigation that we did was the usage of docker. The reason why we didn’t want to utilize docker to run our webserver/backend was due to the additional complexity and that we do not have a wide audience yet; we do not have any customers so it is unnecessary to add such a complex service when we can run it on our local machine. 

If we update our tech-stack of our frontend/backend, we can revisit our testing suite options to select a more compatible and efficient suite. 

# Consequences

As shown by the pros and cons of Jest, there are consequences to the project for using the testing tool. First, since some of the team members are not accustomed to Jest and the JavaScript framework, it will take time to learn the tool. Also compared to Docker or industry tools such as Jasmine, there are less tooling or libraries that are supported by Jest. So if more libraries are involved through new features being added, the team may potentially have to switch to a new testing tool.