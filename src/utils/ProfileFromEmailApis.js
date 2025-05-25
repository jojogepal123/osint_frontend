export const ProfileFromEmailApis = (results) => {
  const osintResults = results?.osintData?.data || [];
  
  const getIfExists = (val, source) => (val ? { value: val, source } : null);

  const fullNames = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.names?.PROFILE?.fullname,
      "Google"
    ),
  ].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults.forEach((item) => {
      if (item.name) {
        fullNames.push({ value: item.name, source: "Social Media" });
      }
    });
  }

  const locations = [].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults.forEach((item) => {
      if (item.address) {
        locations.push({ value: item.address, source: "Social Media" });
      }
    });
  }

  const phones = [].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults.forEach((item) => {
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

  const emails = [
    getIfExists(
      results.emailData?.PROFILE_CONTAINER?.profile?.emails?.PROFILE?.value,
      "Google"
    ),
  ].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults.forEach((item) => {
      if (item.email) {
        emails.push({ value: item.email, source: "Social Media" });
      }
    });
  }

  const socialMediaPresence = {};

  // Add sources from osintData
  if (Array.isArray(osintResults)) {
    osintResults.forEach((item) => {
      const sourceKey = item.source?.toLowerCase();
      if (sourceKey && !socialMediaPresence[sourceKey]) {
        socialMediaPresence[sourceKey] = true;
      }
    });
  }

  if (Array.isArray(results.zehefData?.data)) {
    results.zehefData.data.forEach((item) => {
      const platform = item.source?.toLowerCase(); // e.g. 'facebook', 'gravatar', 'github'
      const isFound = item.status === "found";

      // Only add if not already defined (e.g. skip if facebook already in presence)
      if (platform && isFound && !socialMediaPresence[platform]) {
        socialMediaPresence[platform] = true;
      }
    });
  }

  const EmailProfile = {
    fullNames,
    emails,

    profileImages: [
      getIfExists(
        results?.emailData?.PROFILE_CONTAINER?.profile?.profilePhotos?.PROFILE
          ?.url,
        "Google"
      ),
    ].filter(Boolean),

    phones,

    lastUpdated: [
      getIfExists(
        results?.emailData?.PROFILE_CONTAINER?.profile.sourceIds?.PROFILE?.lastUpdated,
        "Google"
      ),
    ].filter(Boolean),

    basicInfo: [].filter(Boolean),

    locations,
    socialMediaPresence,
  };

  return EmailProfile;
};
