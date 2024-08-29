describe('Time Planning Flex Test', () => {
    beforeEach((): void => {
        cy.visit('http://localhost:4200/auth');
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('secretpassword');
        cy.get('#loginBtn').click();
        cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
        cy.wait(5000);
    });

    it("should confirm that the Flex sum for the specific worker contains a valid number", () => {
        cy.visit('http://localhost:4200/plugins/time-planning-pn/flex');
        cy.wait(5000);

        cy.contains('tr', 'John Doe').within(() => {
            cy.get('td.mat-column-sumFlex').invoke('prop', 'innerText').then((innerText) => {
                cy.log('Extracted innerText: "' + innerText.trim() + '"');

                const cleanedText = innerText.replace(/[^0-9.,]/g, '').trim();
                cy.log('Cleaned text: "' + cleanedText + '"');

                const parsedNumber = parseFloat(cleanedText);

                cy.log('Parsed number: ' + parsedNumber);

                if (!isNaN(parsedNumber) && cleanedText.length > 0) {
                    cy.log('Valid number found in the Flex sum: ' + parsedNumber);
                } else {
                    throw new Error('No valid number found in the Flex sum.');
                }
            });
        });
    });
});


