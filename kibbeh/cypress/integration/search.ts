import { defaultTestUsername } from "../support/test-constants";

describe("searchbar", () => {
  before(() => {
    cy.loginTestUser();
  });
  it("search", () => {
    cy.dataTestId("searchbar").type("@" + defaultTestUsername);
    cy.dataTestId(`search:user:${defaultTestUsername}`).click();
    cy.dataTestId("profile-info-username")
      .invoke("text")
      .should("eq", "@" + defaultTestUsername);
  });
});
