import { API_ROUTES } from "../support/constants";

describe("Moderator Authentication", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  const interceptCheckModerator = (fixtureName) => {
    cy.intercept("GET", API_ROUTES.CHECK_MODERATOR, {
      fixture: fixtureName,
    }).as("checkModerator");
  };

  it("should display login or create account based on user existence", () => {
    interceptCheckModerator("moderatorExists.json");

    cy.wait("@checkModerator").then((interception) => {
      const userExists = interception?.response?.body.userExists;
      if (userExists) {
        cy.contains("Login");
      } else {
        cy.contains("Create");
      }
    });
  });

  it("should show error on login validations", () => {
    interceptCheckModerator("moderatorExists.json");

    cy.get("button").click();
    cy.contains("Invalid email address");
    cy.contains("Password must be at least 6 characters");
  });

  it("should show error on create moderator validations", () => {
    interceptCheckModerator("moderatorNotExists.json");

    cy.get("button").click();
    cy.contains("Invalid email address");
    cy.contains("Password must be at least 6 characters");
    cy.contains("Name is required");
  });

  it("should toggle the password visibility", () => {
    interceptCheckModerator("moderatorExists.json");

    cy.get('input[placeholder="Password"]').type("password123");
    cy.get("#toggle-password").click();
    cy.get('input[placeholder="Password"]').should("have.attr", "type", "text");
    cy.get('input[placeholder="Password"]').should(
      "have.attr",
      "value",
      "password123"
    );
    cy.get("#toggle-password").click();
    cy.get('input[placeholder="Password"]').should("have.attr", "type", "password");
  });

  it("should create an account for new users", () => {
    interceptCheckModerator("moderatorNotExists.json");

    cy.intercept("POST", API_ROUTES.CREATE_MODERATOR, {
      statusCode: 200,
      body: {
        success: true,
        message: "Moderator created! Please login!",
      },
    }).as("createModerator");

    cy.wait("@checkModerator").then((interception) => {
      const userExists = interception?.response?.body.userExists;

      if (!userExists) {
        cy.contains("Create Account");
        cy.get('input[placeholder="Name"]').type("John Doe");
        cy.get('input[placeholder="Email"]').type("john@example.com");
        cy.get('input[placeholder="Password"]').type("password123");
        cy.get("button").click();
        cy.wait("@createModerator").then((interception) => {
          expect(interception?.response?.statusCode).to.equal(200);
          cy.contains("Moderator created! Please login!");
        });
      }
    });
  });

  it("should login an existing user", () => {
    interceptCheckModerator("moderatorExists.json");

    cy.intercept("POST", API_ROUTES.LOGIN, {
      statusCode: 200,
      body: { token: "mockToken" },
    }).as("login");

    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('input[placeholder="Password"]').type("password123");

    cy.get("button").click();
    cy.wait("@login");

    cy.contains("Login successfully");

    cy.url().should("include", "/admin");
  });
});
