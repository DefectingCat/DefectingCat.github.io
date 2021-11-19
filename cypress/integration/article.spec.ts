/* eslint-disable */
describe('Article', () => {
  it('open url', () => {
    cy.visit('http://localhost:3000/');
  });
  it('check article', () => {
    cy.get('main > article:first').find('a').should('have.attr', 'href');
    cy.get('main > article')
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '/posts/');
    cy.get('main > article')
      .find('a')
      .invoke('attr', 'href')
      .should('contain', '/posts/')
      .then((href) => {
        cy.request(href).its('status').should('eq', 200);
      });
  });
  it('into article', () => {
    // Click title
    cy.get('main > article:first h2').parent().click();
    cy.url().should('contain', '/posts/');

    cy.get('article')
      .should('be.visible')
      .find('header')
      .should('be.visible')
      .find('h1')
      .should('be.visible');

    cy.get('section').should('be.visible').find('h2').should('be.visible');
  });
  it('check back button', () => {
    cy.get('#__next > div > button')
      .should('be.visible')
      .should('contain.text', 'BACK');
  });
  it('comment and footer', () => {
    cy.get('.giscus').should('be.visible');
    cy.get('footer').contains('Powered by Next.js ❤️');
  });
  it('table of content', () => {
    cy.get('#table-of-contents')
      .should('be.visible')
      .contains('Table of contents')
      .next()
      .should('be.visible')
      .find('li')
      .should('be.visible');
  });
});
