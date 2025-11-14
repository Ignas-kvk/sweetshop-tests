import { BASE, routes } from "../support/constants";

describe("Sweet Shop – login", () => {
  beforeEach(() => {
    cy.visit(`${BASE}${routes.login}`);
  });

  it("navbar shows Login as active and basket badge", () => {
    cy.get('li.nav-item.active > a.nav-link[href="/login"]').should("exist");
    cy.get('a.nav-link[href="/basket"] .badge').should("contain.text", "0");
  });

  it("renders header and helper text (abbr shows demo creds)", () => {
    cy.contains("h1.display-3", "Login").should("be.visible");

    // abbr titles reveal demo creds
    cy.get('p.lead abbr[title="test@user.com"]').should("exist");
    cy.get('p.lead abbr[title="qwerty"]').should("exist");
  });

  it("email/password fields have correct attributes (soft)", () => {
  const errors = [];

  // helper
  const checkAttr = (label, $el, name, expected) => {
    try {
      const val = $el.attr(name);
      expect(val, `${label} @${name}`).to.eq(expected);
    } catch (e) {
      errors.push(`❌ ${label}: expected @${name}="${expected}"`);
    }
  };
  const checkHasAttr = (label, $el, name) => {
    try {
      expect($el.attr(name), `${label} has @${name}`).to.not.be.undefined;
    } catch (e) {
      errors.push(`❌ ${label}: missing @${name}`);
    }
  };

  // Email field
  cy.get("#exampleInputEmail").then(($el) => {
    const label = "#exampleInputEmail";
    checkAttr(label, $el, "type", "email");
    checkHasAttr(label, $el, "required");
    checkAttr(label, $el, "maxlength", "255");
    checkAttr(label, $el, "tabindex", "1");
  });

  // Password field
  cy.get("#exampleInputPassword").then(($el) => {
    const label = "#exampleInputPassword";
    checkAttr(label, $el, "type", "password");
    checkHasAttr(label, $el, "required");
    checkAttr(label, $el, "maxlength", "30");
    checkAttr(label, $el, "onpaste", "return false;");
  });

  // fail once after all checks ran
  cy.then(() => {
    if (errors.length) {
      throw new Error(`Soft assertion failures:\n - ${errors.join("\n - ")}`);
    }
  });
});


  it("hidden dateTime is populated at runtime (not the hard-coded value)", () => {
    // The HTML ships with a fixed value, script updates it on load.
    cy.get("#dateTime")
      .should("have.attr", "type", "hidden")
      .invoke("val")
      .should("not.eq", "11/5/2025, 10:36:26 AM");
  });

  it("login button id is randomized to start with 'btn_'", () => {
    // Obfuscated script rewrites id to something like "btn_xxxxx"
    cy.get(".btn.btn-primary").should(($btn) => {
      const id = $btn.attr("id");
      expect(id, "dynamic id").to.match(/^btn_/);
    });
  });

  it("shows validation messages on empty submit", () => {
    cy.contains("button", /^Login$/).click();
    cy.get(".invalid-email").should("be.visible");
    cy.get(".invalid-password").should("be.visible");
  });

  it("allows logging in with demo creds and navigates away", () => {
    cy.login("test@user.com", "qwerty");

    // The page JS redirects to a specific .html file upon 'valid' input
    cy.location("pathname").should("match", /\/[0-9a-f-]+\.html$/i);

    // App chrome still present on the target page
    cy.contains("footer .container", "Sweet Shop Project 2018").should("be.visible");
  });


  it("social icons are present and images load", () => {
    cy.get(".social img[alt='twitter'], .social img[alt='facebook'], .social img[alt='linkedin']")
      .should("have.length", 3)
      .each(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });
});