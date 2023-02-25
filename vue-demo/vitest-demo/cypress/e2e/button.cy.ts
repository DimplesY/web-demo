describe('App.vue', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/')
  })

  it('button', () => {
    cy.get('[data-test="btn"]').click()
    cy.get('button').should('have.text', '1')
  })

  it('input', () => {
    cy.get('[data-test="input"]').type('Hello World')
    cy.get('input').should('have.value', 'Hello World')
  })
})
