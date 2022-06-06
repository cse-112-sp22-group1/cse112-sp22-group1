# Digital Ocean Hosting

Created: May 6, 2022 2:03 AM
Last Edited Time: May 6, 2022 2:55 AM
Status: Approved
Type: Hosting

# Context

Given that our application is a web app we need to deliver it through some kind of hosting service on the internet. There is a variety of services available as well as shapes and forms of delivery depending on our needs.

# Decision Summary

We had to serve our site in some hosting solution. Several options were available yet two made the most sense: GitHub Pages and DigitalOcean. This was because we are managing our repository on GitHub and the originally deployed version of the application was running on DigitalOcean. In the end the entire deployment process was set-up on DigitalOcean already so changing deployment solutions would have an extra time penalty and the most prominent alternative GitHub couldn’t run both our front-end and back-end servers simultaneously, so we stuck with DigitalOcean

# GitHub Pages Pros and Cons

## Pros

- We are storing all of our codebase on GitHub already so it would be convenient to manage everything from within GitHub
- Server management is handled by GitHub
- Everyone has access to the GitHub instance, meaning increased Bus factor

## Cons

- We would still need to host our back-end server somewhere else.
- We would have to invest time into setting up the front-end deployment within GitHub
- No custom domain unless we pay for it
- GitHub Pages learning curve

# DigitalOcean Pros and Cons

## Pros

- The environment has already been set up for the project previously on DigitalOcean so there would be significantly less time involved in setting everything up
- Both our back-end and front-end servers can be hosted and deployed on a single place making it more convenient for CI/CD and maintenance
- People in charge of service maintenance are more familiar with DigitalOcean
- Custom domain already set up and payed for

## Cons

- Server managed by us, so extra layer of complexity added in case something happens to the server
- Bus factor decreases because only a handful of people can make changes to the server if needed
- We must set-up deployment to the external server somehow within GitHub Actions

# Conclusion

Both the deployment set-up as in GitHub Actions and the management of the server add extra complexity, but this is mitigated since GitHub Actions has a workflow for ssh deployment and the people in charge of deployment and service maintenance are actually more familiar with DigitalOcean than GitHub Pages. This makes the rest of the pros to keeping the live version on DigitalOcean even more attractive since in the case of GitHub Pages we would still probably have to hold the DigitalOcean version of the back-end running making a lot of the pros of GitHub Pages less significant. In conclusion, the weight of the cons for both of them is fairly equal, yet the weight of the pros of DigitalOcean is more significant that GitHub Pages. Thus DigitalOcean was chosen.

# Consequences

The live-version of the application depends on the DigitalOcean server and as such depends on the people with access and knowledge about the maintenance of the server. This effectively lowers the Bus Factor, but not to an unacceptable degree.