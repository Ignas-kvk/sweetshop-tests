import { BASE, routes } from "../support/constants";

describe("Sweet Shop – account page (after login)", () => {
  // small helper to reach the post-login HTML page reliably
  function loginAndLand() {
    cy.visit(`${BASE}${routes.login}`);
    cy.get("#exampleInputEmail").type("test@user.com");
    cy.get("#exampleInputPassword").type("qwerty");
    cy.contains("button", /^Login$/).click();
    // the app redirects to a UUID-ish html file
    cy.location("pathname").should("match", /\/[0-9a-f-]+\.html$/i);
  }

  beforeEach(() => {
    loginAndLand();
  });

  it("shows 'Your Account' header and greets the user", () => {
    cy.contains("h1.display-3", "Your Account").should("be.visible");
    cy.contains(".lead a[href='#']", "test@user.com").should("be.visible");
  });

  it("navbar highlights Basket and shows a badge", () => {
    cy.get('li.nav-item.active > a.nav-link[href="/basket"]').should("exist");
    cy.get('a.nav-link[href="/basket"] .badge').should("contain.text", "0");
  });

  it("shows basket summary block with empty list initially", () => {
    cy.contains("h4 span.text-muted", "Your Basket").should("be.visible");
    cy.get(".badge.badge-secondary.badge-pill").should("have.text", "0");
    cy.get("#basketItems").should("exist").and("be.empty");
  });

  it("renders previous orders table with 3 rows and safe sort links", () => {
    cy.get("#transactions").should("exist");
    cy.get("#transactions tbody tr").should("have.length", 3);

    // rows contain expected seed data
    cy.get("#transactions tbody tr").eq(0).within(() => {
      cy.get("th[scope='row']").should("contain.text", "#1");
      cy.get("td").eq(1).should("contain.text", "Swansea Mixture");
      cy.get("td").eq(2).should("contain.text", "1.50");
    });

    // header links call javascript:SortTable(...) — clicking should not navigate away or crash
    cy.get("#transactions thead a.order-number")
      .should("have.attr", "href")
      .and("match", /^javascript:SortTable\(/);

    cy.get("#transactions thead a.order-date")
      .should("have.attr", "href")
      .and("match", /^javascript:SortTable\(/);

    cy.get("#transactions thead a.order-description")
      .should("have.attr", "href")
      .and("match", /^javascript:SortTable\(/);

    cy.get("#transactions thead a.order-total")
      .should("have.attr", "href")
      .and("match", /^javascript:SortTable\(/);

    // Click each sort link; table should still be present with 3 rows afterwards
    cy.get("#transactions thead a").each(($a) => {
      cy.wrap($a).click({ force: true });
      cy.get("#transactions tbody tr").should("have.length", 3);
    });
  });

  it("renders the Chart.js bar chart canvas", () => {
    cy.get("#transactionChart")
      .should("be.visible")
      .and(($c) => {
        // Chart.js sets intrinsic canvas size
        expect($c[0].width, "canvas width").to.be.greaterThan(0);
        expect($c[0].height, "canvas height").to.be.greaterThan(0);
      });
  });

  it("can navigate away via navbar (Sweets)", () => {
    cy.get('a.nav-link[href="/sweets"]').click();
    cy.location("pathname").should("eq", routes.sweets);
  });
});