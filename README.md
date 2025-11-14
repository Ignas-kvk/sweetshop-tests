# 📥 How to Download the Project

### Option 1 — Clone with Git (recommended)

git clone https://github.com/Ignas-kvk/sweetshop-tests.git

cd sweetshop-tests

### Option 2 — Download ZIP

Go to the GitHub repository

Press Code → Download ZIP

Extract the ZIP

Open the folder in VS Code

# 📦 Install Dependencies

Before running Cypress for the first time, install all required npm packages:

npm install


This installs:

Cypress

All support utilities used by the tests

# 🚀 Running Tests Locally

You can run Cypress in two ways:

### ✅ 1. Interactive Mode (opens Cypress GUI)
npx cypress open


Choose E2E Testing, then select a browser and run any test file.

### ✅ 2. Headless Mode (run all tests in terminal)
npx cypress run


Run a single spec:

npx cypress run --spec "cypress/e2e/home.cy.js"
