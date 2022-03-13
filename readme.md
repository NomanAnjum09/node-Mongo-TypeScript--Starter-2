### Node Starter With User Authentication

#### This program is Basic Starter Application for a Node,Express,Mongo,TypeScript application. This is version 2 of https://github.com/NomanAnjum09/NodeBasic-Auth-With-Passport1.

#### This version has better code quality, and simpler authentication code.

#### Please Include .env file to gitignore when your'e using this starter for your project and replace, values with your MongoDB url and JWT_SECRET

## How To Run
 Install node, and express on your system, then enter the project directory
 Run "npm install" to install all of the dependencies
 Run "npm start" to start the application

## Info
##### Project uses MongoDB database for storage and passport for session management. It uses Scope in user schema to define userRoles. Right now a Scope value of 1 means user is admin and he can use Private apis Like getAllUsers.

## Apis
1) User can register himself using http://localhost:4000/add-user =>POST,
 Body:{ "FullName":"Hello", "Email":"bcsd@gmail.com", "Gender":"Male", "DateOfBirth":"2014-04-03", "Password":"StrongPassword", "Scope":1 }
 "Scope" variable is setted on front considering Role of user. Scope 1 means user has admin scope hence user can use /get-all-users api, no other user can get data from this api

2) Admin can fetch details of all users using http://localhost:4000/get-all-users =>GET

3) Users must use http://localhost:4000/signin =>POST, api to get their respective tokens. Their is no need to attach token to header as this token is being set to new requests after login into Cookies
 body:{ "Email": "abcd@gmail.com", "Password": "StrongPassword" }

4) Users can use http://localhost:4000/edit-user => PUT, to edit their details, body: { "FullName":"HelloWorld" //updated Data here }

5) Users can use http://localhost:4000/get-user/ =>GET, to get his own details

6) User can use http://localhost:4000/sign-out =>GET to signout of the application.

7) Admin can delete a particular user using http://localhost:4000/delete-user/:id =>DELETE