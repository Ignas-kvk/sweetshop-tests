export function addProductToBasket(productName) {
  cy.contains("h4,h3", productName)
    .closest(".card")
    .find(".card-footer .addItem")
    .click({ force: true });
}
