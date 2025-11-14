import { BASE, routes } from "../support/constants";

const nav = {
  homeBrand: 'a.navbar-brand[href="/"]',
  sweets: 'a.nav-link[href="/sweets"]',
  about: 'a.nav-link[href="/about"]',     // <-- what SHOULD exist
  login: 'a.nav-link[href="/login"]',
  basket: 'a.nav-link[href="/basket"]',
};

const assertPage = {
  home() {
    cy.contains("h1.display-3", "Welcome to the sweet shop!").should("be.visible");
  },
  sweets() {
    cy.contains("h1.display-3", "Browse sweets").should("be.visible");
  },
  about() {
    cy.contains("h1.display-3", "Sweet Shop Project").should("be.visible");
  },
  login() {
    cy.contains("h1.display-3", "Login").should("be.visible");
  },
  basket() {
    cy.contains("h1.display-3", "Your Basket").should("be.visible");
  },
};

describe("Sweet Shop – full navigation (all links clicked)", () => {

  // Helper that clicks a navbar link and verifies the target page
  function clickAndVerify(selector, expectedPath, verifyFn) {
    cy.get(selector).click({ force: true });        // <-- will FAIL for broken links
    cy.location("pathname").should("eq", expectedPath);
    verifyFn();
  }

  //
  // 1. FROM HOME
  //
  it("from Home → all navbar links work", () => {
    cy.visit(`${BASE}${routes.home}`);
    assertPage.home();

    clickAndVerify(nav.sweets, routes.sweets, assertPage.sweets);
    cy.visit(`${BASE}${routes.home}`);

    clickAndVerify(nav.about, routes.about, assertPage.about);
    cy.visit(`${BASE}${routes.home}`);

    clickAndVerify(nav.login, routes.login, assertPage.login);
    cy.visit(`${BASE}${routes.home}`);

    clickAndVerify(nav.basket, routes.basket, assertPage.basket);
  });

  //
  // 2. FROM SWEETS
  //
  it("from Sweets → all navbar links work", () => {
    cy.visit(`${BASE}${routes.sweets}`);
    assertPage.sweets();

    clickAndVerify(nav.homeBrand, routes.home, assertPage.home);
    cy.visit(`${BASE}${routes.sweets}`);

    clickAndVerify(nav.about, routes.about, assertPage.about);
    cy.visit(`${BASE}${routes.sweets}`);

    clickAndVerify(nav.login, routes.login, assertPage.login);
    cy.visit(`${BASE}${routes.sweets}`);

    clickAndVerify(nav.basket, routes.basket, assertPage.basket);
  });

  //
  // 3. FROM ABOUT
  //
  it("from About → all navbar links work", () => {
    cy.visit(`${BASE}${routes.about}`);
    assertPage.about();

    clickAndVerify(nav.homeBrand, routes.home, assertPage.home);
    cy.visit(`${BASE}${routes.about}`);

    clickAndVerify(nav.sweets, routes.sweets, assertPage.sweets);
    cy.visit(`${BASE}${routes.about}`);

    clickAndVerify(nav.login, routes.login, assertPage.login);
    cy.visit(`${BASE}${routes.about}`);

    clickAndVerify(nav.basket, routes.basket, assertPage.basket);
  });

  //
  // 4. FROM LOGIN
  //
  it("from Login → all navbar links work", () => {
    cy.visit(`${BASE}${routes.login}`);
    assertPage.login();

    clickAndVerify(nav.homeBrand, routes.home, assertPage.home);
    cy.visit(`${BASE}${routes.login}`);

    clickAndVerify(nav.sweets, routes.sweets, assertPage.sweets);
    cy.visit(`${BASE}${routes.login}`);

    clickAndVerify(nav.about, routes.about, assertPage.about);
    cy.visit(`${BASE}${routes.login}`);

    clickAndVerify(nav.basket, routes.basket, assertPage.basket);
  });

  //
  // 5. FROM BASKET
  //
  it("from Basket → all navbar links work (About MUST navigate)", () => {
    cy.visit(`${BASE}${routes.basket}`);
    assertPage.basket();

    clickAndVerify(nav.homeBrand, routes.home, assertPage.home);
    cy.visit(`${BASE}${routes.basket}`);

    clickAndVerify(nav.sweets, routes.sweets, assertPage.sweets);
    cy.visit(`${BASE}${routes.basket}`);

    clickAndVerify(nav.login, routes.login, assertPage.login);
    cy.visit(`${BASE}${routes.basket}`);

    // ❌ This is where the test FAILS when href="bout"
    clickAndVerify(nav.about, routes.about, assertPage.about);
  });

});
