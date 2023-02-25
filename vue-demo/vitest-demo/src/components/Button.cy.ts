import Button from './Button.vue'
describe('<Button />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Button)
    cy.get('button').should('contain', '0').click().click().click()
    cy.get('button').should('contain', '3')
  })
})
