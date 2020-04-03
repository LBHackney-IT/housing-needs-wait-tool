const FetchHousingRegisterData = require('../../lib/use_cases/FetchHousingRegisterData');

describe('FetchHousingRegisterData', function() {
  let uhtGatewaySpy;
  let fetchHousingRegisterData;

  beforeEach(() => {
    uhtGatewaySpy = {
      fetchCurrentListState: jest.fn(() => {
        return {};
      }),
      fetchNewMemberData: jest.fn(() => {
        return {};
      }),
      fetchNewPropertyData: jest.fn(() => {
        return {};
      }),
      fetchCustomerData: jest.fn(customer => {
        if (!customer) {
          return null;
        }
        return {};
      }),
      fetchCustomer: jest.fn(biddingNumber => {
        if (biddingNumber === 'invalid') {
          return null;
        }
        return {};
      })
    };

    fetchHousingRegisterData = FetchHousingRegisterData({
      uhtGateway: uhtGatewaySpy
    });
  });

  it('can fetch the housing register data from UHT', async function() {
    const response = await fetchHousingRegisterData();

    expect(uhtGatewaySpy.fetchCurrentListState).toHaveBeenCalledTimes(1);
    expect(uhtGatewaySpy.fetchNewMemberData).toHaveBeenCalledTimes(1);
    expect(uhtGatewaySpy.fetchNewPropertyData).toHaveBeenCalledTimes(1);

    expect(response.listState).toBeDefined();
    expect(response.newMembers).toBeDefined();
    expect(response.newProperties).toBeDefined();
  });

  it('can return customer data when given a valid bidding number', async function() {
    const response = await fetchHousingRegisterData('valid');

    expect(uhtGatewaySpy.fetchCustomerData).toHaveBeenCalledTimes(1);

    expect(response.customerData).toBeDefined();
  });

  it('can not return customer data when given a invalid bidding number', async function() {
    const response = await fetchHousingRegisterData('invalid');

    expect(uhtGatewaySpy.fetchCustomer).toHaveBeenCalledTimes(1);
    expect(uhtGatewaySpy.fetchCustomerData).toHaveBeenCalledTimes(0);

    expect(response).not.toBeDefined();
  });
});
