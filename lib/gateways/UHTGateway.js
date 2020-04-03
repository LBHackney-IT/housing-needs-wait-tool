const { loadSQL } = require('../Utils');
const path = require('path');
const {
  fetchCurrentListStateSQL,
  fetchCustomerSQL,
  fetchCustomerDataSQL,
  fetchNewMemberDataSQL,
  fetchNewPropertyDataSQL,
  fetchDobSQL
} = loadSQL(path.join(__dirname, '../sql'));

const groupList = list => {
  return list.reduce((acc, res) => {
    if (!acc[res.band]) acc[res.band] = {};
    acc[res.band][res.bedrooms] = res.count;
    return acc;
  }, {});
};

module.exports = options => {
  const db = options.db;

  return {
    fetchCurrentListState: async () => {
      try {
        const result = await db.request(fetchCurrentListStateSQL);
        return groupList(result);
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    fetchNewMemberData: async () => {
      try {
        const result = await db.request(fetchNewMemberDataSQL);
        return groupList(result);
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    fetchNewPropertyData: async () => {
      try {
        const result = await db.request(fetchNewPropertyDataSQL);
        return result.reduce((acc, res) => {
          acc[res.bedrooms] = res.count;
          return acc;
        }, {});
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    fetchCustomer: async biddingNumber => {
      try {
        const customers = await db.request(fetchCustomerSQL, [
          { id: 'biddingNumber', type: 'Int', value: biddingNumber }
        ]);
        return customers[0];
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    fetchCustomerData: async customer => {
      try {
        if (!customer) {
          return null;
        }

        const result = await db.request(fetchCustomerDataSQL, [
          { id: 'bandDate', type: 'DateTime', value: customer.u_eff_band_date },
          { id: 'appBand', type: 'NVarChar', value: customer.app_band },
          { id: 'bedrooms', type: 'NVarChar', value: customer.bedrooms }
        ]);

        return {
          band: customer.app_band,
          bedrooms: parseInt(customer.bedrooms.trim()),
          position: result[0].position
        };
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    fetchDob: async biddingNumber => {
      try {
        const result = await db.request(fetchDobSQL, [
          { id: 'biddingNumber', type: 'Int', value: biddingNumber }
        ]);
        if (result.length === 0) {
          return null;
        }
        return result[0].dob;
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  };
};
