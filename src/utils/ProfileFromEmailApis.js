export const ProfileFromEmailApis = (results) => {
  const osintResults = results?.osintData?.data || [];
  const holeheResults = results?.holeheData || [];
  const getUserResults = results?.getuserData || [];

  const getIfExists = (val, source) => (val ? { value: val, source } : null);

  const fullNames = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.names?.PROFILE?.fullname,
      "Google"
    ),
    getIfExists(getUserResults?.person?.displayName, "GetUser"),
  ].filter(Boolean);

  const userNames = [].filter(Boolean);

  if (Array.isArray(results?.zehefData?.data)) {
    results?.zehefData.data.forEach((item) => {
      if (item.source === "Gravatar" && item.status === "found") {
        userNames.push({ value: item.username, source: "Social Media" });
      }
    });
  }

  const locations = [
    getIfExists(getUserResults?.person?.location, "GetUser"),
  ].filter(Boolean);

  const phones = [].filter(Boolean);
  if (Array.isArray(getUserResults?.person?.phoneNumbers)) {
    getUserResults.person.phoneNumbers.forEach((phone) => {
      if (phone) {
        phones.push({
          key: "Phone",
          value: phone,
          source: "LinkedIn",
        });
      }
    });
  }
  const emails = [
    getIfExists(
      results?.emailData?.PROFILE_CONTAINER?.profile?.emails?.PROFILE?.value,
      "Google"
    ),
  ].filter(Boolean);

  const socialMediaPresence = {};

  const googleId = results?.emailData?.PROFILE_CONTAINER?.profile?.personId;
  if (googleId) {
    socialMediaPresence.google = googleId;
  }

  const extractDomainName = (input) => {
    if (!input) return "";
    const cleaned = input.toLowerCase().trim();
    // Match domain-like patterns (e.g., amazon.com, spotify.net)
    const domainMatch = cleaned.match(
      /([a-z0-9-]+)\.(com|org|net|io|in|co|me|info|biz)/
    );
    if (domainMatch) {
      return domainMatch[1]; // Return only 'amazon' from 'amazon.com'
    }
    return cleaned.split(".")[0];
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

  if (Array.isArray(holeheResults?.used)) {
    holeheResults?.used.forEach((item) => {
      const sourceKey = extractDomainName(item);
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

  if (
    getUserResults?.person?.linkedInUrl &&
    getUserResults.person.linkedInUrl.includes("linkedin.com/in/")
  ) {
    socialMediaPresence.linkedin = true;
  }
  // 3. Add from socialScanData if not already present
  const socialScanEntries = Object.entries(results?.socialScanData?.data || {});
  const scanResults =
    socialScanEntries.length > 0 ? socialScanEntries[0][1] : [];

  if (Array.isArray(scanResults)) {
    scanResults.forEach((entry) => {
      const platformKey = entry.platform?.toLowerCase();
      if (
        entry.available === "True" &&
        platformKey &&
        !socialMediaPresence[platformKey]
      ) {
        socialMediaPresence[platformKey] = true;
        // console.log(`Added from socialScan: ${platformKey}`);
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
        basicInfo.push({ key: "Age", value: item.age, source: item.source });
      }
      if (item.gender) {
        basicInfo.push({
          key: "Gender",
          value: item.gender,
          source: item.source,
        });
      }
      if (item.dob) {
        basicInfo.push({ value: item.dob, source: item.source });
      }
      if (item.name) {
        fullNames.push({ value: item.name, source: item.source });
      }
      if (item.username) {
        userNames.push({ value: item.username, source: item.source });
      }
      if (item.address) {
        locations.push({ value: item.address, source: item.source });
      }
      if (item.phone) {
        phones.push({ value: item.phone, source: item.source });
      }
      if (item.phone_secondary) {
        phones.push({
          value: item.phone_secondary,
          source: item.source,
        });
      }
      if (item.email) {
        emails.push({ value: item.email, source: item.source });
      }
      if (item.email_secondary) {
        emails.push({ value: item.email_secondary, source: item.source });
      }
    });
  }
  const educationHistory =
    getUserResults?.person?.schools?.educationHistory || [];

  const positions = getUserResults?.person?.positions?.positionHistory || [];

  const qualifications = Array.isArray(educationHistory)
    ? educationHistory.map((s) => ({
        degree: s.degreeName || "",
        field: s.fieldOfStudy || "",
        school: s.schoolName || "",
        url: s.linkedInUrl || s.school?.linkedInUrl || "",
        startYear: s.startEndDate?.start?.year || "",
        endYear: s.startEndDate?.end?.year || "",
        source: "LinkedIn",
      }))
    : [];

  const experience = Array.isArray(positions)
    ? positions.map((p) => ({
        title: p.title || "",
        company: p.companyName || p.company?.companyName || "",
        url: p.linkedInUrl || p.company?.linkedInUrl || "",
        startYear: p.startEndDate?.start?.year || "",
        endYear: p.startEndDate?.end?.year || "",
        source: "LinkedIn",
      }))
    : [];

  const skills = Array.isArray(getUserResults?.person?.skills)
    ? getUserResults.person.skills.map((skill) => ({
        key: "Skill",
        value: skill,
        source: "LinkedIn",
      }))
    : [];

  const EmailProfile = {
    fullNames,
    userNames,
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
    qualifications,
    experience,
    skills,
  };

  return EmailProfile;
};
