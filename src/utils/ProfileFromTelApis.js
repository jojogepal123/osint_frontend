export const ProfileFromTelApis = (results) => {
  const osResults = results?.osintData?.data || [];
  const spKResults = results?.spkData?.data?.details || null;

  const getIfExists = (val, source, key) =>
    val ? { value: val, source, key } : null;

  const vcPrimary = getIfExists(
    results?.vcData?.data?.[0]?.name,
    "Social Media"
  );

  const vcAlts =
    (results?.vcData?.data?.[0]?.names || [])
      .map((n) => getIfExists(n?.name, "Social Media"))
      .filter(Boolean) || [];

  const fullNames = [
    getIfExists(
      results?.tcData?.data?.basicInfo?.name?.fullName,
      "Social Media"
    ),
    getIfExists(results?.smData?.response?.name, "Social Media"),
    getIfExists(results?.wpData?.pushname, "WhatsApp"),
    getIfExists(
      results?.tcData?.data?.basicInfo?.name?.altName,
      "Social Media"
    ),
    getIfExists(results?.syncData?.data?.name, "Social Media"),
    vcPrimary,
    ...vcAlts,
    getIfExists(results?.allMData?.callapp?.name, "Social Media"),
    getIfExists(results?.allMData?.viewcaller?.[0]?.name, "Social Media"),
    getIfExists(results?.allMData?.eyecon, "Social Media"),
    getIfExists(spKResults?.name, "Gov"),
    getIfExists(spKResults?.personal_info?.full_name, "Gov"),
    getIfExists(results?.spbData?.data?.name, "Gov"),
    getIfExists(results?.spuData?.data?.name, "Gov"),
    getIfExists(
      `${results?.tlgData?.first_name || ""} ${
        results?.tlgData?.last_name || ""
      }`.trim(),
      "Social Media"
    ),
    getIfExists(results?.tlgData?.username, "Social Media"),
  ].filter(Boolean);

  const userNames = [
    getIfExists(results?.tlgData?.display_name, "Social Media"),
  ].filter(Boolean);

  const locations = [
    getIfExists(results?.tcData?.data?.addressInfo?.address, "Social Media"),
    getIfExists(results?.hData?.original_country_name, "ISP Response"),
    getIfExists(results?.tcData?.addressInfo?.city, "Social Media"),
    getIfExists(results?.tcData?.addressInfo?.street, "Social Media"),
    getIfExists(results?.tcData?.addressInfo?.address, "Social Media"),
    getIfExists(results?.syncData?.data?.geospace?.latitude, "Latitude"),
    getIfExists(results?.syncData?.data?.geospace?.longitude, "Longitude"),
    getIfExists(results?.syncData?.data?.geospace?.country, "Social Media"),
  ].filter(Boolean);

  const phones = [
    getIfExists(results?.tcData?.data?.phoneInfo?.number, "Social Media"),
    getIfExists(results?.wpData?.number, "WhatsApp"),
    getIfExists(results?.hData?.msisdn, "ISP Response"),
    getIfExists(results?.osData?.data?.phone, "Social Media"),
    getIfExists(results?.allMData?.tcData?.number, "Social Media"),
    getIfExists(results?.spuData?.data?.mobile_number, "Gov"),
    getIfExists(results?.spkData?.data?.mobile, "Gov"),
    getIfExists(results?.tlgData?.phone_visible, "Social Media"),
  ].filter(Boolean);

  if (Array.isArray(spKResults?.phone_info)) {
    spKResults.phone_info.forEach((item) => {
      if (item?.number) {
        phones.push({ value: item.number, source: "Gov" });
      }
    });
  }

  const emails = [].filter(Boolean);

  if (Array.isArray(spKResults?.email_info)) {
    spKResults.email_info.forEach((item) => {
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
  isSocialPresence("whatsapp", results?.wpData?.isUser);
  isSocialPresence("facebook", results?.smData?.response?.fb);
  isSocialPresence("telegram", results?.tlgData?.status === "success");

  // Add sources from osData
  if (Array.isArray(osResults)) {
    osResults?.forEach((item) => {
      const sourceKey = item.source?.toLowerCase();
      if (sourceKey && !socialMediaPresence[sourceKey]) {
        socialMediaPresence[sourceKey] = true;
      }
    });
  }

  const basicInfo = [
    getIfExists(results?.tcData?.data?.basicInfo?.gender, "Social Media"),
    getIfExists(spKResults?.personal_info?.dob, "Gov", "DOB"),
    getIfExists(spKResults?.personal_info?.age, "Gov", "Age"),
    getIfExists(spKResults?.personal_info?.gender, "Gov", "Gender"),
    getIfExists(spKResults?.personal_info?.total_income, "Gov", "Total Income"),
    getIfExists(spKResults?.personal_info?.occupation, "Gov", "Occupation"),
  ].filter(Boolean);

  if (Array.isArray(osResults)) {
    osResults?.forEach((item) => {
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

  const idProofs = [].filter(Boolean);

  const identityInfo = spKResults?.identity_info || {};

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

  if (Array.isArray(spKResults?.address_info)) {
    spKResults.address_info.forEach((item) => {
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
      results?.spbData?.data?.bank_account_no,
      "Gov",
      "Bank Account No"
    ),
    getIfExists(results?.spbData?.data?.bank_ifsc, "Gov", "IFSC Code"),
    getIfExists(results?.spbData?.data?.bank_details, "Gov", "Bank Name"),
  ].filter(Boolean);

  const upiDetails = [].filter(Boolean);

  const upiData = results?.spuData?.data?.upi_id || null;

  if (Array.isArray(upiData)) {
    upiData.forEach((item) => {
      if (item) {
        upiDetails.push({ key: "Upi Id", value: item, source: "Gov" });
      }
    });
  }

  // Telegram photos (array)
  const API_BASE = import.meta.env.VITE_FASTAPI_BASE_URL;
  const telegramImages = Array.isArray(results?.tlgData?.photos)
    ? results.tlgData.photos.map((photoPath, index) => {
        const fileName = photoPath.split(/[\\/]/).pop(); // handles \ and /
        return {
          value: `${API_BASE}/telegram_photos/${fileName}`,
          source: "Telegram",
          key: `telegram-${index}`,
        };
      })
    : [];

  const profileImages = [
    getIfExists(results?.wpData?.urlImage, "WhatsApp"),
    ...telegramImages,
  ].filter(Boolean);
  // console.log(profileImages);
  const carriers = [
    getIfExists(results?.tcData?.data?.phoneInfo?.carrier, "Social Media"),
    getIfExists(
      results?.hData?.original_network_name,
      "ISP Response",
      "Original Network"
    ),
    getIfExists(
      results?.hData?.ported_network_name,
      "ISP Response",
      "Ported Network"
    ),
    getIfExists(results?.allMData?.tcData?.provieder, "Social Media"),
  ].filter(Boolean);

  const numberIsActivate = results?.hData?.connectivity_status ? true : false;

  const countryCodes = [
    getIfExists(
      results?.tcData?.data?.addressInfo?.countryCode,
      "Social Media"
    ),
    getIfExists(results?.wpData?.countryCode, "WhatsApp"),
    getIfExists(results?.hData?.original_country_code, "ISP Response"),
  ].filter(Boolean);

  const jobProfiles = [
    getIfExists(results?.tcData?.data?.basicInfo?.jobTitle, "Social Media"),
  ].filter(Boolean);

  const lastUpdated = [
    results?.hData?.timestamp ? "Active" : "Inactive",
  ].filter(Boolean);

  // { console.log(results?.hData?.timestamp) }

  const isSpam = results?.smData?.response?.is_spam || false;
  const isBusiness = results?.wpData?.isBusiness || false;
  const imsi = results?.hData?.imsi || null;

  const panNumberExists = idProofs.some(
    (proof) => proof.key === "PAN Number" && proof.value
  );
  const kycMobile = results?.spkData?.data?.mobile || null;
  const kycFullName = spKResults?.personal_info?.full_name || null;
  const isCreditExists = [].filter(Boolean);
  if (panNumberExists && kycMobile && kycFullName) {
    isCreditExists.push(true);
  }

  let rcNumber = [];
  const rcData = results?.sprcData?.data;
  if (Array.isArray(rcData?.rc_number)) {
    rcNumber = rcData.rc_number.filter(Boolean);
  } else if (rcData?.rc_number) {
    rcNumber = [rcData.rc_number];
  }
  const whatsappAboutWithDate = results?.wpData?.aboutHistory
    ?.filter((item) => item?.about)
    .map((item) => {
      const date = new Date(item.date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `${item.about} (${date})`;
    })
    .join(" | ");

  const telBio = [
    getIfExists(results?.tlgData?.bio, "Social Media"),
    getIfExists(whatsappAboutWithDate, "WhatsApp"),
  ].filter(Boolean);
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
    rcNumber,
    socialMediaPresence,
    isCreditExists,
    telBio,
  };

  return TelProfile;
};
