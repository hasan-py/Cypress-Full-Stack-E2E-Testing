import { API_ROUTES } from "../support/constants";

describe("Game list and Game review", () => {
  const interceptCheckModerator = (fixtureName) => {
    cy.intercept("GET", API_ROUTES.CHECK_MODERATOR, {
      fixture: fixtureName,
    }).as("checkModerator");
  };

  const login = () => {
    cy.get("button").click();
    cy.wait("@login");
  };

  beforeEach(() => {
    interceptCheckModerator("moderatorExists.json");

    cy.visit("/login");

    cy.intercept("POST", API_ROUTES.LOGIN, {
      statusCode: 200,
      body: { token: "mockToken" },
    }).as("login");

    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('input[placeholder="Password"]').type("password123");

    login();
  });

  it("Game List: should display game cards with images, titles, and review counts", () => {
    cy.visit("/");

    cy.get(".grid").should("exist");
    cy.get(".grid .col-span-1").should("have.length.greaterThan", 0);

    cy.get(".grid .col-span-1")
      .first()
      .within(() => {
        cy.get("img")
          .should("have.attr", "src")
          .and("include", "thumbnail.jpg");
        cy.get("img").should("have.attr", "alt").and("contain", "Game Image");

        cy.get("p.text-lg").should("be.visible").and("not.be.empty");

        cy.get("p.text-sm").should("be.visible").and("not.be.empty");

        cy.get("p.text-xs").should("be.visible").and("contain", "Reviews");
      });
  });

  it("Game List: should check hover effect on game cards", () => {
    cy.visit("/");
    const element = cy.get(".grid .col-span-1 div").first();
    element.trigger("mouseover");
    element.should("have.class", "hover:-translate-y-1");
  });

  it("Game Review: should render game review page", () => {
    cy.visit("/");
    cy.get(".grid .col-span-1 div").first().click();

    cy.url().should("include", "/review");

    cy.url().then((url) => {
      expect(url).to.match(/\/review\/[a-zA-Z0-9]+/);
    });
  });

  it("Game Review: should submit a review", () => {
    cy.visit("/", {
      onBeforeLoad({ navigator }) {
        const latitude = 48.71597183246423;
        const longitude = 21.255670821215418;
        cy.stub(navigator.geolocation, "getCurrentPosition").callsArgWith(0, {
          coords: { latitude, longitude },
        });
      },
    });
    cy.get(".grid .col-span-1 div").first().click();

    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('input[placeholder="Name"]').type("John Doe");
    cy.get('textarea[placeholder="Here is a sample placeholder"]').type(
      "Nice game. Loved it."
    );

    cy.get("fieldset.rating").find('label[for="star4"]').click();
    cy.get("#submit-review-button").click();
    cy.contains("Thank you for your review!");
    cy.contains("John Doe");
    cy.contains("Nice game. Loved it.");
  });

  it("Game Review: should delete review from admin panel", () => {
    cy.visit("/games");

    cy.get('[review-email="john@example.com"]').then(($elem) => {
      cy.wrap($elem).each(($el) => {
        cy.wrap($el).click();
        cy.wait(500);
        cy.contains("Review deleted successfully");
      });
    });
  });
});
