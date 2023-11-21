# Keewe test backend

## Installation

Import the project in your current repository:

### `git clone https://github.com/maxou75/keewe-test-backend.git`

In the project directory, install the dependencies with:

### `npm install`

Then run the server:

### `npm start`

It will run the server on default port 3000

To run the unit tests:

### `npm test`

## Conception

I decided to implement a service that uses a local NoSQL database called RxDB for its simplicity and efficiency. Indeed, it uses the process storage, so it is not persistent. 
I also implemented a service to call an external API (currencyapi.com) to have real-time currencies in the app. I am limited to 300 calls due to the free account limitation so, please use the static in-code currencies value if necessary. 
I first wanted to use exchangeratesapi.io, but it turned out that this API only allowed me to get EUR currencies. 
Furthermore, I have all the tests in the app.controller.spec.test.ts file that check that all services work well and return errors if necessary.

There are 4 REST API services :
- Fetch the currencies. 
- Get a conversion currency value. It uses the real-time currencies to calculate a specified amount for a specified allowed currency. 
- Insert a new payment. It inserts the payment into a specific collection. 
- Retrieve all the payments. It gets the payments from the specific collections.