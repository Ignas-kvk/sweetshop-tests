import { BASE, routes } from "../support/constants";

describe("Sweet Shop – catalog", () => {
  beforeEach(() => {
    cy.visit(`${BASE}${routes.sweets}`);
  });

  it("does NOT show the home page sale ad here", () => {
    cy.get(".advertising img[alt='Sale now on']").should("not.exist");
  });

  it("loads the sweets grid and shows a few known products", () => {
    cy.contains("h1,h2,h3,h4,h5", "Browse sweets").should("be.visible");

    cy.contains("h4", "Chocolate Cups").should("be.visible");
    cy.contains("h4", "Sherbert Straws").should("be.visible");
    cy.contains("h4", "Wham Bars").should("be.visible");

    cy.get('button:contains("Add to Basket"), a:contains("Add to Basket")')
      .should(($els) => {
        expect($els.length).to.be.greaterThan(5);
      });
  });

  it("all product cards have a loaded image (soft checks)", () => {
    const errors = [];

    cy.get(
      'div:has(h4):has(button:contains("Add to Basket")), div:has(h4):has(a:contains("Add to Basket"))'
    )
      .as("cards")
      .should(($cards) => {
        expect($cards.length, "number of product cards").to.be.greaterThan(5);
      });

    cy.get("@cards").each(($card, idx) => {
      const name = $card.find("h4").text().trim() || `card #${idx + 1}`;
      cy.wrap($card).find("img").first().then(($img) => {
        try {
          expect($img[0].naturalWidth, `${name} naturalWidth`).to.be.greaterThan(0);
          expect($img[0].naturalHeight, `${name} naturalHeight`).to.be.greaterThan(0);
        } catch (e) {
          errors.push(`❌ ${name}: image not loaded`);
        }
      });
    });

    cy.then(() => {
      if (errors.length) {
        throw new Error(`Soft assertion failures:\n - ${errors.join("\n - ")}`);
      }
    });
  });

  it("adds one item to basket and updates the basket count in the navbar", () => {
    const basketBadge = 'a.nav-link[href="/basket"] .badge';
    cy.get(basketBadge).should("have.text", "0");

cy.addItemByName("Chocolate Cups");


    cy.get(basketBadge).should("have.text", "1");
  });
});