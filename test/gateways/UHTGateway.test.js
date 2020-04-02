const path = require('path');
const { loadSQL } = require('../../lib/Utils');
const { fetchCustomerSQL } = loadSQL(path.join(__dirname, '../../lib/sql'));

describe('UHTGateway', function() {
  let uhtGateway;
  let db;

  beforeEach(() => {
    db = {
      request: jest.fn()
    };

    uhtGateway = require('../../lib/gateways/UHTGateway')({ db });
  });

  it('can fetch the customer', async function() {
    const expected = {
      app_band: 'URG',
      bedrooms: '1                   ',
      u_eff_band_date: new Date()
    };

    db.request = jest.fn(() => {
      return [expected];
    });

    const biddingNumber = '123';

    const response = await uhtGateway.fetchCustomer(biddingNumber);

    expect(db.request).toHaveBeenCalledWith(fetchCustomerSQL, [
      {
        id: 'biddingNumber',
        type: 'Int',
        value: biddingNumber
      }
    ]);

    expect(response).toEqual(expected);
  });

  it('can returns null if error fetching customer', async function() {
    db.request = jest.fn(() => {
      throw new Error();
    });

    const response = await uhtGateway.fetchCustomer('invalid');

    expect(response).toBeNull();
  });
});
