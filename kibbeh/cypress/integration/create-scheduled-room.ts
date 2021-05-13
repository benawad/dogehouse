import {
    defaultRoomName,
    defaultTestUsername,
} from "../support/test-constants";

describe("create scheduled room then", () => {
    before(() => {
        cy.loginTestUser();
        cy.dataTestId("create-scheduled-room").click();
        cy.byName("name").type(defaultRoomName);
        cy.clickSubmit();
    });
    it("verify scheduled room has been created", () => {
        cy.dataTestId("view-scheduled-rooms").click();
        cy.dataTestId(`scheduledroom:name:${defaultRoomName}`);
    });

    // it("verify scheduled room shows up on user profile", () => {
    // for somereason this "dropdown-trigger" is being found more than once and cypress dosent wanna click it
    //     cy.dataTestId("dropdown-trigger").click();
    //     cy.dataTestId("profile-link").click();
    //     cy.dataTestId(`user:${defaultTestUsername}:tab:scheduled`).click();
    //     cy.dataTestId(`scheduledroom:name:${defaultRoomName}`);
    // });

});
