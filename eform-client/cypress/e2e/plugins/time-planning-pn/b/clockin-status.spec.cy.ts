describe('Time Planning Clock-In Status Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/auth');
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('secretpassword');
        cy.get('#loginBtn').click();
        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:4200/');
        cy.wait(5000);
    });

    it('should find some text in the worker cell on the Clock-In page', () => {
        cy.log('Navigating to the Clock-In page');

        cy.visit('http://localhost:4200/plugins/time-planning-pn/clockin');

        cy.get('mtx-grid').should('be.visible');

        cy.log('Table is visible, now waiting for data to load...');

        cy.wait(10000);

        cy.log('Now checking if there is any text in the worker cell');

        cy.get('mtx-grid .cdk-row')
          .find('.cdk-cell:nth-child(2)')  
          .invoke('text')
          .should('not.be.empty')
          .then(() => {
              cy.log('Text was found in the worker cell.');
          });
    });
});

/* describe('Time Planning Clock-In Status Test', () => {
    beforeEach((): void => {
        cy.visit('http://localhost:4200/auth');
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('secretpassword');
        cy.get('#loginBtn').click();
        cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
        cy.wait(10000); 

        cy.visit('http://localhost:4200/plugins/time-planning-pn/clockin');
        cy.wait(10000); 
    });

    it('should verify that John Doe has not clocked in (active status is false)', () => {
        cy.get('table').should('be.visible').wait(10000);

        cy.get('table tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.wait(10000); 

                cy.get('input[ngModel]').invoke('val').then((workerName) => {
                    if (workerName.trim() === 'John Doe') {
                        cy.wait(10000); 

                        cy.get('span').then((indicator) => {
                            if (indicator.hasClass('inactive-indicator')) {
                                cy.log('Success: John Doe has not clocked in, as expected.');
                            } else {
                                throw new Error('Error: John Doe appears to be active, but should not be.');
                            }
                        });
                        return false; 
                    }
                });
            });
        });
    });
});
*/