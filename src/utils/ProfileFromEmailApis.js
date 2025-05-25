export const ProfileFromEmailApis = (results) => {
  const osintResults = results?.osintData?.data || [];

  const getIfExists = (val, source) => (val ? { value: val, source } : null);

  const fullNames = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.names?.PROFILE?.fullname,
      "Google"
    ),
  ].filter(Boolean);

  if (Array.isArray(results?.zehefData?.data)) {
    results?.zehefData.data.forEach((item) => {
      if (item.source === "Gravatar" && item.status === "found") {
        fullNames.push({ value: item.username, source: "Social Media" });
      }
    });
  }

  const locations = [].filter(Boolean);

  const phones = [].filter(Boolean);

  const emails = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.emails?.PROFILE?.value,
      "Google"
    ),
  ].filter(Boolean);

  const socialMediaPresence = {
    google: results?.emailData?.PROFILE_CONTAINER?.profile?.personId
      ? true
      : false,
  };

  // Add sources from osintData
  if (Array.isArray(osintResults)) {
    osintResults?.forEach((item) => {
      const sourceKey = item.source?.toLowerCase();
      if (sourceKey && !socialMediaPresence[sourceKey]) {
        socialMediaPresence[sourceKey] = true;
      }
    });
  }

  if (Array.isArray(results?.zehefData?.data)) {
    results?.zehefData.data.forEach((item) => {
      const platform = item.source?.toLowerCase(); // e.g. 'facebook', 'gravatar', 'github'
      const isFound = item.status === "found";
      // Only add if not already defined (e.g. skip if facebook already in presence)
      if (platform && isFound && !socialMediaPresence[platform]) {
        socialMediaPresence[platform] = true;
      }
    });
  }

  const profileImages = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.profilePhotos?.PROFILE
        ?.url,
      "Google"
    ),
  ].filter(Boolean);

  if (Array.isArray(results?.zehefData?.data)) {
    results?.zehefData?.data?.forEach((item) => {
      if (item.source === "Gravatar" && item.status === "found") {
        profileImages.push({
          value: item.avatar_url,
          source: "Social Media",
        });
      }
    });
  }
  const basicInfo = [].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults?.forEach((item) => {
      if (item.age) {
        basicInfo.push({ key: "Age", value: item.age, source: "Social Media" });
      }
      if (item.gender) {
        basicInfo.push({ key: "Gender", value: item.gender, source: "Social Media" });
      }
      if (item.dob) {
        basicInfo.push({ value: item.dob, source: "Social Media" });
      }
      if (item.name) {
        fullNames.push({ value: item.name, source: "Social Media" });
      }
      if (item.address) {
        locations.push({ value: item.address, source: "Social Media" });
      }
      if (item.phone) {
        phones.push({ value: item.phone, source: "Social Media" });
      }
      if (item.phone_secondary) {
        phones.push({
          value: item.phone_secondary,
          source: "Social Media",
        });
      }
      if (item.email) {
        emails.push({ value: item.email, source: "Social Media" });
      }
      if (item.email_secondary) {
        emails.push({ value: item.email_secondary, source: "Social Media" });
      }
    });
  }

  const EmailProfile = {
    fullNames,
    emails,
    profileImages,
    phones,
    lastUpdated: [
      getIfExists(
        results?.emailData?.PROFILE_CONTAINER?.profile.sourceIds?.PROFILE
          ?.lastUpdated,
        "Google"
      ),
    ].filter(Boolean),
    basicInfo,
    locations,
    socialMediaPresence,
  };

  return EmailProfile;
};
