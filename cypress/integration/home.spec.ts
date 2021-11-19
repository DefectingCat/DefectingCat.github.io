/* eslint-disable */
describe('Home', () => {
  it('open url', () => {
    cy.visit('http://localhost:3000/');
  });
  it('should have navs', () => {
    cy.get('header').should('be.visible');
    cy.get('nav').should('be.visible').find('a').should('have.length', 3);

    cy.get('img[alt="Avatar"]').should('be.visible');

    cy.get('a[href*="/"]').contains('首页');
    cy.get('a[href*="/archive"]').contains('归档');
    cy.get('a[href*="/about"]').contains('关于');
  });
  it('should have article', () => {
    cy.get('main')
      .should('be.visible')
      .find('article')
      .should('have.length', 10);
  });
  it('check back to top button', () => {
    cy.get('.ant-back-top').should('be.hidden');
    cy.get('#__next > div:first').scrollTo(0, 9000);
    cy.get('.ant-back-top').should('be.visible');
    cy.get('#__next > div:first').scrollTo(0, 0);
    cy.get('.ant-back-top').should('be.hidden');
    cy.get('#__next > div:first').scrollTo(0, 9000);
    cy.get('.ant-back-top').should('be.visible').click();
  });
  it('should have footer', () => {
    cy.get('footer').contains('Powered by Next.js ❤️');
  });
});
