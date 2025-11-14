// Add a product to basket by card title
Cypress.Commands.add("addItemByName", (name) => {
  cy.contains(".card", name)
    .find(".addItem")
    .click({ force: true });
});

// Reset basket
Cypress.Commands.add("clearBasket", () => {
  cy.contains('a[href="#"]', "Empty Basket").click({ force: true });
});

// Return basket count as number
Cypress.Commands.add("getBasketCount", () => {
  return cy
    .get('a.nav-link[href="/basket"] .badge')
    .invoke("text")
    .then((x) => Number(x.trim() || "0"));
});

// Simple login command
Cypress.Commands.add("login", (email, password) => {
  cy.get("#exampleInputEmail").clear().type(email);
  cy.get("#exampleInputPassword").clear().type(password);
  cy.contains("button", /^Login$/).click();
});