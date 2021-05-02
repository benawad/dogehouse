// load type definitions that come with Cypress module
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    dataTestId(value: string, wait?: boolean): Chainable<Element>;
    byName(value: string): Chainable<Element>;
    clickSubmit(): Chainable<Element>;
    closeModal(): Chainable<Element>;
    loginTestUser(value?: string): Chainable<AUTWindow>;
    testDeafenSequence(): void;
  }
}
