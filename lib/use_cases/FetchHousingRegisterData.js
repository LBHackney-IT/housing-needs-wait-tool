module.exports = options => {
  const uhtGateway = options.uhtGateway;

  return async biddingNumber => {
    const customer = await uhtGateway.fetchCustomer(biddingNumber);

    if (!customer) {
      return;
    }

    const results = await Promise.all([
      uhtGateway.fetchCurrentListState(),
      uhtGateway.fetchNewMemberData(),
      uhtGateway.fetchNewPropertyData(),
      uhtGateway.fetchCustomerData(customer)
    ]);

    return {
      listState: results[0],
      newMembers: results[1],
      newProperties: results[2],
      customerData: results[3],
      biddingNumber: biddingNumber
    };
  };
};
