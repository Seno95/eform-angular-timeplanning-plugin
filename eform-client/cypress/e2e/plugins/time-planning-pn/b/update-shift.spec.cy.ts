describe('Time Planning Working Hours Test', () => {
  beforeEach((): void => {
      cy.visit('http://localhost:4200/auth');
      cy.get('input[name="username"]').type('admin@admin.com');
      cy.get('input[name="password"]').type('secretpassword');
      cy.get('#loginBtn').click();
      cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
      cy.wait(5000);
  });

  it("should display the working hours for a selected worker and update shift times for Sunday, 25.08.2024", () => {
      const today: Date = new Date();
      const endDate: number = today.getDate(); // Today
      const startDate: Date = new Date();
      startDate.setDate(today.getDate() - 3); // 3 days ago

      cy.visit('http://localhost:4200/plugins/time-planning-pn/working-hours');
      cy.wait(5000);

      cy.get('#workingHoursRange').click();
      cy.wait(3000);

      cy.get('.mat-calendar-body-cell-content').contains(startDate.getDate().toString()).click({ force: true });
      cy.wait(3000);

      cy.get('.mat-calendar-body-cell-content').contains(endDate.toString()).click({ force: true });
      cy.wait(3000);

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
                  if (cellDate.trim() === '26.08.2024') {
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
