// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { defaultTestUsername } from "./test-constants";

Cypress.Commands.add("dataTestId", (value, wait = false) => {
  const selector = `[data-testid="${value}"]`;
  if (wait) {
    return cy.waitFor(selector);
  } else {
    return cy.get(selector);
  }
});

Cypress.Commands.add("closeModal", () => {
  return cy.get(`[data-testid="close-modal"]`).click();
});

Cypress.Commands.add("byName", (value) => {
  return cy.get(`[name=${value}]`);
});

Cypress.Commands.add("clickSubmit", () => {
  return cy.get(`button[type="submit"]`).click();
});

Cypress.Commands.add("testDeafenSequence", () => {
  // deafen -> mute will undeafen
  cy.dataTestId("deafen").click();
  cy.dataTestId(`mic-off`);
  cy.dataTestId(`headphone-off`);
  cy.dataTestId("mute").click();
  cy.dataTestId(`mic-on`);
  cy.dataTestId(`headphone-on`);
  // mute -> deafen -> mute will undeafen
  cy.dataTestId("mute").click();
  cy.dataTestId(`mic-off`);
  cy.dataTestId("deafen").click();
  cy.dataTestId(`mic-off`);
  cy.dataTestId(`headphone-off`);
  cy.dataTestId("mute").click();
  cy.dataTestId(`mic-on`);
  cy.dataTestId(`headphone-on`);
});

Cypress.Commands.add("loginTestUser", (value = defaultTestUsername) => {
  cy.viewport(2560, 1440);
  cy.visit("/", {
    onBeforeLoad(win) {
      cy.stub(win, "prompt").returns(value);
    },
  });

  return cy.dataTestId("create-test-user").click();
});
