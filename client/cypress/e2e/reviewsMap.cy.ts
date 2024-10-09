import { API_ROUTES } from "../support/constants";

describe("Leaflet Map Test", () => {
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
    cy.visit("/map");
  });

  it("should render the leaflet map", () => {
    cy.get("#map-container").should("exist").and("be.visible");
  });

  it("should render the map and display markers", () => {
    cy.get(".leaflet-marker-icon").should("have.length.at.least", 1);
    cy.get(".leaflet-marker-icon").each((marker) => {
      cy.wrap(marker).should("be.visible");
    });
  });

  it("should open a popup when a marker is clicked", () => {
    cy.get(".leaflet-marker-icon").first().click({ force: true });
    cy.get(".leaflet-popup").should("be.visible");
  });
});
