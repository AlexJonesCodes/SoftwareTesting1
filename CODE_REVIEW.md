# Code Review Criteria and Findings

## Review criteria (applied scope)
The following criteria were applied to API endpoints and auth middleware:

1. **Authorization and access control**: verify protected resources validate roles and ownership consistently.
2. **Input validation and data integrity**: ensure IDs and user input are validated, and queries match schema fields.
3. **Error handling and null safety**: avoid null dereferences, return consistent status codes/messages, and log errors safely.
4. **Route uniqueness and maintainability**: avoid duplicate routes and ensure each route has a single, clear responsibility.

## Findings (issues identified)

1. **Duplicate route definition for user lookup**
   - `GET /user/:userID` is defined twice, which can lead to unexpected behavior and makes maintenance harder.
   - File: `endpoints/users.js` (two separate route handlers for the same path).
   - Recommended change: remove the duplicate block and consolidate logic into a single handler.

2. **Incorrect query field for user lookup**
   - The user lookup uses `User.findOne({ user: userID })`, but the schema uses `_id` for identifiers.
   - File: `endpoints/users.js`.
   - Recommended change: replace with `User.findById(userID)` or `User.findOne({ _id: userID })`.

3. **Error variable mismatch in login**
   - In the login callback, the variable is `error` but the response references `err`, which is undefined and will throw.
   - File: `endpoints/users.js`.
   - Recommended change: return the actual `error` in the response or log it consistently.

4. **Missing null checks before authorization checks**
   - Order update/delete flows access `orderFound.user` before confirming the order exists.
   - File: `endpoints/orders.js`.
   - Recommended change: check `orderFound` and return `404` before using properties.

5. **Missing null checks when deleting users**
   - The delete user flow uses `userFound.role` without checking if the user exists.
   - File: `endpoints/users.js`.
   - Recommended change: handle the not-found case with a `404` response before role checks.

## Suggested follow-up tasks
- Add automated regression tests for the above cases to prevent reintroduction.
- Update API docs to reflect exact error codes/messages for these branches.
