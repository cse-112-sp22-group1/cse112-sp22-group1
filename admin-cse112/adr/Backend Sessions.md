# Backend Sessions

Created: May 12, 2022 12:03 PM
Last Edited Time: May 12, 2022 12:20 PM
Status: In Progress
Type: Tech Stack

# Context

The previous version of the backend didn’t use cookies for authentication, but rather sent the user’s password to the backend as an auth token each time a request was made. This caused some problems with Boojo not work on many browsers.

# Decision Summary

We have moved to use session cookies instead of sending the password to the backend every time we want to make an API call. This makes things easier since it doesn’t require a user to post/put data in order to read from the API. Instead the session handles all identification for the user on the server side, minimizing the risk that users will modify other users they are not currently logged in to.

# Session Cookies

## Pros

- Supported by all major browsers
- Allows us to store secrets securely on the server side rather than client side
- Allows us to enforce a maximum lifetime for a session easier

## Cons

- Cookies often get deleted, requiring the user to auth again
- We have to redo how user data is encrypted since they no longer send their password with each request

# Conclusion

The backend now has two routes:

- /auth which accepts the POSTing of a JSON object and returns a JSON object described below:

```jsx
/* Request */
{ email: "user@email.com", pwd: "qwerty" }
/* Reply */
{ error: null } // Success
{ error: "authentication failed" } // Failure
```

- /user which accepts GET, POST, PUT, and DELETE methods.
    - GET: Gets the user JSON object for the currently authenticated user, or returns an object with an error message.
    - POST: Creates a new user given an email and password.
    - PUT: Updates the currently authenticated user’s DB entry with the updated information.
    - DELETE: Deleted the currently authenticated user

The way encryption is handled as well has changed from using the user’s password as a key to deriving a key from a combination of the user’s password and some server secrets. This is stored in the user’s session information on the server side.

# Consequences

We have to drop our entire production DB since we change the way encryption is handled, meaning all the data that was encrypted the old way can no longer be encrypted the new way. API routes have changed to reflect that we are no longer POSTing data to identify users when reading or deleting them. This required changed on the frontend to deal with this new backend.