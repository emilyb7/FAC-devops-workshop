![status](https://github.com/emilyb7/actions-test/workflows/CI/badge.svg)

# Deploying a Node.js web app with GitHub actions and Heroku

This is a step-by-step guide to setting up and deploying a Node.js app with a CI/CD pipeline that ensures your app works reliably.

We'll follow these basic principles:

- You can deploy your app with confidence at any time, from anywhere
- Your configuration will live in your code (checked into GitHub wherever it is safe to do so)
- Everything will be tested
- You will be alerted straight away if something goes wrong during or after deployment

## What are we building?

A simple "Hello world" app using Node.js and Express.

We'll deploy to Heroku. For automating our workflow we'll use GitHub Actions. We'll also use ESLint, prettier and tape.

Note that my choice of tooling is entirely optional. You could achieve the same when deploying to a different platform, when using a different programming language, or using a different build tool. The most important thing here is to understand how continuous integration can help you to write better apps :)

## Workshop

We'll work through this workshop in pairs and take regular breaks to catch up as a group.

### Step 0: setup

Create your project directory and accept the default package.json configuration by running `npm init --y`

Create your `.gitignore` file.

Make sure you commit your code as often as possible.

### Step 1: configure ESLint

By now, you're probably already familiar with ESLint, but just in case you need a reminder, ESLint is a linting tool for JavaScript. Linting tools typically analyse your code and identify potential issues with syntax or code quality.

ESLint is fully configurable. That means you can choose how strict you want to be, and what's most important to you.

ESLint is a really great way to enforce shared best practices across a team.

I recommend setting up as strict an ESLint configuration as you feel comfortable with at the very beginning of your project. You should agree on some rules with your team.

You can also use a configuration written by someone else. I like AirBnB's because it's very strict and pushes best practices. I'm also going to configure ESLint to work well with prettier (otherwise sometimes they can clash).

To start your configuration, you can copy my `.eslintrc.js` from this project.

You'll need to install the following dev dependencies to make it work:

- eslint
- eslint-config-airbnb-base
- eslint-config-prettier
- eslint-plugin-import
- eslint-plugin-prettier
- prettier

#### Let's test our config

Create a test file, `test.js`.

Write some badly formatted code as an example.

Run prettier and check that it formats our code how we like it:

`./node_modules/.bin/prettier . --write`

