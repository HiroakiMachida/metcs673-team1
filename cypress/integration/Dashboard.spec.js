import { createSelector } from '../utils'
const { FIREBASE_AUTH_JWT } = 'Z0exF1H10ZXmmE52rwSvWNCuP1h2'

describe('Projects Page', () => {
  // beforeEach(() => {
  //   // Login using custom token
  //   cy.logout()
  //   cy.visit('/login')
  //   //cy.get('input[name="email"]').type('cypresstest@email.com')
  //   //cy.get('input[name="password"]').type('cypresstest')
  //   //cy.get('button').click()          // Click on button
  //   cy.login('Z0exF1H10ZXmmE52rwSvWNCuP1h2')
  //   //cy.wait(10000)
  //   // Go to projects page
  // })

  describe('Create selling post', () => {
    it('log in', () => {
      cy.logout()
      cy.visit('/login')
      cy.login('Z0exF1H10ZXmmE52rwSvWNCuP1h2')
    })

    it('Create selling post', () => {
      cy.visit('/dashboard')
      cy.wait(3000)
      cy.get('svg:eq(1)').click()
      cy.get('input[name="isbn"]').type('978-0471692089')
      cy.get('input[name="title"]:last').type('Software Engineering: Modern Approaches')
      cy.get('input[name="status"]').type('Clean')
      cy.get('input[name="price"]').type('30.99')
      cy.fixture('bookcover.jpg').then(fileContent => {
        cy.get('input[type="file"]').upload({
            fileContent: fileContent.toString(),
            fileName: 'bookcover.jpg',
            mimeType: 'image/jpg'
        });
      });
      cy.get('button:last').click()

    })
  })

  // describe('Add Project', () => {
  //   it('creates project when provided a valid name', () => {
  //     const newProjectTitle = 'Test project'
  //     cy.get(createSelector('new-project-tile')).click()
  //     // Type name of new project into input
  //     cy.get(createSelector('new-project-name'))
  //       .find('input')
  //       .type(newProjectTitle)
  //     // Click on the new project button
  //     cy.get(createSelector('new-project-create-button')).click()
  //     // Wait for request to Firebase to add project to return
  //     cy.wait('@addProject')
  //     // Confirm first project tile has title passed to new project input
  //     cy.get(createSelector('project-tile-name'))
  //       .first()
  //       .should('have.text', newProjectTitle)
  //   })
  // })

  // describe('Delete Project', () => {
  //   it('allows project to be deleted by project owner', () => {
  //     // click on the more button
  //     cy.get(createSelector('project-tile-more'))
  //       .first()
  //       .click()
  //     cy.get(createSelector('project-tile-delete')).click()
  //     // Confirm that new project is not available
  //     cy.get(createSelector('new-project-name')).should('not.exist')
  //   })
  // })
})
