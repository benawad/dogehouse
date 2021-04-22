describe("My First Test", () => {
  before(() => {
    cy.loginTestUser();
  });
  it("login", () => {
    cy.dataTestId("feed-action-button").click();
    cy.byName("name").type("Doge Price Discussion");
    cy.clickSubmit();
  });
});
