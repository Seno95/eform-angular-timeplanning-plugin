describe('Time Planning Working Hours Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/auth');
    cy.get('input[name="username"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('secretpassword');
    cy.get('#loginBtn').click();
    cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
    cy.wait(5000);
  });

  it('should display the working hours for a selected worker', () => {
    // udregning
    const today = new Date();
    const endDate = today.getDate();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 3); 

    // Visit working
    cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
    cy.wait(5000);

    // Open the date picker 
    cy.get('#workingHoursRange').click();
    cy.wait(2000);

    // start date
    cy.get('.mat-calendar-body-cell-content').contains(startDate.getDate().toString()).click({ force: true });
    cy.wait(2000);

    // end date
    cy.get('.mat-calendar-body-cell-content').contains(endDate.toString()).click({ force: true });
    cy.wait(2000);

    // Click udefor calendar
    cy.get('body').click(0, 0);
    cy.wait(2000);

    // Open worker dropdown
    cy.get('#workingHoursSite').click();
    cy.wait(5000);

    // select the worker by name
    cy.get('div[role="listbox"]').within(() => {
      cy.contains('John Doe').click({ force: true });
    });

    cy.wait(5000); 
  });
});

