import { PoolName } from "../../../src/constants"

const poolTokens: { [key: string]: string[] } = {
  "BTC V2": ["WBTC", "RENBTC", "sBTC"],
  "Stablecoin V2": ["DAI", "USDC", "USDT"],
}

context("Deposit Flow", () => {
  beforeEach(() => {
    const host = Cypress.env("DAPP_HOST") as string
    cy.visit(`${host}#/pools`)
    cy.wait(5000)
  })
  function testPoolDeposit(poolName: PoolName) {
    it(`successfully completes a deposit of all ${poolName} assets`, () => {
      cy.contains(poolName)
        .parents("[data-testid=poolOverview]")
        .within(() => {
          cy.get("button").contains("Deposit").click()
        })
      // attempt to wait for pool data to load
      cy.get("input").first({ timeout: 10000 }).should("be.enabled")
      // TODO: assert default state of the page
      // Get before value of each token in My Share section

      cy.get("#tokenInput input").then(($inputs) => {
        cy.wrap($inputs).each(($input) => {
          cy.wrap($input).type("1")
        })
        // TODO: assert price impact changes
        // cy.wait(500)
        // click "deposit" to trigger review modal
        cy.get("button").contains("Deposit").first().click()
        // TODO: assert review data
        // click "confirm" to initiate the actual transactions
        cy.get("button").contains("Confirm Deposit").click()
        // Wait and assert after value of each token has been increased by 1
        cy.wait(10000).then(() => {
          poolTokens[poolName].forEach((token: string) => {
            cy.log("token", token)
            cy.get("[data-testid=tokenName]")
              .contains(token)
              .parent()
              .find("[data-testid=tokenValue]")
              .then(($value) => {
                const afterValue = parseInt($value.text())
                expect(afterValue).to.eq(1)
              })
          })
        })
      })
    })
  }
  ;["BTC V2", "Stablecoin V2"].forEach(testPoolDeposit)
})
