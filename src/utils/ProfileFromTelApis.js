export const ProfileFromTelApis = (results) => {
  const getIfExists = (val, source) => (val ? { value: val, source } : null);

  const fullNames = [
    getIfExists(
      results.truecallerData?.data?.basicInfo?.name?.fullName,
      "Social Media"
    ),
    getIfExists(results.socialMediaData?.response?.name, "Social Media"),
    getIfExists(results.whatsappData?.pushname, "WhatsApp"),
    getIfExists(
      results.truecallerData?.data?.basicInfo?.name?.altName,
      "Social Media"
    ),
    getIfExists(results.allMobileData?.callapp?.name, "Social Media"),
    getIfExists(results.allMobileData?.viewcaller?.[0]?.name, "Social Media"),
    getIfExists(results.allMobileData?.eyecon, "Social Media"),
  ].filter(Boolean);

  if (Array.isArray(results.osintData)) {
    results.osintData.forEach((item) => {
      if (item.name) {
        fullNames.push({ value: item.name, source: "Social Media" });
      }
    });
  }

  const locations = [
    getIfExists(
      results.truecallerData?.data?.addressInfo?.address,
      "Social Media"
    ),
    getIfExists(results.hlrData?.original_country_name, "ISP Response"),
    getIfExists(results.truecaller?.addressInfo?.city, "Social Media"),
    getIfExists(results.truecaller?.addressInfo?.street, "Social Media"),
    getIfExists(results.truecaller?.addressInfo?.address, "Social Media"),
    getIfExists(results.osintData?.data?.address, "Social Media"),
  ].filter(Boolean);

  if (Array.isArray(results.osintData)) {
    results.osintData.forEach((item) => {
      if (item.address) {
        locations.push({ value: item.address, source: "Social Media" });
      }
    });
  }

  const phones = [
    getIfExists(results.truecallerData?.data?.phoneInfo?.number, "Social Media"),
    getIfExists(results.whatsappData?.number, "WhatsApp"),
    getIfExists(results.hlrData?.msisdn, "ISP Response"),
    getIfExists(results.osintData?.data?.phone, "Social Media"),
    getIfExists(results.allMobileData?.truecaller?.number, "Social Media"),
  ].filter(Boolean);

  if (Array.isArray(results.osintData)) {
    results.osintData.forEach((item) => {
      if (item.phone) {
        phones.push({ value: item.phone, source: "Social Media" });
      }
      if (item.phone_secondary) {
        phones.push({
          value: item.phone_secondary,
          source: "Social Media",
        });
      }
    });
  }

  const emails = [].filter(Boolean);

  if (Array.isArray(results.osintData)) {
    results.osintData.forEach((item) => {
      if (item.email) {
        emails.push({ value: item.email, source: "Social Media" });
      }
    });
  }

  const socialMediaPresence = {
    whatsapp: results.whatsappData?.isUser ?? false,
    facebook: results.socialMediaData?.response?.fb ? true : false,
  };

  // Add sources from osintData
  if (Array.isArray(results.osintData)) {
    results.osintData.forEach((item) => {
      const sourceKey = item.source?.toLowerCase();
      if (sourceKey && !socialMediaPresence[sourceKey]) {
        socialMediaPresence[sourceKey] = true;
      }
    });
  }

  const TelProfile = {
    fullNames,
    emails,
    profileImages: [
      getIfExists(results.whatsappData?.profilePic, "WhatsApp"),
    ].filter(Boolean),

    phones,

    numberIsActivate: results.hlrData?.connectivity_status ? true : false,

    basicInfo: [
      getIfExists(
        results.truecallerData?.data?.basicInfo?.gender,
        "Truecaller"
      ),
    ].filter(Boolean),

    carriers: [
      getIfExists(
        results.truecallerData?.data?.phoneInfo?.carrier,
        "Truecaller"
      ),
      getIfExists(results.hlrData?.original_network_name, "ISP Response"),
      getIfExists(results.allMobileData?.truecaller?.provieder, "Truecaller"),
    ].filter(Boolean),

    locations,

    countryCodes: [
      getIfExists(
        results.truecallerData?.data?.addressInfo?.countryCode,
        "Truecaller"
      ),
      getIfExists(results.whatsappData?.countryCode, "WhatsApp"),
      getIfExists(results.hlrData?.original_country_code, "ISP Response"),
    ].filter(Boolean),

    jobProfiles: [
      getIfExists(
        results.truecallerData?.data?.basicInfo?.jobTitle,
        "Truecaller"
      ),
    ].filter(Boolean),

    isSpam: results.socialMediaData?.response?.is_spam || false,
    isBusiness: results.whatsappData?.isBusiness || false,
    lastSeen: results.hlrData?.timestamp || null,
    imsi: results.hlrData?.imsi || null,

    socialMediaPresence,
  };

  return TelProfile;
};
