const bands = {
  URG: 'URG',
  HOM: 'HOM',
  GEN: 'GEN',
  RES: 'RES'
};

const getOverallPosition = d => {
  if (d.customerData.band === bands.URG) {
    return d.customerData.position;
  }

  if (d.customerData.band === bands.HOM) {
    return d.listState.URG[d.customerData.bedrooms] + d.customerData.position;
  }

  if (d.customerData.band === bands.GEN) {
    return (
      d.listState.URG[d.customerData.bedrooms] +
      d.listState.HOM[d.customerData.bedrooms] +
      d.customerData.position
    );
  }

  if (d.customerData.band === bands.RES) {
    return (
      d.listState.URG[d.customerData.bedrooms] +
      d.listState.HOM[d.customerData.bedrooms] +
      d.listState.GEN[d.customerData.bedrooms] +
      d.customerData.position
    );
  }

  return 0;
};

const getHousingRegisterCountForBedroomSize = d => {
  return (
    d.listState.URG[d.customerData.bedrooms] +
    d.listState.HOM[d.customerData.bedrooms] +
    d.listState.GEN[d.customerData.bedrooms] +
    d.listState.RES[d.customerData.bedrooms]
  );
};

const getHousingRegisterCount = d => {
  return (
    Object.values(d.listState.URG).reduce((a, b) => a + b, 0) +
    Object.values(d.listState.HOM).reduce((a, b) => a + b, 0) +
    Object.values(d.listState.GEN).reduce((a, b) => a + b, 0) +
    Object.values(d.listState.RES).reduce((a, b) => a + b, 0)
  );
};

const getNewProperyCount = d => {
  const count = d.newProperties[d.customerData.bedrooms];
  if (count) return count;
  return 0;
};

const getEffectivePropertyCount = d => {
  return getNewProperyCount(d) - getAddedAheadOfYouCount(d);
};

const getAddedAheadOfYouCount = d => {
  const urg = d.newMembers.URG[d.customerData.bedrooms];
  const hom = d.newMembers.HOM[d.customerData.bedrooms];
  const gen = d.newMembers.GEN[d.customerData.bedrooms];

  if (d.customerData.band === bands.HOM) {
    return urg ? urg : 0;
  }

  if (d.customerData.band === bands.GEN) {
    return (urg ? urg : 0) + (hom ? hom : 0);
  }

  if (d.customerData.band === bands.RES) {
    return (urg ? urg : 0) + (hom ? hom : 0) + (gen ? gen : 0);
  }

  return 0;
};

const getProgress = (overallPosition, totalCount) => {
  const progress =
    Math.floor((100 - (overallPosition / totalCount) * 100) / 10) * 10;

  return progress === 0 ? 10 : progress;
};

module.exports = {
  getProgressBarData: d => {
    const overallPosition = getOverallPosition(d);
    const totalCount = getHousingRegisterCountForBedroomSize(d);
    const progress = getProgress(overallPosition, totalCount);

    return {
      overallPosition,
      progress,
      totalCount
    };
  },
  getWaitTimeData: d => {
    const effectivePropertyCount = getEffectivePropertyCount(d);

    if (effectivePropertyCount === 0) {
      return { message: 'Unknown' };
    }

    const totalMonths = Math.ceil(
      ((getOverallPosition(d) - 1) / effectivePropertyCount) * 12
    );

    const months = totalMonths % 12;
    const years = Math.floor(totalMonths / 12);

    if (years < 1) {
      return { message: 'around 12 months' };
    }
    return { message: `${years} years ${months} months` };
  },
  getWhyIsThisData: d => {
    const aheadOfYou = getOverallPosition(d) - 1;
    const bedrooms = d.customerData.bedrooms;
    const housingRegisterCount = getHousingRegisterCount(d);
    const propertyCount = getNewProperyCount(d);

    return {
      aheadOfYou,
      bedrooms,
      housingRegisterCount,
      propertyCount
    };
  },
  getYourApplicationData: d => {
    const band = bands[d.customerData.band];
    const bedrooms = d.customerData.bedrooms;
    const biddingNumber = d.biddingNumber;
    const overallPosition = getOverallPosition(d);
    const totalCount = getHousingRegisterCountForBedroomSize(d);

    return {
      band,
      bedrooms,
      biddingNumber,
      overallPosition,
      totalCount
    };
  }
};
