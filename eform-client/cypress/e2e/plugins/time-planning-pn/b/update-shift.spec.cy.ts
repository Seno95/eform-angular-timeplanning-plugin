function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
}

describe('Time Planning Working Hours Test', () => {
    beforeEach((): void => {
        cy.visit('http://localhost:4200/auth');
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('secretpassword');
        cy.get('#loginBtn').click();
        cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
        cy.wait(5000);
    });

    it("should display the working hours for a selected worker and update shift times for yesterday", () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 3);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // 1 day ago

        const formattedYesterday = formatDate(yesterday);

        cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
        cy.wait(5000);

        cy.get('#workingHoursRange').click();
        cy.wait(3000);

        // previous month if needed for the start date
        if (startDate.getMonth() !== today.getMonth()) {
            cy.get('mat-calendar-header button[aria-label="Previous month"]').click();
            cy.wait(500);
        }

        // start date
        cy.get('.mat-calendar-body-cell-content')
            .contains(startDate.getDate().toString())
            .click({ force: true });
        cy.wait(500);

        // next month if needed for the end date
        if (startDate.getMonth() !== today.getMonth()) {
            cy.get('mat-calendar-header button[aria-label="Next month"]').click();
            cy.wait(500);
        }

        // end date (today)
        cy.get('.mat-calendar-body-cell-content')
            .contains(today.getDate().toString())
            .click({ force: true });
        cy.wait(500);

        cy.get('body').click(0, 0);
        cy.wait(2000);

        cy.get('#workingHoursSite').click();
        cy.wait(3000);
        cy.get('div[role="listbox"]').within(() => {
            cy.contains('John Doe').click({ force: true });
        });
        cy.wait(5000);

        cy.get('#time-planning-pn-working-hours-grid table tr').each(($row): void => {
            cy.wrap($row).within(() => {
                cy.get('.mat-column-date').invoke('text').then((cellDate: string) => {
                    if (cellDate.trim() === formattedYesterday) {
                        // '09:00'
                        cy.get('.mat-column-shift1Start .shift-select input').type('09:00{enter}', { force: true });
                        cy.get('.mat-column-shift1Start .shift-select').should('contain.text', '09:00');

                        // '16:00'
                        cy.get('.mat-column-shift1Stop .shift-select input').type('16:00{enter}', { force: true });
                        cy.get('.mat-column-shift1Stop .shift-select').should('contain.text', '16:00');

                        cy.wait(3000);
                        return false; 
                    }
                });
            });
        }).then((): void => {
            cy.get('#workingHoursSave').click({ force: true });
            cy.wait(5000);
        });
    });
});





// VIRKER OGSÅ 

/* describe('Time Planning Working Hours Test', () => {
    beforeEach((): void => {
      cy.visit('http://localhost:4200/auth');
      cy.get('input[name="username"]').type('admin@admin.com');
      cy.get('input[name="password"]').type('secretpassword');
      cy.get('#loginBtn').click();
      cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
      cy.wait(5000);
    });
  
    it("should display the working hours for a selected worker and update shift times for yesterday", () => {
      const today: Date = new Date();
      const startDate: Date = new Date();
      startDate.setDate(today.getDate() - 3);
      const yesterday: Date = new Date();
      yesterday.setDate(today.getDate() - 1); // 1 day ago
  
      // yesterday's date as 'dd.MM.yyyy'
      const formattedYesterday: string = yesterday.getDate().toString().padStart(2, '0') + '.' + 
        (yesterday.getMonth() + 1).toString().padStart(2, '0') + '.' + 
        yesterday.getFullYear();
  
      cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
      cy.wait(5000);
  
      cy.get('#workingHoursRange').click();
      cy.wait(3000);
  
      // previous month if needed for the start date
      if (startDate.getMonth() !== today.getMonth()) {
        cy.get('mat-calendar-header button[aria-label="Previous month"]').click();
        cy.wait(500);
      }
  
      // start date
      cy.get('.mat-calendar-body-cell-content')
        .contains(startDate.getDate().toString())
        .click({ force: true });
      cy.wait(500);
  
      // next month if needed for the end date
      if (startDate.getMonth() !== today.getMonth()) {
        cy.get('mat-calendar-header button[aria-label="Next month"]').click();
        cy.wait(500);
      }
  
      // end date (today)
      cy.get('.mat-calendar-body-cell-content')
        .contains(today.getDate().toString())
        .click({ force: true });
      cy.wait(500);
  
      cy.get('body').click(0, 0);
      cy.wait(2000);
  
      cy.get('#workingHoursSite').click();
      cy.wait(3000);
      cy.get('div[role="listbox"]').within(() => {
        cy.contains('John Doe').click({ force: true });
      });
      cy.wait(5000);
  
      cy.get('#time-planning-pn-working-hours-grid table tr').each(($row): void => {
        cy.wrap($row).within(() => {
          cy.get('.mat-column-date').invoke('text').then((cellDate: string) => {
            if (cellDate.trim() === formattedYesterday) {
              // '09:00'
              cy.get('.mat-column-shift1Start .shift-select input').type('09:00{enter}', { force: true });
              cy.get('.mat-column-shift1Start .shift-select').should('contain.text', '09:00');
  
              // '16:00'
              cy.get('.mat-column-shift1Stop .shift-select input').type('16:00{enter}', { force: true });
              cy.get('.mat-column-shift1Stop .shift-select').should('contain.text', '16:00');
  
              cy.wait(3000);
              return false; 
            }
          });
        });
      }).then((): void => {
        cy.get('#workingHoursSave').click({ force: true });
        cy.wait(5000);
      });
    });
  });
  */