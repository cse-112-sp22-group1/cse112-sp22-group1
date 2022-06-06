# Webpack & GitHub Actions

Created: May 6, 2022 2:08 AM
Last Edited Time: May 6, 2022 1:34 PM
Status: Approved
Type: CI/CD Pipeline

# Context

Given that the project already uses and CI pipeline we need to add continuous deployment to our conveyor belt. In order to do this we had to pick a tool for CD and our approach to how we would deliver the produced code into the server and prepare it for production.

# Decision Summary

We must choose a way to continuously deploy a bundled version of our application into our live server on DigitalOcean. We have decided to go with using the built-in GitHub Actions automation tool since our CI was already using that and other technologies just introduced more complexity to the project. On top of that we also decided to bundle our code to increase efficiency and accessibility through faster delivery as outlined by our team core values. We chose Webpack as our bundler mainly because of familiarity and configurability directed towards our project. Because of the size of the project any other bundler would have required a similar amount of configuration time so other factors played a more important role than the specific advantages and disadvantages for each.

# GitHub Actions Pros and Cons

## Pros

- The current pipeline already implements CI with GitHub Actions so integration would put both processes in the same place
- Team members previous experience with GitHub Actions make it easier to set-up
- Tightly integrated with codebase making the entire deployment process less complex compared to other tools

## Cons

- UI is not the best out of all available options
- More stripped down functionality requires a better understanding of the underlying processes

# Other CD Tools Pros and Cons

## Pros

- Tool built with the single purpose of making CD easier to do as well as more robust
- Better UI

## Cons

- Would require separating CI and CD into different services
- Adds an extra layer of complexity by introducing a third party service or tool
- Lack of familiarity with other tools means higher adoption cost
- Once adopted the Bus Factor drops because only the people that learnt the tool would be able to change the pipeline

# Conclusion on CD

There are too many cons and unknowns when it comes to picking a different CD tool making it impractical. We will be using GitHub Actions for CD moving forwards and make it part of our united CI/CD pipeline in the repo.

# Consequences of GitHub Actions

We will have to deal with any constraints and usability challenges that come with choosing a less specialized and developed tool. This could cause a slight drop in readability or maintenance of the repo but it would balance it out in the end.

# Webpack Pros and Cons

## Pros

- Familiarity of the team in charge of setting up the bundling and CD process with Webpack
- Webpack dev-server is convenient and easy to set up for front-end engineers to develop their work

## Cons

- Webpack is a complex bundling system that requires harder configuration for most projects
- Webpack has a higher barrier to entry making the Bus Factor lower since the people familiar with it will be the only ones knowing how to set it up

# Other Bundlers Pros and Cons

## Pros

- Possible lower barrier of entry into the technology
- May be easier to configure than Webpack and less dependency heavy

## Cons

- There is a lack of familiarity with other bundlers leading to a longer adoption and set-up time in the end
- Since people would have to learn the technology only those who do would be able to do anything and the Bus Factor would drop

# No Bundler Pros and Cons

## Pros

- No needed time to setup or configure anything other than what is already there
- Increases Bus Factor since no experts are needed to handle the library / framework
- Could potentially still minify by hand with minification library

## Cons

- All the code and testing portions would have to run in the DigitalOcean server creating additional clutter in the server
- Longer delivery time because of larger file transfer across network goes against our team values of usability and accessibility

# Conclusion on Bundler

We will be using a bundler because it would help us improve our accessibility to people across the internet even if this means slightly lowering our Bus Factor. This means that  we are given the choice between Webpack and other bundlers. Since the bundling complexity of the project is really low, on average the configuration of any bundler will take the same approximate time leading familiarity taking precedence. Additionally the webpack dev-server becomes an even more appealing extra pro given that.

# Consequences of Bundler & Webpack

Introduced complexity into the development and deployment process of the application by introducing the need to bundle our code. Lower Bus Factor since not everyone is familiar with Webpack. Time spent on configuration and set-up of the Webpack bundler.