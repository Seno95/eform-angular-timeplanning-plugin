describe('Time Planning Clock-In Status Check', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/auth');

        cy.get('input[name="username"]').type('admin@admin.com');

        cy.get('input[name="password"]').type('secretpassword');

        cy.get('#loginBtn').click();

        cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');

        cy.wait(5000);
    });

    it('should check if the worker is Active or Inactive', () => {
        cy.log('Navigating to the Clock-In page');

        cy.visit('http://localhost:4200/plugins/time-planning-pn/clockin');

        cy.get('mtx-grid').should('be.visible');

        cy.log('Table is visible, now waiting for data to load...');

        cy.wait(5000); 

        cy.log('Checking the status in the table');

        cy.get('.cdk-row .active-indicator, .cdk-row .inactive-indicator', { timeout: 10000 })
          .should('exist')
          .then(($status) => {
              const statusText = $status.text().trim();
              if (statusText.includes('Active')) {
                  cy.log('The worker is Active.');
              } else if (statusText.includes('Inactive')) {
                  cy.log('The worker is Inactive.');
              } else {
                  throw new Error('Worker status is not recognized.');
              }
          });

        cy.log('Test completed successfully.');
    });
});
