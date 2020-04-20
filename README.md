# Deploying with GitHub actions and heroku

A (mostly) pain-free workflow for deploying a Node.js app

*(I wrote this for a talk I'm giving, sorry if it looks like random nonsense)*

Some principles I want to follow here:

- Deploy anytime
- Configuration should live in your code
- Everything should be tested
- Be in control if something goes wrong

## What is this project?

A simple "Hello world" app using Node.js and Express

## Why so complicated?

This project can be used as a boilerplate for setting up a Node.js app. Future deployments should be super easy, so you can add fetures quickly.

## How can you make your own?

Here's a step-by-step guide as to how I went about setting up this project.

### Local setup

We'll be using `yarn` here, but this can easily be switched out for NPM.

Set up your project and accept the default configuration by running `yarn init --y`

We'll start by installing some basic tools: eslint and prettier. See my example Eslint config. I'm using airbnb's config as a base, because it enforces good practices and requires minimal custom configuration.

Create a test file, `test.js`. Add some simple code, like `console.log("Hello, world!")`. Check that prettier and eslint run properly. Here are some basic commmands:

`yarn eslint . --fix`
`yarn prettier . --write`

### Automating formatting and checks

We don't want to have to run those commands manually everytime, so we're going to set up some Git hooks to run them for us.

Husky is a great tool for configuring shared git hooks. That means you and anyone else you're collaborating with can share the same commit hooks.

Install husky by running `yarn add husky --dev`

_Husky relies on a post-install hook to do some essential setup on your project. If you've (very sensibly) disabled scripts via yarn or NPM, you'll need to re-enable this setting before installing husky. If you don't know what this means, just ignore and skip to the next bit._

To get husky running, you can add this block of code to your `package.json`

```
"husky": {
  "hooks": {
    "pre-commit": "yarn prettier . --write && yarn eslint . --fix"
  }
}
```

This will make sure your code is clean and formatted and free of syntax errors before anything is commited.

You can do loads of other things with Git hooks, like running your tests or enforcing good commit message style.


### Enforcing checks

Husky has already provided us with a minimal CI (continuous integration) tool, which will allow us to commit clean and error-free code.

Some benefits of using Husky to manage pre-commit hooks:
- You can easily enforce some rules/checks for your project
- You can share these with other developers who you're working with
- If you're in a hurry and want to commit code without running the checks, you can just run `git commit --no-verify`
- You get fast feedback on your work without relying on a remote server

Why Husky isn't always enough...
- It's not enforced (you can skip it)
- Your local environment might be quite different to the server where your app runs in production
- You have no record of success or failure, no history of things that might have gone wrong with your code in the past (no artifacts - this might not seem important right now, but sometimes it's a really valuable thing)

For this reason, we're going to use GitHub actions to run the linter on all PRs made in our repo. If eslint errors, we won't be able to merge our PR.

You can swap GitHub actions out for any other CI provider (e.g. Circle CI, Travis or Heroku CI). But it's easy to get up and running quickly with GitHub.

CI providers give us a really powerful tool. Most of them let us run our code on their servers for FREE as long as your project is open-source. There are plenty of companies out there who are paying a LOT of money for a service that's only slightly better.

I copied GitHub's example action when creating my `build` job (workflows/main.yml).

This is the custom bit needed to run eslint:

```
- name: Install
  run: yarn install

- name: Lint
  run: yarn eslint .
```

This is surprisingly simple. I didn't even need to tell it I'm running Node, or that I'm using yarn!


### Test your Github action

You won't know youre action works until you've seen it fail!

Break something in your `test.js` file, commit with `--no-verify` and wait for your action to run on GitHub (you just need to go to the actions tab)

You should see your action fail.

Fix your code. Commit again, and watch everything go green.

Tip: make sure no one can merge a broken branch into master by going to your project settings, `-> branches -> protect matching branches -> "require status checks to pass before merging"`


### Running tests

I'm using tape for my project. In `test.js` you'll see a test checking that my Express app returns `Hello, world!` and a 200 status code on requrests to `/`.

Before writing any code to make the tests pass, I updated my husky config and my github action and made sure that these fail.

Then I wrote the code to make the test go green. I created the `test:quiet` command to run as part of the pre-commit hook, so that my terminal doesn't fill out with output from my tests.


### Deploying to Heroku

Our app doesn't do much, but we want to deploy right away. Time to go to Heroku and create a new app.

I cut some some corners here. Here's how I'm managing my deployment workflow:

1. Create app via Heroku UI
2. Go to "deployment" in your app settings
3. Under "Deployment method", tick "GitHub"
4. Enable automatic deploys from the master branch (that means everytime you merge something into master, your changes will go straight to Heroku)


This is what would be better (but more work for a small project):

1. Create and configure your app from within your repo (I would use Terraform but there are probs other solutions)
2. Write a deployment script using the Heroku CLI, and create a GitHub action for this
3. Deploy automatically every time the master branch is updated

This is better because all the configuration lives in our repo, and Heroku doesn't do any extra magic for us.

### Oops our app's broken

We missed some server-side code. But how do we make sure that we always know right away when our app is broken?

There are lots of third party services that will measure your "uptime" (how many minutes per day your app is working for). But I've done something simpler here. In `workflows/deployment.yml` I've got another action that will listen for deployment status changes from Heroku. If something changes, it will make a simple HTTP request to our app.

If that fails, we'll get an alert (GitHub actions automatically sends you a notification when a job fails, but you could set up additional alerting, e.g. via your team's Slack).


### Sometimes apps just break

Deployments aren't the only thing that can break your app. Downtime is unavailable. If uptime is important to you, you could set up an action that runs on a schedule and checks that your app is up and running.

If you want to do more than just check for a 200 status code, you could also check the page contents (in our case, it should say "Hello, World!")

For anything more complicated, you could consider using a browser-based integration testing tool like Cypress.


## Rollback strategy

If your deployment fails, you need to be able to revert your changes quickly. Using `git revert` is a good way to roll back a change.

If you've made changes to your underlying infrastructure, e.g. a database migration, you need to have a strategy in place for rolling that back too.
