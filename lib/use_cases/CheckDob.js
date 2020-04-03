const moment = require('moment');

module.exports = options => {
  const uhtGateway = options.uhtGateway;

  return async (biddingNumber, dob) => {
    const fetchedDob = await uhtGateway.fetchDob(biddingNumber);

    if (fetchedDob) {
      return dob === moment(fetchedDob).format('DD/MM/YYYY');
    }

    return true;
  };
};
