const BigNumber = require('bignumber.js')
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })
const methods = {
  calculate: calculateShares
}

module.exports = methods

// calculate apportionment of an amount between several shares
function calculateShares (_amount, _restrictions) {
  const amount = new BigNumber(_amount)
  // ensure we only have restrictions with shares > 0
  const restrictions = _restrictions.filter(restriction => restriction.share > 0)
  const totalShares = restrictions.reduce((prev, curr) => { return prev + curr.share }, 0)
  const restrictionAmounts = restrictions.map(restriction => {
    // calculate each restriction amount as AMOUNT / TOTAL SHARES * RESTRICTION SHARES
    return {
      tracking: restriction.tracking,
      amount: amount.div(totalShares).times(restriction.share).round(2).toNumber()
    }
  })
  // get the total of all the share amounts after rounding to two decimal points,
  // in case there's a difference between the payment amount and the line amounts
  const sharesAmount = restrictionAmounts.reduce((prev, curr) => { return prev + curr.amount }, 0)
  return {
    amount: amount.toNumber(),
    restrictions: restrictionAmounts,
    rounding: amount.sub(sharesAmount).toNumber()
  }
}
