# Stripe Terminal Backend code

### Running locally on your machine
If you prefer running the backend locally, ensure you have the required Ruby runtime version installed as per the latest Gemfile in this repo.

You'll also need the correct Bundler version, outlined in the Gemfile.lock under the BUNDLED_WITH directive.

Clone down this repo to your computer, and then follow the steps below:

Create a file named .env within the newly cloned repo directory and add the following line:
STRIPE_TEST_SECRET_KEY={YOUR_API_KEY}
In your terminal, run bundle install
Run ruby web.rb
The example backend should now be running at http://localhost:4567
Go to the next steps in this README for how to use this app
Running locally with Docker
We have a pre-built Docker image you can run locally if you're into the convenience of containers.

### Install Docker Desktop if you don't already have it. Then follow the steps below:

In your terminal, run docker run -e STRIPE_TEST_SECRET_KEY={YOUR_API_KEY} -p 4567:4567 stripe/example-terminal-backend (replace {YOUR_API_KEY} with your own test key)
The example backend should now be running at http://localhost:4567
Go to the next steps in this README for how to use this app