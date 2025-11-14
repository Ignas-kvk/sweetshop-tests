import { BASE, routes } from "../support/constants";

describe("Sweet Shop – Home page", () => {
  beforeEach(() => {
    cy.visit(`${BASE}${routes.home}`);
  });

  it("renders sale ad, hero, CTA, and footer", () => {
    cy.get(".advertising img[alt='Sale now on']")
      .should("be.visible")
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });

    cy.contains("h1.display-3", "Welcome to the sweet shop!").should("be.visible");
    cy.contains(".lead", "The sweetest online shop out there.").should("be.visible");

    cy.get('a.btn.btn-primary.btn-lg.sweets[href="/sweets"]').click();
    cy.location("pathname").should("eq", routes.sweets);
  });

  it("shows 'Most popular' grid with valid images", () => {
    cy.contains("h2", "Most popular").should("be.visible");

    cy.get(".cards .card")
      .should("have.length.greaterThan", 3)
      .each(($card, idx) => {
        const name = $card.find("h4.card-title").text().trim() || `popular #${idx + 1}`;
        const $img = $card.find("img.card-img-top").get(0);
        expect($img, `${name} image element`).to.exist;
        expect($img.naturalWidth, `${name} image width`).to.be.greaterThan(0);
      });
  });
it("adds sweets from all Home page cards and checks basket increment (soft)", () => {
  const basketBadge = 'a.nav-link[href="/basket"] .badge';
  const errors = [];

  const soft = (label, fn) => {
    try {
      fn();
    } catch (e) {
      errors.push(`❌ ${label}: ${e.message}`);
    }
  };

  // pradinė reikšmė
cy.getBasketCount().then((count) => {
  soft("initial basket count", () => expect(count).to.eq(0));
});


  // 💡 duodam laiką JS'ui susirišti eventus (init(), custom.js ir t.t.)
  cy.wait(1000);

  let previous = 0;

  cy.get(basketBadge)
    .invoke("text")
    .then((text) => {
      previous = Number(text.trim() || "0");
    });

  cy.get(".cards .card").each(($card, idx) => {
    const name = $card.find("h4.card-title").text().trim() || `Card #${idx + 1}`;

    cy.wrap($card)
      .find(".addItem")
      .click({ force: true });

    cy.wait(300); // mažas wait po kiekvieno kliko, jei reikia

    cy.get(basketBadge)
      .invoke("text")
      .then((text) => {
        const current = Number(text.trim() || "0");

        soft(`${name} – basket should increase`, () => {
          expect(current).to.be.greaterThan(previous);
        });

        previous = current;
      });
  });

  cy.then(() => {
    if (errors.length) {
      throw new Error(`Soft assertion failures:\n - ${errors.join("\n - ")}`);
    }
  });
});

});
