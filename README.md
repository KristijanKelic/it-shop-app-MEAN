# AWT-FinalProject

This is the final project for the Advanced Web Technology course. I used the MEAN stack.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
NodeJS -> get it from (https://nodejs.org/en/)
angularCLI -> install it globally on your machine with npm install -g @angular/cli (install NodeJS first to get npm tool)
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
To run everything you will need to do few steps:
1. First navigate to nodejs-awtproject and open terminal window there and install dependencies with npm install
2. Same as step one you will need to navigate to angular-awtproject and run npm install there also
3. After you have successfully installed everything navigate to nodejs folder and in your terminal run npm start to run restAPI locally, then navigate to angular folder and type ng serve -o in your terminal to serve client side application
4. That should be it :)
5. Make sure you add images folder inside nodejs folder for file storing to work
```

## NOTE
This app uses mongodb atlas and stripe. That means you need to provide some keys before running app.
```
For mongodb connection go to (https://cloud.mongodb.com) create new account, cluster and one user with access to read write any database. Go to index.js file in nodejs-awtproject and paste your username and password in mongodb connection string at bottom of the file.

For stripe you need to create account on (https://stripe.com). After that go to dashboard and create 2 test keys (1 public and 1  secret). Copy public key and paste it in angular-awtproject/src/app/auth/auth.module.ts in appropriate palce. Copy secret key and paste it in nodejs-awtproject/controllers/order.js in appropriate place.

That's it :-)
```

## Built With

* [Angular](https://angular.io/) - Javascript framework for client side applications
* [NodeJS](https://nodejs.org/en/) - Javascript runtime environment for serverside javascript (server)
* [npm](https://www.npmjs.com/) - Used to handle packages installations
* [mongoDB](https://www.mongodb.com/) - MongoDB Atlas is used as a database

## Authors

* **Kristijan Kelić**
