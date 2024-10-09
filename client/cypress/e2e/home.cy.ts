describe("Home Page", () => {
  it("page rendered successfully", () => {
    cy.visit("/");
    cy.contains("Find your next captivating gaming moment");
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
});
