describe('Time Planning Flex Sum Check', () => {
    beforeEach((): void => {
        cy.visit('http://localhost:4200/auth');
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('secretpassword');
        cy.get('#loginBtn').click();
        cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
        cy.wait(5000);
    });

    it("should confirm that the sumFlex column contains a number", () => {
        cy.visit('http://localhost:4200/plugins/time-planning-pn/flex');
        cy.wait(5000);

        cy.get('.cdk-row #timePlanningSumFlex')
          .invoke('text')
          .should('match', /\d+/); 
    });
});
