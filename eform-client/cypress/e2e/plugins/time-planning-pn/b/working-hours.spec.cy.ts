// Uden dateRange objekt

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
      // start and end dates
      const today = new Date();
      const endDate = today.getDate();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 3);

      // working hours page
      cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
      cy.wait(5000);

      // Open date picker
      cy.get('#workingHoursRange').click();
      cy.wait(2000);

      // Start date 
      if (startDate.getMonth() !== today.getMonth()) {
          // previous month if needed
          cy.get('mat-calendar-header button[aria-label="Previous month"]').click();
          cy.wait(500);
      }

      // Select the start date
      cy.get('.mat-calendar-body-cell-content')
        .contains(startDate.getDate().toString())
        .click({ force: true });
      cy.wait(500);

      // End date 
      if (startDate.getMonth() !== today.getMonth()) {
          // next month if needed
          cy.get('mat-calendar-header button[aria-label="Next month"]').click();
          cy.wait(500);
      }

      // Select end date
      cy.get('.mat-calendar-body-cell-content')
        .contains(endDate.toString())
        .click({ force: true });
      cy.wait(500);

      // Click outside the calendar to close it
      cy.get('body').click(0, 0);
      cy.wait(2000);

      // Open worker dropdown
      cy.get('#workingHoursSite').click();
      cy.wait(5000);

      // Select the worker by name
      cy.get('div[role="listbox"]').within(() => {
          cy.contains('John Doe').click({ force: true });
      });

      cy.wait(5000);
  });
});


// 2 MÅNEDER - FØRSTE PRØVE (virker)

/* describe('Time Planning Working Hours Test', () => {
  beforeEach(() => {
      cy.visit('http://localhost:4200/auth');
      cy.get('input[name="username"]').type('admin@admin.com');
      cy.get('input[name="password"]').type('secretpassword');
      cy.get('#loginBtn').click();
      cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
      cy.wait(5000);
  });

  it('should display the working hours for a selected worker', () => {
      const dateRange = {
          yearFrom: 2024,
          monthFrom: 8,  
          dayFrom: 1,   
          yearTo: 2024,
          monthTo: 9,    
          dayTo: 30,     
      };

      cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
      cy.wait(5000);

      cy.get('#workingHoursRange').click();
      cy.wait(2000);

      // Start dato
      if (dateRange.monthFrom !== new Date().getMonth() + 1) {
          // previous month if needed
          cy.get('mat-calendar-header button[aria-label="Previous month"]').click();
          cy.wait(500);
      }

      // Select start dato
      cy.get('.mat-calendar-body-cell-content')
        .contains(dateRange.dayFrom.toString())
        .click({ force: true });
      cy.wait(500);

      // End dato
      if (dateRange.monthFrom !== dateRange.monthTo) {
          // next month if needed
          cy.get('mat-calendar-header button[aria-label="Next month"]').click();
          cy.wait(500);
      }

      // end dato
      cy.get('.mat-calendar-body-cell-content')
        .contains(dateRange.dayTo.toString())
        .click({ force: true });
      cy.wait(500);

      cy.get('body').click(0, 0);
      cy.wait(2000);

      cy.get('#workingHoursSite').click();
      cy.wait(5000);

      cy.get('div[role="listbox"]').within(() => {
          cy.contains('John Doe').click({ force: true });
      });

      cy.wait(5000);
  });
}); */