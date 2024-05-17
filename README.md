# Stripe Terminal Backend code

### Running locally on your machine
If you prefer running the backend locally, ensure you have the require Node JS installed.

Clone down this repo to your computer, and then follow the steps below:

Create a file named .env within the newly cloned repo directory and add the following line:
STRIPE_TEST_SECRET_KEY={YOUR_API_KEY}  // Can be your secret key
In your terminal, run bundle install
Run ruby code with 
```js
node index.js
```
### or

```js
pm2:start
```
The example backend should now be running at http://localhost:4567

### Running locally with Docker
We have a pre-built Docker image you can run locally if you're into the convenience of containers.

Install Docker Desktop if you don't already have it. Then follow the steps below:

In your terminal, run docker run -e STRIPE_TEST_SECRET_KEY={YOUR_API_KEY} -p 4567:4567 stripe/example-terminal-backend (replace {YOUR_API_KEY} with your own test key)
The example backend should now be running at http://localhost:4567


### Happy Coding!