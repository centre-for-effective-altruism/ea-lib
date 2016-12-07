/* eslint-env mocha */

// test framework
const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
// const chaiSubset = require('chai-subset')
// chai.use(chaiAsPromised)
// chai.use(chaiSubset)
const expect = chai.expect
// const sinon = require('sinon')
// const sinonChai = require('sinon-chai')
// chai.use(sinonChai)

// libraries
const _shares = require('../../').shares

// dummy data
const testShares = {
  single: [
    {
      share: 1,
      tracking: 'unrestricted'
    }
  ],
  multiple: [
    {
      share: 1,
      tracking: 'unrestricted'
    },
    {
      share: 1,
      tracking: '80k'
    }
  ],
  zeros: [
    {
      share: 1,
      tracking: 'unrestricted'
    },
    {
      share: 0,
      tracking: '80k'
    }
  ],
  unequal: [
    {
      share: 1,
      tracking: 'unrestricted'
    },
    {
      share: 3,
      tracking: '80k'
    },
    {
      share: 2,
      tracking: 'c_and_o'
    }
  ],
  rounding: [
    {
      share: 1,
      tracking: 'unrestricted'
    },
    {
      share: 1,
      tracking: '80k'
    },
    {
      share: 1,
      tracking: 'c_and_o'
    }
  ],
  roundingUp: [
    {
      share: 1,
      tracking: 'unrestricted'
    },
    {
      share: 1,
      tracking: '80k'
    }
  ]
}

/*

TESTS

*/

context('Shares helper', function () {
  describe('calculate', function () {
    it('calculates a single share', function () {
      const amount = 100.00
      const shares = _shares.calculate(amount, testShares.single)
      expect(shares).to.deep.equal({
        amount: 100,
        restrictions: [{
          amount: 100,
          tracking: 'unrestricted'
        }],
        rounding: 0
      })
    })

    it('calculates from multiple shares', function () {
      const amount = 200.00
      const shares = _shares.calculate(amount, testShares.multiple)
      expect(shares).to.deep.equal({
        amount: 200,
        restrictions: [
          {
            amount: 100,
            tracking: 'unrestricted'
          },
          {
            amount: 100,
            tracking: '80k'
          }
        ],
        rounding: 0
      })
    })

    it('removes zero-share restrictions', function () {
      const amount = 300.00
      const shares = _shares.calculate(amount, testShares.zeros)
      expect(shares).to.deep.equal({
        amount: 300,
        restrictions: [{
          amount: 300,
          tracking: 'unrestricted'
        }],
        rounding: 0
      })
    })

    it('handles unequal allocations', function () {
      const amount = 600.00
      const shares = _shares.calculate(amount, testShares.unequal)
      expect(shares).to.deep.equal({
        amount: 600,
        restrictions: [
          {
            amount: 100,
            tracking: 'unrestricted'
          },
          {
            amount: 300,
            tracking: '80k'
          },
          {
            amount: 200,
            tracking: 'c_and_o'
          }
        ],
        rounding: 0
      })
    })

    it('handles restrictions that lead to rounding', function () {
      const amount = 100.00
      const shares = _shares.calculate(amount, testShares.rounding)
      expect(shares).to.deep.equal({
        amount: 100,
        restrictions: [
          {
            amount: 33.33,
            tracking: 'unrestricted'
          },
          {
            amount: 33.33,
            tracking: '80k'
          },
          {
            amount: 33.33,
            tracking: 'c_and_o'
          }
        ],
        rounding: 0.01
      })
    })

    it('handles restrictions where line amounts equal more than the total amount', function () {
      const amount = 99.99
      const shares = _shares.calculate(amount, testShares.roundingUp)
      expect(shares).to.deep.equal({
        amount: 99.99,
        restrictions: [
          {
            amount: 49.99,
            tracking: 'unrestricted'
          },
          {
            amount: 49.99,
            tracking: '80k'
          }
        ],
        rounding: 0.01
      })
    })
  })
})
