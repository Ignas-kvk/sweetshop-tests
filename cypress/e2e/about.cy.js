import { BASE, routes } from "../support/constants";

describe("Sweet Shop – About page", () => {
  beforeEach(() => {
    cy.visit(`${BASE}${routes.about}`);
  });

  it("renders header, text, and footer", () => {
    cy.contains("h1.display-3", "Sweet Shop Project").should("be.visible");
    cy.contains(".lead", "intentionally broken web application").should("be.visible");
    cy.contains(".lead", "common issues found in real-world web applications").should("be.visible");
    cy.contains("footer .container", "Sweet Shop Project 2018").should("be.visible");
  });

  it("navigates back to Sweets from the navbar", () => {
    cy.get('a.nav-link[href="/sweets"]').click();
    cy.location("pathname").should("eq", routes.sweets);
  });
  });