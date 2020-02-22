import { createSelector } from '../utils'

describe('Projects Page', () => {
  beforeEach(() => {
    // Login using custom token
    cy.logout()
    cy.visit('/login')
    cy.get('input[name="email"]').type('cypresstest@email.com')
    cy.get('input[name="password"]').type('cypresstest')
    cy.get('button').click()          // Click on button
    cy.wait(5000)
    // Go to projects page
    cy.visit('/projects')
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile')).click()
      // Type name of new project into input
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new project button
      cy.get(createSelector('new-project-create-button')).click()
      // Wait for request to Firebase to add project to return
      cy.wait('@addProject')
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Project', () => {
    it('allows project to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('project-tile-more'))
        .first()
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm that new project is not available
      cy.get(createSelector('new-project-name')).should('not.exist')
    })
  })
})
