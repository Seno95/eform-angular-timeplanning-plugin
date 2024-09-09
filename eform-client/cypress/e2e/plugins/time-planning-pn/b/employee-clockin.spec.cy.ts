
// TODO

describe('Time Planning Employee Creation Test', () => {
  let randomId, randomSiteId;

  beforeEach(() => {
    cy.visit('http://localhost:4200/auth');
    cy.get('input[name="username"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('secretpassword');
    cy.get('#loginBtn').click();
    cy.url({ timeout: 30000 }).should('eq', 'http://localhost:4200/');
    cy.wait(5000);
    cy.visit('http://localhost:4200/plugins/backend-configuration-pn/property-workers');
    cy.wait(5000);

    randomId = getRandomId();
    randomSiteId = getRandomSiteId();
  });

  it('should toggle on Time Registration for a new employee', () => {
    const randomFirstName = getRandomFirstName();
    const randomLastName = getRandomLastName();

    // Click to create a new employee
    cy.get('button').contains('Create new employee').click();  
    cy.get('#firstName').should('be.visible');
    cy.get('#firstName').type(randomFirstName); 
    cy.get('#lastName').type(randomLastName);

    // Focus the time registration toggle and use the right arrow key to activate it
    cy.get('#timeRegistrationEnabledToggle')
      .should('be.visible')
      .focus()  // Focus the element
      .type('{rightarrow}');  // Use the right arrow key to toggle it on

    // Verify that the toggle is indeed enabled by checking the class
    cy.get('#timeRegistrationEnabledToggle').should('have.class', 'mat-mdc-slide-toggle-checked');

    // Pause to inspect the UI state after the toggle
    cy.pause();

    // Uncomment the below if you decide to proceed with creating the employee
    // cy.get('#saveCreateBtn').click({ force: true });

    // cy.wait('@createWorker', { timeout: 10000 }).its('response.statusCode').should('eq', 201);

    // cy.get('[data-cy="employee-list"]').should('contain', randomFirstName);
  });

});

// Utility functions
function getRandomId() {
  return Math.floor(Math.random() * 100000) + 1;
}

function getRandomFirstName() {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Laura', 'Chris', 'Anna'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function getRandomLastName() {
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function getRandomSiteId() {
  return Math.floor(Math.random() * 1000) + 1;
}

function getRandomCustomerNo() {
  return Math.floor(Math.random() * 1000) + 1;
}
