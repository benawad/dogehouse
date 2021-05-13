import {
  defaultRoomName,
  defaultTestUsername,
} from "../support/test-constants";

describe("create room then", () => {
  before(() => {
    cy.loginTestUser();
    cy.dataTestId("feed-action-button").click();
    cy.byName("name").type(defaultRoomName);
    cy.clickSubmit();
  });
  it("verify room name and creator name", () => {
    cy.dataTestId("room-title").invoke("text").should("eq", defaultRoomName);
    cy.dataTestId(`room:user:node:${defaultTestUsername}`);
  });
  it("mute", () => {
    cy.dataTestId("mute").click();
    cy.dataTestId(`muted:${defaultTestUsername}`);
    cy.dataTestId("mute").click();
    cy.dataTestId(`muted:${defaultTestUsername}`).should("not.exist");
  });
  it("deafen", () => {
    cy.dataTestId("deafen").click();
    cy.dataTestId(`deafened:${defaultTestUsername}`);
    cy.dataTestId("deafen").click();
    cy.dataTestId(`deafened:${defaultTestUsername}`).should("not.exist");
  });
  it("deafen/mute sequence", () => {
    cy.testDeafenSequence();
    cy.dataTestId(`deafened:${defaultTestUsername}`).should("not.exist");
  });
  it("invite friends", () => {
    cy.dataTestId("invite-friends").click();
    cy.dataTestId("container");
    cy.go("back");
  });
  it("settings", () => {
    cy.dataTestId("room-settings").click();
    cy.closeModal();
  });
  it("profile modal", () => {
    cy.dataTestId(`room:user:node:${defaultTestUsername}`).click();
    cy.dataTestId("profile-info-username")
      .invoke("text")
      .should("eq", "@" + defaultTestUsername);
    cy.closeModal();
  });
  it("minimized room widget deafen/mute sequence desktop", () => {
    cy.viewport(2560, 1440);
    cy.dataTestId(`logo-link`).click();
    cy.testDeafenSequence();
  });
  it("floating room widget deafen/mute sequence", () => {
    cy.viewport("iphone-x");
    cy.dataTestId("floating-room-container").should("exist");
    cy.testDeafenSequence();
    cy.dataTestId(`room-card:${defaultRoomName}`).click();
  });
  it("leave room", () => {
    cy.dataTestId("leave-room").click();
  });
});
