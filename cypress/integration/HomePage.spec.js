import { createSelector } from '../utils'

describe('Home', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/')
  })

  it('Has link to login page', () => {
    cy.get(createSelector('sign-in')).click()
    cy.url().should('include', '/login')
  })
})
