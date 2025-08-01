// cypress/e2e/login.cy.js

describe('Authentication Flow', () => {
  const existingUser = {
    name:     'Alice',
    email:    'alice@example.com',
    password: 'password123',
  };

  // grab baseUrl once
  const baseUrl = Cypress.config('baseUrl');

  before(() => {
    // ensure “Alice” exists (ok if she already does)
    cy.request({
      method: 'POST',
      url:    '/api/users/register',
      body:   existingUser,
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in an existing user and shows the books list', () => {
    // stub the books endpoint so we can wait on it
    cy.intercept('GET', '/api/books').as('getBooks');

    // fill in and submit
    cy.get('input[type="email"]').type(existingUser.email);
    cy.get('input[type="password"]').type(existingUser.password);
    cy.get('button[type="submit"]').click();

    // verify redirect to home
    cy.url().should('eq', `${baseUrl}/`);

    // wait for books to load, then assert the page rendered
    cy.wait('@getBooks');

    // and ensure the Logout button appears
    cy.contains('Logout').should('be.visible');
  });

  it('switches to sign-up and registers a new user', () => {
    // for the new user flow we also intercept books
    cy.intercept('GET', '/api/books').as('getBooks');

    // generate a fresh email to avoid collisions
    const ts = Date.now();
    const newUser = {
      name:     `User${ts}`,
      email:    `user${ts}@example.com`,
      password: 'Password1!',
    };

    // toggle to register
    cy.get('.auth-switch a').click();

    // fill registration form
    cy.get('input[type="text"]').type(newUser.name);
    cy.get('input[type="email"]').type(newUser.email);
    cy.get('input[type="password"]').type(newUser.password);

    // submit
    cy.get('button[type="submit"]').click();

    // after auto-login we should land at “/”
    cy.url().should('eq', `${baseUrl}/`);

    // wait for books, assert they render
    cy.wait('@getBooks');

    // and see Logout
    cy.contains('Logout').should('be.visible');
  });

  it('shows browser validation on empty submit', () => {
    // try submitting with no input
    cy.get('button[type="submit"]').click();

    // the browser's HTML5 "required" should fire on the email field
    cy.get('input[type="email"]').then($el => {
      expect($el[0].checkValidity()).to.be.false;
    });
  });
});


