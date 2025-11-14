const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://sweetshop.netlify.app",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    pageLoadTimeout: 60000, // gali padidinti iki 90000 jei kada prireiks

    setupNodeEvents(on, config) {
      // jei nereikia eventų – palik tuščią
      return config;
    },
  },
});
