import {defaultAvatarUrl, defaultBannerUrl, defaultBio} from "../support/test-constants";

describe("edit profile", () => {
  before(() => {
    cy.loginTestUser();
  });
  it("from feed", () => {
    cy.dataTestId("edit-profile-widget").click();
    cy.byName("avatarUrl").clear().type(defaultAvatarUrl);
    cy.byName("bannerUrl").clear().type(defaultBannerUrl);
    cy.byName("bio").clear().type(defaultBio);
    cy.clickSubmit();
    cy.dataTestId("current-user:bio").invoke("text").should("eq", defaultBio);
  });
});
