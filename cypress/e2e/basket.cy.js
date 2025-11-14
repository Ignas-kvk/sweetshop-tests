import { BASE, routes } from "../support/constants";

describe("Sweet Shop – basket page", () => {
  const basketBadge = 'a.nav-link[href="/basket"] .badge';

  it("renders the basket page chrome correctly", () => {
    cy.visit(`${BASE}${routes.basket}`);

    // Navbar state
    cy.get('li.nav-item.active > a.nav-link[href="/basket"]').should("exist");
    cy.get(basketBadge).should("contain.text", "0");

    // Header and summary block
    cy.contains("h1.display-3", "Your Basket").should("be.visible");
    cy.contains("span.text-muted", "Your Basket").should("be.visible");
    cy.get("#basketCount").should("have.text", "0");

    // The summary list always has a total row
    cy.get("#basketItems")
      .should("exist")
      .within(() => {
        cy.contains("span", "Total (GBP)").should("exist");
        cy.get("strong").should("contain.text", "£0.00");
      });

    // Delivery radios
    cy.get('#exampleRadios1').should("have.value", "0.00").and("be.checked");
    cy.get('#exampleRadios2').should("have.value", "1.99").and("not.be.checked");

    // Promo code + Empty Basket link
    cy.contains("button.btn.btn-secondary", "Redeem").should("exist");
    cy.contains('a[href="#"]', "Empty Basket").should("exist");

    // Basic billing form presence
    cy.get("#email").should("have.attr", "type", "email");
    cy.get("#address").should("have.attr", "required");
    cy.get("#country").should("have.value", "");
    cy.get("#city").should("have.value", "");
    cy.get("#zip").should("have.attr", "required");

    // Payment fields
    cy.get("#cc-name").should("have.attr", "required");
    cy.get("#cc-number").should("have.attr", "maxlength", "19");
    cy.get("#cc-cvv").should("have.attr", "type", "number");

    // Known bug on this page: About link is broken (missing leading slash)
    cy.get('a.nav-link[href="bout"]').should("exist"); // documenting the defect
  });

  it("adds items on /sweets then shows correct counts and totals on /basket (soft)", () => {
  const errors = [];

  const soft = (label, fn) => {
    try {
      fn();
    } catch (e) {
      errors.push(`❌ ${label}: ${e.message}`);
    }
  };

  cy.visit(`${BASE}${routes.sweets}`);

  // Start clean
  cy.get(basketBadge)
    .invoke("text")
    .then((text) => {
      soft("initial basket badge", () => expect(text.trim()).to.eq("0"));
    });

  // Add two items: Chocolate Cups (£1.00) + Wham Bars (£0.15) = £1.15
  cy.addItemByName("Chocolate Cups");
  cy.addItemByName("Wham Bars");

  cy.get(basketBadge)
    .invoke("text")
    .then((text) => {
      soft("basket badge after adding items", () => expect(text.trim()).to.eq("2"));
    });

  // Go to basket and check summary
  cy.visit(`${BASE}${routes.basket}`);

  cy.get("#basketCount")
    .invoke("text")
    .then((text) => {
      soft("#basketCount value", () => expect(text.trim()).to.eq("2"));
    });

  // Subtotal (without delivery)
  cy.get("#basketItems strong")
    .last()
    .invoke("text")
    .then((text) => {
      soft("subtotal text", () => expect(text.trim()).to.contain("£1.15"));
    });

  // Add Standard Shipping (£1.99) → total £3.14
  cy.get("#exampleRadios2").check({ force: true });

  cy.get("#basketItems strong")
    .last()
    .invoke("text")
    .then((text) => {
      soft("total with shipping", () => expect(text.trim()).to.contain("£3.14"));
    });

  // fail once after all checks
  cy.then(() => {
    if (errors.length) {
      throw new Error(`Soft assertion failures:\n - ${errors.join("\n - ")}`);
    }
  });
});


  it("Empty Basket clears items and resets totals", () => {
    // Ensure there is at least one item
    cy.visit(`${BASE}${routes.sweets}`);
    cy.addItemByName("Chocolate Cups");
    cy.get(basketBadge).should("have.text", "1");

    // Go to basket and empty using site behaviour
    cy.visit(`${BASE}${routes.basket}`);
    cy.clearBasket();

    // Back to sweets navbar badge should be 0 again (the header badge updates globally)
    cy.get(basketBadge).should("have.text", "0");
    cy.get("#basketCount").should("have.text", "0");
    cy.get("#basketItems strong").last().should("contain.text", "£0.00");
  });

it("billing form attribute sanity (soft, continues until end)", () => {
  const errors = [];

  const soft = (label, fn) => {
    try {
      fn();
    } catch (e) {
      errors.push(`❌ ${label}: ${e.message}`);
    }
  };

  cy.visit(`${BASE}${routes.basket}`);

  // Chain each Cypress command separately — all will run even if some fail
  cy.get("#name").then(($els) => {
    soft('duplicate id="name" (expected bug, 2 elements)', () => {
      expect($els.length).to.eq(2);
    });
  });

  cy.get("#email").then(($el) => {
    soft("#email required", () => expect($el.attr("required")).to.exist);
  });

  cy.get("#country").then(($el) => {
    soft("#country required", () => expect($el.attr("required")).to.exist);
  });

  cy.get("#city").then(($el) => {
    soft("#city required", () => expect($el.attr("required")).to.exist);
  });

  cy.get("#zip").then(($el) => {
    soft("#zip required", () => expect($el.attr("required")).to.exist);
  });

  cy.get("#cc-number").then(($el) => {
    soft("#cc-number maxlength=19", () => expect($el.attr("maxlength")).to.eq("19"));
  });

  // Final summary – executes once all Cypress commands complete
  cy.then(() => {
    if (errors.length) {
      throw new Error(`Soft assertion failures on billing form:\n - ${errors.join("\n - ")}`);
    }
  });
});

});