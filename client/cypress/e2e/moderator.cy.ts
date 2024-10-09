import { API_ROUTES } from "../support/constants";

describe("Moderator Admin Panel", () => {
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
  });

  it("Check admin login successfully", () => {
    login();
    cy.contains("Login successfully");
  });

  it("Check all the menu accessible", () => {
    login();

    cy.url().should("include", "/admin");
    cy.get("#home-card").click();
    cy.url().should("include", "/");
    cy.go("back");
    cy.get("#game-list-card").click();
    cy.url().should("include", "/games");
    cy.go("back");
    cy.url().should("include", "/admin");
    cy.get("#review-in-map").click();
    cy.url().should("include", "/map");
    cy.go("back");
    cy.url().should("include", "/admin");
  });

  it("Check logout functionality", () => {
    login();

    cy.url().should("include", "/admin");
    cy.get("#logout-button").click();
    cy.contains("Logout successful");
    cy.url().should("include", "/");
  });

  it("Check all the protected menu not accessible when logout", () => {
    cy.visit("/admin", { failOnStatusCode: false });
    cy.url().should("include", "/login");

    cy.visit("/map", { failOnStatusCode: false });
    cy.url().should("include", "/login");

    cy.visit("/games", { failOnStatusCode: false });
    cy.url().should("include", "/login");
  });
});
