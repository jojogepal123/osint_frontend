export const ProfileFromTelApis = (results) => {
  const osintResults = results?.osintData?.data || [];
  const spKycData = results?.surepassKyc?.data?.details || null;
  const getIfExists = (val, source, key) =>
    val ? { value: val, source, key } : null;

  const fullNames = [
    getIfExists(
      results?.truecallerData?.data?.basicInfo?.name?.fullName,
      "Social Media"
    ),
    getIfExists(results?.socialMediaData?.response?.name, "Social Media"),
    getIfExists(results?.whatsappData?.pushname, "WhatsApp"),
    getIfExists(
      results?.truecallerData?.data?.basicInfo?.name?.altName,
      "Social Media"
    ),
    getIfExists(results?.allMobileData?.callapp?.name, "Social Media"),
    getIfExists(results?.allMobileData?.viewcaller?.[0]?.name, "Social Media"),
    getIfExists(results?.allMobileData?.eyecon, "Social Media"),
    getIfExists(spKycData?.name, "Gov"),
    getIfExists(spKycData?.personal_info?.full_name, "Gov"),
    getIfExists(results?.surepassBank?.data?.name, "Gov"),
    getIfExists(results?.surepassUpi?.data?.name, "Gov"),
    getIfExists(
      `${results?.telegramData?.first_name || ""} ${
        results?.telegramData?.last_name || ""
      }`.trim(),
      "Social Media"
    ),
  ].filter(Boolean);

  const userNames = [
    getIfExists(results?.telegramData?.username, "Social Media"),
  ].filter(Boolean);

  const locations = [
    getIfExists(
      results?.truecallerData?.data?.addressInfo?.address,
      "Social Media"
    ),
    getIfExists(results?.hlrData?.original_country_name, "ISP Response"),
    getIfExists(results?.truecaller?.addressInfo?.city, "Social Media"),
    getIfExists(results?.truecaller?.addressInfo?.street, "Social Media"),
    getIfExists(results?.truecaller?.addressInfo?.address, "Social Media"),
  ].filter(Boolean);

  const phones = [
    getIfExists(
      results?.truecallerData?.data?.phoneInfo?.number,
      "Social Media"
    ),
    getIfExists(results?.whatsappData?.number, "WhatsApp"),
    getIfExists(results?.hlrData?.msisdn, "ISP Response"),
    getIfExists(results?.osintData?.data?.phone, "Social Media"),
    getIfExists(results?.allMobileData?.truecaller?.number, "Social Media"),
    getIfExists(results?.surepassUpi?.data?.mobile_number, "Gov"),
    getIfExists(results?.surepassKyc?.data?.mobile, "Gov"),
  ].filter(Boolean);

  if (Array.isArray(spKycData?.phone_info)) {
    spKycData.phone_info.forEach((item) => {
      if (item?.number) {
        phones.push({ value: item.number, source: "Gov" });
      }
    });
  }

  const emails = [].filter(Boolean);

  if (Array.isArray(spKycData?.email_info)) {
    spKycData.email_info.forEach((item) => {
      if (item?.email_address) {
        emails.push({ value: item.email_address, source: "Gov" });
      }
    });
  }

  const socialMediaPresence = {};

  const isSocialPresence = (platform, data) => {
    if (data) {
      socialMediaPresence[platform] = data;
    }
  };
  isSocialPresence("whatsapp", results?.whatsappData?.isUser);
  isSocialPresence("facebook", results?.socialMediaData?.response?.fb);
  isSocialPresence("telegram", results?.telegramData?.found);

  // Add sources from osintData
  if (Array.isArray(osintResults)) {
    osintResults?.forEach((item) => {
      const sourceKey = item.source?.toLowerCase();
      if (sourceKey && !socialMediaPresence[sourceKey]) {
        socialMediaPresence[sourceKey] = true;
      }
    });
  }

  const basicInfo = [
    getIfExists(results?.truecallerData?.data?.basicInfo?.gender, "Truecaller"),
    getIfExists(spKycData?.personal_info?.dob, "Gov", "DOB"),
    getIfExists(spKycData?.personal_info?.age, "Gov", "Age"),
    getIfExists(spKycData?.personal_info?.gender, "Gov", "Gender"),
    getIfExists(spKycData?.personal_info?.total_income, "Gov", "Total Income"),
    getIfExists(spKycData?.personal_info?.occupation, "Gov", "Occupation"),
  ].filter(Boolean);

  if (Array.isArray(osintResults)) {
    osintResults?.forEach((item) => {
      if (item.age) {
        basicInfo.push({ key: "Age", value: item.age, source: "Social Media" });
      }
      if (item.gender) {
        basicInfo.push({
          key: "Gender",
          value: item.gender,
          source: "Social Media",
        });
      }
      if (item.dob) {
        basicInfo.push({ value: item.dob, source: "Social Media" });
      }
      if (item.name) {
        fullNames.push({ value: item.name, source: "Social Media" });
      }
      if (item.username) {
        userNames.push({ value: item.username, source: "Social Media" });
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

  const idProofs = [].filter(Boolean);

  const identityInfo = spKycData?.identity_info || {};

  Object.keys(identityInfo).forEach((key) => {
    if (Array.isArray(identityInfo[key])) {
      identityInfo[key].forEach((item) => {
        if (item.id_number) {
          let label = key;
          if (key === "pan_number") label = "PAN Number";
          else if (key === "aadhaar_number") label = "Aadhaar";
          else if (key === "voter_id") label = "Voter ID";
          else if (key === "passport_number") label = "Passport Number";
          else if (key === "driving_license") label = "Driving License Number";
          else if (key === "ration_card") label = "Ration Card Number";
          else
            label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

          idProofs.push({
            key: label,
            value: item.id_number,
            source: "Gov",
          });
        }
      });
    }
  });

  const verifiedAddress = [].filter(Boolean);

  if (Array.isArray(spKycData?.address_info)) {
    spKycData.address_info.forEach((item) => {
      if (item.address) {
        const formatted = [
          `Address: ${item.address}`,
          item.state && `State: ${item.state}`,
          item.type && `Type: ${item.type}`,
          item.postal && `Postal: ${item.postal}`,
          item.reported_date && `Reported: ${item.reported_date}`,
        ]
          .filter(Boolean)
          .join(", ");

        verifiedAddress.push({
          value: formatted,
          source: "Gov",
        });
      }
    });
  }

  const bankDetails = [
    getIfExists(
      results?.surepassBank?.data?.bank_account_no,
      "Gov",
      "Bank Account No"
    ),
    getIfExists(results?.surepassBank?.data?.bank_ifsc, "Gov", "IFSC Code"),
    getIfExists(results?.surepassBank?.data?.bank_details, "Gov", "Bank Name"),
  ].filter(Boolean);

  const upiDetails = [].filter(Boolean);

  const upiData = results?.surepassUpi?.data?.upi_id || null;

  if (Array.isArray(upiData)) {
    upiData.forEach((item) => {
      if (item) {
        upiDetails.push({ key: "Upi Id", value: item, source: "Gov" });
      }
    });
  }

  const telegramImage = results?.telegramData?.profile_photo
    ? "/photo/" + results.telegramData.profile_photo
    : null;

  const profileImages = [
    getIfExists(results?.whatsappData?.profilePic, "WhatsApp"),
    telegramImage ? { value: telegramImage, source: "Social Media" } : null,
  ].filter(Boolean);

  const carriers = [
    getIfExists(
      results?.truecallerData?.data?.phoneInfo?.carrier,
      "Truecaller"
    ),
    getIfExists(results?.hlrData?.original_network_name, "ISP Response"),
    getIfExists(results?.allMobileData?.truecaller?.provieder, "Truecaller"),
  ].filter(Boolean);

  const numberIsActivate = results?.hlrData?.connectivity_status ? true : false;

  const countryCodes = [
    getIfExists(
      results?.truecallerData?.data?.addressInfo?.countryCode,
      "Truecaller"
    ),
    getIfExists(results?.whatsappData?.countryCode, "WhatsApp"),
    getIfExists(results?.hlrData?.original_country_code, "ISP Response"),
  ].filter(Boolean);

  const jobProfiles = [
    getIfExists(
      results?.truecallerData?.data?.basicInfo?.jobTitle,
      "Truecaller"
    ),
  ].filter(Boolean);

  const lastUpdated = [
    getIfExists(results?.hlrData?.timestamp, "ISP Response"),
  ].filter(Boolean);

  const isSpam = results?.socialMediaData?.response?.is_spam || false;
  const isBusiness = results?.whatsappData?.isBusiness || false;
  const imsi = results?.hlrData?.imsi || null;

  const panNumberExists = idProofs.some(
    (proof) => proof.key === "PAN Number" && proof.value
  );
  const kycMobile = results?.surepassKyc?.data?.mobile || null;
  const kycFullName = spKycData?.personal_info?.full_name || null;
  const isCreditExists = [].filter(Boolean);
  if (panNumberExists && kycMobile && kycFullName) {
    isCreditExists.push(true);
  }
  const TelProfile = {
    fullNames,
    userNames,
    emails,
    profileImages,
    phones,
    bankDetails,
    upiDetails,
    numberIsActivate,
    basicInfo,
    idProofs,
    carriers,
    locations,
    verifiedAddress,
    countryCodes,
    jobProfiles,
    lastUpdated,
    isSpam,
    isBusiness,
    imsi,
    socialMediaPresence,
    isCreditExists,
  };

  return TelProfile;
};
