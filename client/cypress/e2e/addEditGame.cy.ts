import { API_ROUTES } from "../support/constants";

describe("Add Edit Games", () => {
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
    cy.visit("/games");
  });

  it("Check add games validations", () => {
    cy.get("#add-game-button").click();
    cy.get("#save-button-add-game").click();

    cy.contains("Game Name must be provided");
    cy.contains("Game Image must be a valid URL");
    cy.contains("Description must be provided");

    cy.get("#cancel-button-add-game").click();
  });

  it("Check add new games", () => {
    cy.get("#add-game-button").click();

    cy.get('input[placeholder="Game Name"]').type("Lost Ark 2");
    cy.get('input[placeholder="Game Image (URL Only)"]').type(
      "https://www.freetogame.com/g/517/thumbnail.jpg"
    );
    cy.get('textarea[placeholder="Game description..."]').type(
      "Free-to-play multiplayer massive adventure filled with lands waiting to be explored"
    );

    cy.get("#save-button-add-game").click();
    cy.contains("Game created successfully");
  });

  it("Check edit games validations", () => {
    cy.get('[data-button="edit-game"]').then(($elem) => {
      cy.wrap($elem).first().click();
    });

    cy.get('input[placeholder="Game Name"]').clear();
    cy.get('input[placeholder="Game Image (URL Only)"]').clear();
    cy.get('textarea[placeholder="Game description..."]').clear();

    cy.get("#save-button-add-game").click();

    cy.contains("Game Name must be provided");
    cy.contains("Game Image must be a valid URL");
    cy.contains("Description must be provided");

    cy.get("#cancel-button-add-game").click();
  });

  it("Check edit games", () => {
    cy.get('[data-button="edit-game"]').then(($elem) => {
      cy.wrap($elem).first().click();
    });

    cy.get('input[placeholder="Game Name"]').clear().type("Lost Ark 2 Edited");
    cy.get('input[placeholder="Game Image (URL Only)"]')
      .clear()
      .type("https://www.freetogame.com/g/517/thumbnail.jpg");
    cy.get('textarea[placeholder="Game description..."]')
      .clear()
      .type(
        "Edited Free-to-play multiplayer massive adventure filled with lands waiting to be explored"
      );

    cy.get("#save-button-add-game").click();
    cy.contains("Game update successfully");
  });

  it("Check delete game", () => {
    cy.get('[data-button="delete-game"]').then(($elem) => {
      cy.wrap($elem).first().click();
      cy.contains("Game deleted successfully");
    });
  });
});
