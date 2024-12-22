declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in via the API.
     * @example cy.login()
     */
    login(): Chainable<void>;
  }
}
