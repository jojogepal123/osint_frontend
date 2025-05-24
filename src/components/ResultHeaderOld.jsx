import { useState } from "react";
import useAuthcontext from "../context/AuthContext";
const ResultHeader = ({ userInput, onNewSearch, type, profile, results }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const { hibpResults, skypeResults, zehefResults, osintDataResults } =
  //   useAuthcontext();
  const { hibpResults, zehefResults, osintDataResults } = useAuthcontext();
  const handleSaveResults = () => {
    // Create HTML content with styling
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Search Results - ${userInput}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 20px;
                    background: #1A1F30;
                    color: white;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header {
                    background: #313544;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .card {
                    background: #313544;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 10px;
                }
                .card-header img {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                }
                .card-title {
                    font-size: 1.5em;
                    margin: 0;
                    color: white;
                }
                .card-inner {
                    background: #2A2F3D;
                    border-radius: 8px;
                    padding: 15px;  
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                .data-grid {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 10px;
                    margin-top: 15px;
                }
                .label {
                    font-weight: bold;
                    color: #8B8B8B;
                }
                .value {
                    color: white;
                }
                .profile-image {
                    max-width: 200px;
                    border-radius: 8px;
                    margin: 10px 0;
                }
                .section-title {
                    color: #ABDE64;
                    font-size: 1.2em;
                    margin: 20px 0 10px 0;
                }
                .social-links {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: 10px;
                }
                .social-link {
                    background: rgba(255,255,255,0.1);
                    padding: 5px 10px;
                    border-radius: 4px;
                    color: white;
                    text-decoration: none;
                }
                .social-link:hover {
                    background: rgba(255,255,255,0.2);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Search Results for: ${userInput}</h1>
                    <p>Search Type: ${type}</p>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
    
                ${
                  type === "tel"
                    ? `
                    <!-- Phone Number Search Results -->
                    
                    <!-- WhatsApp Data -->
                    ${
                      results.whatsappData
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <img src="https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png" alt="WhatsApp">
                                <h2 class="card-title">WhatsApp Data</h2>
                            </div>
                        <div>
                         ${
                           results.whatsappData.profilePic
                             ? `
                                    <img class="profile-image" src="${results.whatsappData.profilePic}" alt="Profile Picture">
                                `
                             : ""
                         }</div>      
                       <div class="data-grid">
                                <div class="label">Number:</div>
                                <div class="value">${
                                  results.whatsappData.number || "N/A"
                                }</div>
                                <div class="label">Country Code:</div>
                                <div class="value">${
                                  results.whatsappData.countryCode || "N/A"
                                }</div>
                                <div class="label">Business Account:</div>
                                <div class="value">${
                                  results.whatsappData.isBusiness ? "Yes" : "No"
                                }</div>
                                <div class="label">Username:</div>
                                <div class="value">${
                                  results.whatsappData.pushname || "N/A"
                                }</div>
                                <div class="label">Is User:</div>
                                <div class="value">${
                                  results.whatsappData.isUser ? "Yes" : "No"
                                }</div>
                            </div>
                        </div>
                    `
                        : ""
                    }
    
                    <!-- ISP DATA -->
                    ${
                      results.hlrData
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <img src="https://cdn-icons-png.flaticon.com/512/1055/1055329.png" alt="ISP">
                                <h2 class="card-title">ISP Lookup</h2>
                            </div>
                            <div class="data-grid">
                                <div class="label">ID:</div>
                                <div class="value">${
                                  results.hlrData.id || "N/A"
                                }</div>
                                <div class="label">MSISDN:</div>
                                <div class="value">${
                                  results.hlrData.msisdn || "N/A"
                                }</div>
                                <div class="label">MCCMNC:</div>
                                <div class="value">${
                                  results.hlrData.mccmnc || "N/A"
                                }</div>
                                <div class="label">Connectivity Status:</div>
                                <div class="value">${
                                  results.hlrData.connectivity_status || "N/A"
                                }</div>
                                <div class="label">MCC:</div>
                                <div class="value">${
                                  results.hlrData.mcc || "N/A"
                                }</div>
                                <div class="label">MNC:</div>
                                <div class="value">${
                                  results.hlrData.mnc || "N/A"
                                }</div>
                                <div class="label">IMSI:</div>
                                <div class="value">${
                                  results.hlrData.imsi || "N/A"
                                }</div>
                                <div class="label">MSIN:</div>
                                <div class="value">${
                                  results.hlrData.msin || "N/A"
                                }</div>
                                <div class="label">MSC:</div>
                                <div class="value">${
                                  results.hlrData.msc || "N/A"
                                }</div>
                                <div class="label">Original Network Name:</div>
                                <div class="value">${
                                  results.hlrData.original_network_name || "N/A"
                                }</div>
                                <div class="label">Original Country Name:</div>
                                <div class="value">${
                                  results.hlrData.original_country_name || "N/A"
                                }</div>
                                <div class="label">Original Country Code:</div>
                                <div class="value">${
                                  results.hlrData.original_country_code || "N/A"
                                }</div>
                                <div class="label">Original Country Prefix:</div>
                                <div class="value">${
                                  results.hlrData.original_country_prefix ||
                                  "N/A"
                                }</div>
                                <div class="label">Is Ported:</div>
                                <div class="value">${
                                  results.hlrData.is_ported ? "Yes" : "No"
                                }</div>
                                <div class="label">Cost:</div>
                                <div class="value">${
                                  results.hlrData.cost || "N/A"
                                }</div>
                                <div class="label">Timestamp:</div>
                                <div class="value">${
                                  results.hlrData.timestamp || "N/A"
                                }</div>
                                <div class="label">Storage:</div>
                                <div class="value">${
                                  results.hlrData.storage || "N/A"
                                }</div>
                                <div class="label">Route:</div>
                                <div class="value">${
                                  results.hlrData.route || "N/A"
                                }</div>
                                <div class="label">Processing Status:</div>
                                <div class="value">${
                                  results.hlrData.processing_status || "N/A"
                                }</div>
                                <div class="label">Source:</div>
                                <div class="value">${
                                  results.hlrData.data_source || "N/A"
                                }</div>
                            </div>
                        </div>
                        `
                        : ""
                    }
    
                    <!-- Truecaller Data -->
                    ${
                      results.truecallerData
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <img src="https://www.truecaller.com/pwa-192x192.png" alt="Truecaller">
                                <h2 class="card-title">Truecaller Data</h2>
                            </div>
                            ${
                              results.truecallerData.data?.addressInfo
                                ? `
                                <div class="section-title">Address Information</div>
                                <div class="data-grid">
                                    <div class="label">Street:</div>
                                    <div class="value">${
                                      results.truecallerData.data.addressInfo
                                        .street || "N/A"
                                    }</div>
                                    <div class="label">Address:</div>
                                    <div class="value">${
                                      results.truecallerData.data.addressInfo
                                        .address || "N/A"
                                    }</div>
                                    <div class="label">City:</div>
                                    <div class="value">${
                                      results.truecallerData.data.addressInfo
                                        .city || "N/A"
                                    }</div>
                                    <div class="label">Country Code:</div>
                                    <div class="value">${
                                      results.truecallerData.data.addressInfo
                                        .countryCode || "N/A"
                                    }</div>
                                    <div class="label">Time Zone:</div>
                                    <div class="value">${
                                      results.truecallerData.data.addressInfo
                                        .timeZone || "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
                            
                            ${
                              results.truecallerData.data?.phoneInfo
                                ? `
                                <div class="section-title">Phone Information</div>
                                <div class="data-grid">
                                    <div class="label">E.164 Format:</div>
                                    <div class="value">${
                                      results.truecallerData.data.phoneInfo
                                        .e164Format || "N/A"
                                    }</div>
                                    <div class="label">National Format:</div>
                                    <div class="value">${
                                      results.truecallerData.data.phoneInfo
                                        .nationalFormat || "N/A"
                                    }</div>
                                    <div class="label">Number Type:</div>
                                    <div class="value">${
                                      results.truecallerData.data.phoneInfo
                                        .numberType || "N/A"
                                    }</div>
                                    <div class="label">Carrier:</div>
                                    <div class="value">${
                                      results.truecallerData.data.phoneInfo
                                        .carrier || "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
                        : ""
                    }
    
                                 <!-- Social Media Data -->
                    ${
                      results.socialMediaData
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <img src="https://www.facebook.com/favicon.ico" alt="Facebook">
                                <h2 class="card-title">Social Media Data</h2>
                            </div>
                            <div>
                              ${
                                results.socialMediaData.response?.fb
                                  ?.profile_picture_url
                                  ? `
                                    <img class="profile-image" style="width: 200px; height: 200px;" src="${results.socialMediaData.response.fb.profile_picture_url}" alt="Profile Picture">
                                `
                                  : ""
                              }
                            </div>
                            <div class="data-grid">
                                <div class="label">Name:</div>
                                <div class="value">${
                                  results.socialMediaData.response?.name ||
                                  "N/A"
                                }</div>
                                <div class="label">Facebook ID:</div>
                                <div class="value">${
                                  results.socialMediaData.response?.fb?.id ||
                                  "N/A"
                                }</div>
                                ${
                                  results.socialMediaData.response?.fb?.id
                                    ? `
                                    <div class="label">Profile URL:</div>
                                    <div class="value">
                                        <a href="${results.socialMediaData.response.fb.profile_url}" class="social-link" target="_blank">
                                            View Profile
                                        </a>
                                    </div>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    `
                        : ""
                    }
                        <!-- OSINT DATA -->
                        ${
                          results.osintData && results.osintData.length > 0
                            ? `
                              <div class="card">
                                <div class="card-header">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1055/1055329.png" alt="OSINT" width="40" height="40" />
                                  <h2 class="card-title">OSINT Results</h2>
                                </div>
                                ${results.osintData
                                  .map(
                                    (item) => `
                                      <div class="card-inner">
                                        <div class="data-grid">
                                          <div class="label">Name:</div>
                                          <div class="value">${
                                            item.name || "N/A"
                                          }</div>
                                          <div class="label">Email:</div>
                                          <div class="value">${
                                            item.email || "N/A"
                                          }</div>
                                          <div class="label">Phone:</div>
                                          <div class="value">${
                                            item.phone || "N/A"
                                          }</div>
                                          <div class="label">Source:</div>
                                          <div class="value">${
                                            item.source || "N/A"
                                          }</div>
                                        </div>
                                      </div>
                                    `
                                  )
                                  .join("")}
                              </div>
                            `
                            : ""
                        }
    
                    <!-- ALL MOBILE DATA -->
                    ${
                      results.allMobileData
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M15 5v14"></path>
                                    <path d="M5 21h14"></path>
                                    <path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2"></path>
                                    <path d="M9 7h1"></path>
                                    <path d="M9 11h1"></path>
                                    <path d="M9 15h1"></path>
                                </svg>
                                <h2 class="card-title">Alias</h2>
                            </div>
    
                            ${
                              results.allMobileData.truecaller
                                ? `
                                <div class="section-title">Truecaller Data</div>
                                <div class="data-grid">
                                    <div class="label">Country:</div>
                                    <div class="value">${
                                      results.allMobileData.truecaller
                                        .country || "N/A"
                                    }</div>
                                    <div class="label">Number:</div>
                                    <div class="value">${
                                      results.allMobileData.truecaller.number ||
                                      "N/A"
                                    }</div>
                                    <div class="label">Provider:</div>
                                    <div class="value">${
                                      results.allMobileData.truecaller
                                        .provider || "N/A"
                                    }</div>
                                    <div class="label">Number Type:</div>
                                    <div class="value">${
                                      results.allMobileData.truecaller
                                        .number_type_label || "N/A"
                                    }</div>
                                    <div class="label">Country Code:</div>
                                    <div class="value">${
                                      results.allMobileData.truecaller
                                        .country_code || "N/A"
                                    }</div>
                                    ${
                                      results.allMobileData.truecaller
                                        .time_zones
                                        ? `
                                        <div class="label">Time Zone:</div>
                                        <div class="value">${
                                          results.allMobileData.truecaller
                                            .time_zones[0] || "N/A"
                                        }</div>
                                    `
                                        : ""
                                    }
                                </div>
                            `
                                : ""
                            }
    
                            ${
                              results.allMobileData.callapp
                                ? `
                                <div class="section-title">CallApp Data</div>
                                <div class="data-grid">
                                    <div class="label">Name:</div>
                                    <div class="value">${
                                      results.allMobileData.callapp.name ||
                                      "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
    
                            ${
                              results.allMobileData.viewcaller?.[0]
                                ? `
                                <div class="section-title">ViewCaller Data</div>
                                <div class="data-grid">
                                    <div class="label">Name:</div>
                                    <div class="value">${
                                      results.allMobileData.viewcaller[0]
                                        .name || "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
    
                            ${
                              results.allMobileData.eyecon
                                ? `
                                <div class="section-title">Eyecon Data</div>
                                <div class="data-grid">
                                    <div class="label">Name:</div>
                                    <div class="value">${
                                      results.allMobileData.eyecon || "N/A"
                                    }</div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
                        : ""
                    }
                    <!-- Surepass KYC -->
                    ${
                      results.surepassKyc && results.surepassKyc.data
                        ? `
                        <div class="card">
                          <div class="card-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" x2="22" y1="12" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            <h2 class="card-title">KYC Data</h2>
                          </div>
                          <div class="data-grid">
                            <div class="label">Mobile:</div>
                            <div class="value">${
                              results.surepassKyc.data.mobile || "N/A"
                            }</div>
                          </div>
                          
                          <div class="data-grid">
                            ${Object.entries(
                              results.surepassKyc.data.details || {}
                            )
                              .filter(
                                ([, value]) =>
                                  value !== null &&
                                  value !== undefined &&
                                  value !== "" &&
                                  !(
                                    Array.isArray(value) && value.length === 0
                                  ) &&
                                  !(
                                    typeof value === "object" &&
                                    !Array.isArray(value) &&
                                    Object.keys(value).length === 0
                                  )
                              )
                              .map(
                                ([key, value]) => `
                                  <div class="label">${key.replace(
                                    /_/g,
                                    " "
                                  )}:</div>
                                  <div class="value">${
                                    Array.isArray(value)
                                      ? value
                                          .map((item) =>
                                            typeof item === "object"
                                              ? Object.entries(item)
                                                  .filter(
                                                    ([, v]) =>
                                                      v !== null &&
                                                      v !== undefined &&
                                                      v !== ""
                                                  )
                                                  .map(
                                                    ([k, v]) =>
                                                      `<span style="display:block;"><strong>${k.replace(
                                                        /_/g,
                                                        " "
                                                      )}:</strong> ${v}</span>`
                                                  )
                                                  .join("")
                                              : item
                                          )
                                          .join(
                                            "<hr style='border:0;border-top:1px solid #444;margin:4px 0;'>"
                                          )
                                      : typeof value === "object"
                                      ? Object.entries(value)
                                          .filter(
                                            ([, v]) =>
                                              v !== null &&
                                              v !== undefined &&
                                              v !== ""
                                          )
                                          .map(
                                            ([k, v]) =>
                                              `<span style="display:block;"><strong>${k.replace(
                                                /_/g,
                                                " "
                                              )}:</strong> ${v}</span>`
                                          )
                                          .join("")
                                      : value
                                  }</div>
                                `
                              )
                              .join("")}
                          </div>
                        </div>
                        `
                        : ""
                    }

                    <!-- Surepass UPI -->
                    ${
                      results.surepassUpi && results.surepassUpi.data
                        ? `
                        <div class="card">
                          <div class="card-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" x2="22" y1="12" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            <h2 class="card-title">UPI Data</h2>
                          </div>
                          <div class="data-grid">
                            ${Object.entries(results.surepassUpi.data)
                              .filter(
                                ([, value]) =>
                                  value !== null &&
                                  value !== undefined &&
                                  value !== "" &&
                                  !(
                                    Array.isArray(value) && value.length === 0
                                  ) &&
                                  !(
                                    typeof value === "object" &&
                                    !Array.isArray(value) &&
                                    Object.keys(value).length === 0
                                  )
                              )
                              .map(
                                ([key, value]) => `
                                  <div class="label">${key.replace(
                                    /_/g,
                                    " "
                                  )}:</div>
                                  <div class="value">${
                                    Array.isArray(value)
                                      ? value
                                          .map((item) =>
                                            typeof item === "object"
                                              ? Object.entries(item)
                                                  .filter(
                                                    ([, v]) =>
                                                      v !== null &&
                                                      v !== undefined &&
                                                      v !== ""
                                                  )
                                                  .map(
                                                    ([k, v]) =>
                                                      `<span style="display:block;"><strong>${k.replace(
                                                        /_/g,
                                                        " "
                                                      )}:</strong> ${v}</span>`
                                                  )
                                                  .join("")
                                              : item
                                          )
                                          .join(
                                            "<hr style='border:0;border-top:1px solid #444;margin:4px 0;'>"
                                          )
                                      : typeof value === "object"
                                      ? Object.entries(value)
                                          .filter(
                                            ([, v]) =>
                                              v !== null &&
                                              v !== undefined &&
                                              v !== ""
                                          )
                                          .map(
                                            ([k, v]) =>
                                              `<span style="display:block;"><strong>${k.replace(
                                                /_/g,
                                                " "
                                              )}:</strong> ${v}</span>`
                                          )
                                          .join("")
                                      : value
                                  }</div>
                                `
                              )
                              .join("")}
                          </div>
                        </div>
                        `
                        : ""
                    }
                    <!-- Surepass Bank -->
                    ${
                      results.surepassBank && results.surepassBank.data
                        ? `
                        <div class="card">
                          <div class="card-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" x2="22" y1="12" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            <h2 class="card-title"> Bank Data</h2>
                          </div>
                          <div class="data-grid">
                            ${Object.entries(results.surepassBank.data)
                              .filter(
                                ([key, value]) =>
                                  ![
                                    "message",
                                    "message_code",
                                    "status_code",
                                    "success",
                                  ].includes(key) &&
                                  value !== null &&
                                  value !== undefined &&
                                  value !== "" &&
                                  !(
                                    Array.isArray(value) && value.length === 0
                                  ) &&
                                  !(
                                    typeof value === "object" &&
                                    !Array.isArray(value) &&
                                    Object.keys(value).length === 0
                                  )
                              )
                              .map(
                                ([key, value]) => `
                                  <div class="label">${key.replace(
                                    /_/g,
                                    " "
                                  )}:</div>
                                  <div class="value">${
                                    Array.isArray(value)
                                      ? value
                                          .map((item) =>
                                            typeof item === "object"
                                              ? Object.entries(item)
                                                  .filter(
                                                    ([, v]) =>
                                                      v !== null &&
                                                      v !== undefined &&
                                                      v !== ""
                                                  )
                                                  .map(
                                                    ([k, v]) =>
                                                      `<span style="display:block;"><strong>${k.replace(
                                                        /_/g,
                                                        " "
                                                      )}:</strong> ${v}</span>`
                                                  )
                                                  .join("")
                                              : item
                                          )
                                          .join(
                                            "<hr style='border:0;border-top:1px solid #444;margin:4px 0;'>"
                                          )
                                      : typeof value === "object"
                                      ? Object.entries(value)
                                          .filter(
                                            ([, v]) =>
                                              v !== null &&
                                              v !== undefined &&
                                              v !== ""
                                          )
                                          .map(
                                            ([k, v]) =>
                                              `<span style="display:block;"><strong>${k.replace(
                                                /_/g,
                                                " "
                                              )}:</strong> ${v}</span>`
                                          )
                                          .join("")
                                      : value
                                  }</div>
                                `
                              )
                              .join("")}
                          </div>
                        </div>
                        `
                        : ""
                    }

                `
                    : `
                    <!-- Email Search Results -->
                    
                    <!-- Google Profile -->
                    ${
                      profile
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <img src="https://www.google.com/favicon.ico" alt="Google">
                                <h2 class="card-title">Google Profile</h2>
                            </div>
                            <div class="data-grid">
                                ${
                                  profile.profilePhotos?.PROFILE?.url
                                    ? `
                                    <img class="profile-image" src="${profile.profilePhotos.PROFILE.url}" alt="Profile Picture">
                                `
                                    : ""
                                }
                                <div class="label">Full Name:</div>
                                <div class="value">${
                                  profile.names?.PROFILE?.fullname || "N/A"
                                }</div>
                                <div class="label">Email:</div>
                                <div class="value">${
                                  profile.emails?.PROFILE?.value || "N/A"
                                }</div>
                                <div class="label">Gaia ID:</div>
                                <div class="value">${
                                  profile.personId || "N/A"
                                }</div>
                                ${
                                  profile.personId
                                    ? `
                                    <div class="label">Google Maps:</div>
                                    <div class="value">
                                        <a href="https://www.google.com/maps/contrib/${profile.personId}" class="social-link" target="_blank">
                                            View Location History
                                        </a>
                                    </div>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    `
                        : ""
                    }
    
                    <!-- Have I Been Pwned Results -->
                    ${
                      hibpResults && hibpResults.length > 0
                        ? `
                        <div class="card">
                            <div class="card-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blocks w-12 h-12"><rect width="7" height="7" x="14" y="3" rx="1"></rect><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path></svg>
                                <h2 class="card-title">Data Breaches</h2>
                            </div>
                            <div class="data-grid">
                                ${hibpResults
                                  .map(
                                    (breach) => `
                                    <div class="label">${breach.Name}:</div>
                                    <div class="value">
                                        <img src="${breach.LogoPath}" alt="${
                                      breach.Name
                                    }" style="width: 20px; height: 20px; margin-right: 10px;">
                                        Breached on ${new Date(
                                          breach.BreachDate
                                        ).toLocaleDateString()}
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }
    
                   
    
                    <!-- OSINT Results -->
                    ${
                      osintDataResults && osintDataResults.length > 0
                        ? `
                          <div class="card">
                            <div class="card-header">
                              <img src="https://cdn-icons-png.flaticon.com/512/1055/1055329.png" alt="OSINT" width="40" height="40" />
                              <h2 class="card-title">Other Results</h2>
                            </div>
                            ${osintDataResults
                              .map(
                                (item) => `
                                  <div class="card-inner">
                                    <div class="data-grid">
                                      <div class="label">Name:</div>
                                      <div class="value">${
                                        item.name || "N/A"
                                      }</div>
                                      <div class="label">Email:</div>
                                      <div class="value">${
                                        item.email || "N/A"
                                      }</div>
                                      <div class="label">Phone:</div>
                                      <div class="value">${
                                        item.phone || "N/A"
                                      }</div>
                                      <div class="label">Source:</div>
                                      <div class="value">${
                                        item.source || "N/A"
                                      }</div>
                                    </div>
                                  </div>
                                `
                              )
                              .join("")}
                          </div>
                        `
                        : ""
                    }
                   <!-- Gravatar Results -->
    ${
      zehefResults &&
      zehefResults.some(
        (item) => item.source === "Gravatar" && item.status === "found"
      )
        ? `
        <div class="card">
            <div class="card-header">
                <img src="https://gravatar.com/images/favicon-192x192.png" alt="Gravatar">
                <h2 class="card-title">Gravatar Profile</h2>
            </div>
            
                ${zehefResults
                  .filter(
                    (item) =>
                      item.source === "Gravatar" && item.status === "found"
                  )
                  .map(
                    (result) => `
            <div>
               ${
                 result.avatar_url
                   ? `
                            <img class="profile-image" src="${result.avatar_url}" alt="Gravatar Profile">
                        `
                   : ""
               }
            </div>
              <div class="data-grid">
                        
                        <div class="label">Username:</div>
                        <div class="value">${result.username || "N/A"}</div>
                        ${
                          result.profile_url
                            ? `
                            <div class="label">Profile URL:</div>
                            <div class="value">
                                <a href="${result.profile_url}" class="social-link" target="_blank">
                                    View Profile
                                </a>
                            </div>
                        `
                            : ""
                        }
                    `
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }
    
    <!-- Zehef Results -->
    ${
      zehefResults
        ? `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Social Media Presence</h2>
            </div>
            <div class="social-links">
                ${zehefResults
                  .filter(
                    (item) =>
                      item.status === "found" && item.source !== "Gravatar"
                  )
                  .map(
                    (item) => `
                        <a href="${item.profile_url}" class="social-link" target="_blank">
                            ${item.source}
                        </a>
                    `
                  )
                  .join("")}
            </div>
        </div>
    `
        : ""
    }
    `
                }
            </div>
        </body>
        </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-results-${userInput}-${new Date().toISOString()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div className="max-w-7xl w-full mx-auto -mt-2 sticky top-16 md:top-4 z-40 transition-all duration-300 ease-in-out hide-on-pdf">
        <div className="rounded-xl md:mx-24 text-white p-3 md:p-4 bg-teal-700 bg-opacity-30 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-medium truncate">
                  {userInput}
                </span>
                <button
                  className="text-[#ABDE64] hover:text-[#8200FF] transition-colors relative"
                  onClick={() => {
                    if (userInput) {
                      navigator.clipboard.writeText(userInput);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clipboard w-4 h-4 text-[#ABDE64]"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <div
                className="relative w-full sm:w-auto"
                data-headlessui-state=""
              >
                <button
                  className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm bg-white/10 backdrop-blur-lg w-full sm:w-auto"
                  id="headlessui-menu-button-:r2:"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-headlessui-state=""
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  title="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-file-down w-4 h-4 text-white"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M12 18v-6"></path>
                    <path d="m9 15 3 3 3-3"></path>
                  </svg>
                  <span>Save Results</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down w-3 h-3 text-white"
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>

                {/* Add dropdown menu */}

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A1F30] ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 backdrop-blur-lg transition-colors"
                        onClick={handleSaveResults}
                        role="menuitem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Save as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="text-[#060714] flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#ABDE64] transition-colors w-full sm:w-auto"
                onClick={onNewSearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search w-4 h-4 text-[#060714]"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                New Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultHeader;
