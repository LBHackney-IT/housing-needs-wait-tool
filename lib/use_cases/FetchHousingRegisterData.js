module.exports = options => {
  const uhtGateway = options.uhtGateway;

  return async biddingNumber => {
    let output = {};
    let queries = [
      uhtGateway.fetchCurrentListState(),
      uhtGateway.fetchNewMemberData(),
      uhtGateway.fetchNewPropertyData()
    ];
    if (biddingNumber) {
      const customer = await uhtGateway.fetchCustomer(biddingNumber);
      queries.push(uhtGateway.fetchCustomerData(customer));
      output.biddingNumber = biddingNumber;
    }
    const results = await Promise.all(queries);

    output.listState = results[0];
    output.newMembers = results[1];
    output.newProperties = results[2];

    if (biddingNumber) {
      output.customerData = results[3];
    }

    return output;
  };
};