(for a reminder of how running scripts like this works, check this [intro to NPM](https://github.com/foundersandcoders/npm-introduction#npm-scripts))

**Tip**: if your text editor is already formatting your JavaScript files for you, you should turn this off temporarily just to check that the command works for you; we're going to need it to work again later)

Let's add some more code, such as a dirty `console.log("hello")`. Prettier won't mind, but ESLint should warn you that console.logs don't belong in your production code.

Let's check by running `./node_modules/.bin/eslint . --fix`

You should see an error.

I've created scripts for these two commands because they're really useful and I plan to use them a lot. I want to make sure everyone on my team is using the same commands by default too. Have a look at the `scripts` section of the `package.json` for an example.

Now I can just run `npm run lint` whenever I want.

### Step 2: automation

ESLint and prettier are great tools but we don't want to remember to run commands _every_ time we change our code.

[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) are a good way of making sure your code is checked regularly - every time you commit. This will keep your local branch clean, but more importantly stop bad code from being checked into GitHub.

You can create Git Hooks manually by writing bash scripts and adding them the the hidden `.git` folder in your project directory (you can try this out if you're curious, but it's not part of this workshop).

A nice JavaScript library called [Husky](https://github.com/typicode/husky) is a much nicer way of doing this.

Let's install husky 🐶 `npm install husky --save --dev`

Take a look at husky's documentation. Can you do the following?

- Create a hook that ensures all code is formatted with prettier before committing
- Create a hook that runs ESLint before committing; it should prevent the commit if you have any errors

(Shout if you have issues getting Husky working, it can be a bit fiddly sometimes depending on your setup and your operating system!)

What else do you think Husky might be useful for? Why is it a good idea to set up your Git Hooks using Husky instead of manually adding them to your `.git` directory?

### Step 3: enforcing checks

So, Husky is great, right? It's already provided us with a minimal CI (continuous integration) tool, which will allow us to commit only clean and error-free code ✨.

Some benefits of using Husky to manage pre-commit hooks:

- You can easily enforce some rules/checks for your project
- You can share these with other developers who you're working with
- You get fast feedback on your work without relying on a remote server (this point might sound confusing right now, but you should hopefully understand better by the end of the workshop what this means)

**But** Husky doesn't actually **force** us to follow our own rules. We can disable it anytime but just changing the package.json and changing it back again.

Or, even easier, if you really want to commit your dirty code, you can just run `git commit --no-verify -m <your-commit-message>`.

This is fine. It's just our local branch. You can go wild with it, but do so consciously. But we really, really don't want bad code to end up in the main branch.

For this reason, we're going to use GitHub actions to run the linter on all pull requests made in our repo. This will run the same checks as we do locally, but it'll do so on a _remote server_ instead of on our machines. If ESLint finds bad code, we won't be able to merge our PR.

CI providers give us a really powerful tool. Most of them let us run our code on their servers for FREE as long as your project is open-source. (Companies with big codebases who want to keep these closed source pay a LOT of money for these tools).

I copied GitHub's example action when creating my `build` job (workflows/main.yml).

This is the custom bit needed to run ESlint.

```yml
- name: Install
  run: npm install

- name: Lint
  run: npm run lint
```

### Step 4: Commit and test your Github action

You won't know your action works until you've seen it fail!

Use my example (main.yml) and the documentation [here](https://docs.github.com/en/actions/quickstart) to create an action that runs ESLint over your JavaScript files.

Break something in your `test.js` file, commit with `--no-verify` and wait for your action to run on GitHub (you just need to go to the actions tab)

You should see your action fail.

Fix your code. Commit again, and watch everything go green.

I really recommend changing your GitHub project settings to require all status checks to pass before allowing you to merge into main.

### Step 5: Adding tests to our workflow

I'm using tape for my project. In `test.js` you'll see a test checking that my Express app returns `Hello, world!` and a 200 status code on requests to `/`.

Before writing any code to make the tests pass, I updated my husky config and my GitHub action and made sure that these fail.

See if you can do the following without copying from my example:

- Write a failing test for whatever you like
- Update your pre-commit hook checks to prevent failing tests
- Commit your failing test anyway
- Update your GitHub actions to run your tests
- Fix your tests!
- Add a new test for an Express app, and make it pass

Tip: I created the `test:quiet` command to run as part of the pre-commit hook, so that my terminal doesn't fill up with output from my tests each time I commit.

### Step 6: Deployment

Our app doesn't do much, but we want to deploy right away. Time to go to Heroku and create a new app.

I cut some some corners here. Here's how I'm managing my deployment workflow:

1. Create app via Heroku UI
2. Go to "deployment" in your app settings
3. Under "Deployment method", tick "GitHub"
4. Enable automatic deploys from the main branch (that means every time you merge something into main, your changes will go straight to Heroku)

Here is what I would do if I had a little more time, but you'll probably find it to be overkill for a smallish project:

1. Create and configure your app from within your repo (I would use [Terraform](https://www.terraform.io/) but there are other solutions)
2. Write a deployment script using the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli), and create a GitHub action for this
3. Deploy automatically every time your main branch is updated on GitHub

This is better because **all the configuration lives in our code**, and Heroku doesn't do any extra magic for us.

### Step 7: Oops our app's broken! Know how to roll back changes when something goes wrong

I deployed my app to Heroku but it looks like, in spite of all my testing, I've done something wrong!

https://actions-test-2020.herokuapp.com/

Luckily, I realised straight away. But what if you push your code to main, go to make yourself a cup of tea, get caught up talking to your product manager, and within 20 minutes, your app has been broken for 500 paying users?

How can you avoid this? Try and think about what you could do before reading my solution below. (You don't need to know how).

---

There are lots of third party services that will measure your "uptime" (how many minutes per day your app is working for). But I've done something simpler here. In `workflows/deployment.yml` I've got another action that will listen for deployment status changes from Heroku. If something changes, it will make a simple HTTP request to our app.

If that fails, we'll get an alert (GitHub actions automatically sends you an email notification when a job fails, but you could set up additional alerting, e.g. via your team's Slack).

### Sometimes apps just break

Deployments aren't the only thing that can break your app. Downtime is inevitable. If uptime is important to you, you could set up an action that runs on a schedule (e.g. every hour throughout the day) and checks that your app is up and running.

If you want to do more than just check for a 200 status code, you could also check the page contents (in our case, it should say "Hello, World!")

For anything more complicated, you could consider using a browser-based integration testing tool like Cypress.

## Rollback strategy

If your deployment fails, you need to be able to revert your changes quickly. Using `git revert` is a good way to roll back a change.

You could also configure GitHub actions to do this for you as soon as a check to your production app fails :)

## Final discussion

That's all and I hope you've learnt that continuous integration can help you develop faster rather than hold you back unnecessarily (which is what I thought for a long time!!)

When designing your own CI/CD workflow, you should think about what tooling is right for your needs and the needs of your users.
