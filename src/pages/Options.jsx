import React, { useEffect, useState } from "react";

const Options = ({ selectedCountryCode, setSelectedCountryCode }) => {
  const [countries, setCountries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Fallback data
  // const countriesFallback = [
  //   {
  //     name: "Afghanistan",
  //     code: "+93",
  //     shortName: "AF",
  //     flag: "https://flagcdn.com/af.svg",
  //   },
  //   {
  //     name: "Albania",
  //     code: "+355",
  //     shortName: "AL",
  //     flag: "https://flagcdn.com/al.svg",
  //   },
  //   {
  //     name: "Algeria",
  //     code: "+213",
  //     shortName: "DZ",
  //     flag: "https://flagcdn.com/dz.svg",
  //   },
  //   {
  //     name: "Andorra",
  //     code: "+376",
  //     shortName: "AD",
  //     flag: "https://flagcdn.com/ad.svg",
  //   },
  //   {
  //     name: "Angola",
  //     code: "+244",
  //     shortName: "AO",
  //     flag: "https://flagcdn.com/ao.svg",
  //   },
  //   {
  //     name: "Argentina",
  //     code: "+54",
  //     shortName: "AR",
  //     flag: "https://flagcdn.com/ar.svg",
  //   },
  //   {
  //     name: "Australia",
  //     code: "+61",
  //     shortName: "AU",
  //     flag: "https://flagcdn.com/au.svg",
  //   },
  //   {
  //     name: "Austria",
  //     code: "+43",
  //     shortName: "AT",
  //     flag: "https://flagcdn.com/at.svg",
  //   },
  //   {
  //     name: "Bahamas",
  //     code: "+1-242",
  //     shortName: "BS",
  //     flag: "https://flagcdn.com/bs.svg",
  //   },
  //   {
  //     name: "Bahrain",
  //     code: "+973",
  //     shortName: "BH",
  //     flag: "https://flagcdn.com/bh.svg",
  //   },
  //   {
  //     name: "Bangladesh",
  //     code: "+880",
  //     shortName: "BD",
  //     flag: "https://flagcdn.com/bd.svg",
  //   },
  //   {
  //     name: "Belarus",
  //     code: "+375",
  //     shortName: "BY",
  //     flag: "https://flagcdn.com/by.svg",
  //   },
  //   {
  //     name: "Belgium",
  //     code: "+32",
  //     shortName: "BE",
  //     flag: "https://flagcdn.com/be.svg",
  //   },
  //   {
  //     name: "Bhutan",
  //     code: "+975",
  //     shortName: "BT",
  //     flag: "https://flagcdn.com/bt.svg",
  //   },
  //   {
  //     name: "Bolivia",
  //     code: "+591",
  //     shortName: "BO",
  //     flag: "https://flagcdn.com/bo.svg",
  //   },
  //   {
  //     name: "Brazil",
  //     code: "+55",
  //     shortName: "BR",
  //     flag: "https://flagcdn.com/br.svg",
  //   },
  //   {
  //     name: "Canada",
  //     code: "+1",
  //     shortName: "CA",
  //     flag: "https://flagcdn.com/ca.svg",
  //   },
  //   {
  //     name: "China",
  //     code: "+86",
  //     shortName: "CN",
  //     flag: "https://flagcdn.com/cn.svg",
  //   },
  //   {
  //     name: "Denmark",
  //     code: "+45",
  //     shortName: "DK",
  //     flag: "https://flagcdn.com/dk.svg",
  //   },
  //   {
  //     name: "Egypt",
  //     code: "+20",
  //     shortName: "EG",
  //     flag: "https://flagcdn.com/eg.svg",
  //   },
  //   {
  //     name: "Finland",
  //     code: "+358",
  //     shortName: "FI",
  //     flag: "https://flagcdn.com/fi.svg",
  //   },
  //   {
  //     name: "France",
  //     code: "+33",
  //     shortName: "FR",
  //     flag: "https://flagcdn.com/fr.svg",
  //   },
  //   {
  //     name: "Germany",
  //     code: "+49",
  //     shortName: "DE",
  //     flag: "https://flagcdn.com/de.svg",
  //   },
  //   {
  //     name: "India",
  //     code: "+91",
  //     shortName: "IN",
  //     flag: "https://flagcdn.com/in.svg",
  //   },
  //   {
  //     name: "Indonesia",
  //     code: "+62",
  //     shortName: "ID",
  //     flag: "https://flagcdn.com/id.svg",
  //   },
  //   {
  //     name: "Italy",
  //     code: "+39",
  //     shortName: "IT",
  //     flag: "https://flagcdn.com/it.svg",
  //   },
  //   {
  //     name: "Japan",
  //     code: "+81",
  //     shortName: "JP",
  //     flag: "https://flagcdn.com/jp.svg",
  //   },
  //   {
  //     name: "Mexico",
  //     code: "+52",
  //     shortName: "MX",
  //     flag: "https://flagcdn.com/mx.svg",
  //   },
  //   {
  //     name: "Netherlands",
  //     code: "+31",
  //     shortName: "NL",
  //     flag: "https://flagcdn.com/nl.svg",
  //   },
  //   {
  //     name: "New Zealand",
  //     code: "+64",
  //     shortName: "NZ",
  //     flag: "https://flagcdn.com/nz.svg",
  //   },
  //   {
  //     name: "Pakistan",
  //     code: "+92",
  //     shortName: "PK",
  //     flag: "https://flagcdn.com/pk.svg",
  //   },
  //   {
  //     name: "Russia",
  //     code: "+7",
  //     shortName: "RU",
  //     flag: "https://flagcdn.com/ru.svg",
  //   },
  //   {
  //     name: "Saudi Arabia",
  //     code: "+966",
  //     shortName: "SA",
  //     flag: "https://flagcdn.com/sa.svg",
  //   },
  //   {
  //     name: "South Africa",
  //     code: "+27",
  //     shortName: "ZA",
  //     flag: "https://flagcdn.com/za.svg",
  //   },
  //   {
  //     name: "South Korea",
  //     code: "+82",
  //     shortName: "KR",
  //     flag: "https://flagcdn.com/kr.svg",
  //   },
  //   {
  //     name: "Spain",
  //     code: "+34",
  //     shortName: "ES",
  //     flag: "https://flagcdn.com/es.svg",
  //   },
  //   {
  //     name: "United Kingdom",
  //     code: "+44",
  //     shortName: "GB",
  //     flag: "https://flagcdn.com/gb.svg",
  //   },
  //   {
  //     name: "United States",
  //     code: "+1",
  //     shortName: "US",
  //     flag: "https://flagcdn.com/us.svg",
  //   },
  // ];
  const countriesFallback = [
    {
      name: "Afghanistan",
      code: "+93",
      shortName: "AF",
      flag: "https://flagcdn.com/af.svg",
    },
    {
      name: "Albania",
      code: "+355",
      shortName: "AL",
      flag: "https://flagcdn.com/al.svg",
    },
    {
      name: "Algeria",
      code: "+213",
      shortName: "DZ",
      flag: "https://flagcdn.com/dz.svg",
    },
    {
      name: "Andorra",
      code: "+376",
      shortName: "AD",
      flag: "https://flagcdn.com/ad.svg",
    },
    {
      name: "Angola",
      code: "+244",
      shortName: "AO",
      flag: "https://flagcdn.com/ao.svg",
    },
    {
      name: "Argentina",
      code: "+54",
      shortName: "AR",
      flag: "https://flagcdn.com/ar.svg",
    },
    {
      name: "Australia",
      code: "+61",
      shortName: "AU",
      flag: "https://flagcdn.com/au.svg",
    },
    {
      name: "Austria",
      code: "+43",
      shortName: "AT",
      flag: "https://flagcdn.com/at.svg",
    },
    {
      name: "Bahamas",
      code: "+1-242",
      shortName: "BS",
      flag: "https://flagcdn.com/bs.svg",
    },
    {
      name: "Bahrain",
      code: "+973",
      shortName: "BH",
      flag: "https://flagcdn.com/bh.svg",
    },
    {
      name: "Bangladesh",
      code: "+880",
      shortName: "BD",
      flag: "https://flagcdn.com/bd.svg",
    },
    {
      name: "Belarus",
      code: "+375",
      shortName: "BY",
      flag: "https://flagcdn.com/by.svg",
    },
    {
      name: "Belgium",
      code: "+32",
      shortName: "BE",
      flag: "https://flagcdn.com/be.svg",
    },
    {
      name: "Bhutan",
      code: "+975",
      shortName: "BT",
      flag: "https://flagcdn.com/bt.svg",
    },
    {
      name: "Bolivia",
      code: "+591",
      shortName: "BO",
      flag: "https://flagcdn.com/bo.svg",
    },
    {
      name: "Brazil",
      code: "+55",
      shortName: "BR",
      flag: "https://flagcdn.com/br.svg",
    },
    {
      name: "Cambodia",
      code: "+855",
      shortName: "KH",
      flag: "https://flagcdn.com/kh.svg",
    },
    {
      name: "Canada",
      code: "+1",
      shortName: "CA",
      flag: "https://flagcdn.com/ca.svg",
    },
    {
      name: "China",
      code: "+86",
      shortName: "CN",
      flag: "https://flagcdn.com/cn.svg",
    },
    {
      name: "Denmark",
      code: "+45",
      shortName: "DK",
      flag: "https://flagcdn.com/dk.svg",
    },
    {
      name: "Egypt",
      code: "+20",
      shortName: "EG",
      flag: "https://flagcdn.com/eg.svg",
    },
    {
      name: "Finland",
      code: "+358",
      shortName: "FI",
      flag: "https://flagcdn.com/fi.svg",
    },
    {
      name: "France",
      code: "+33",
      shortName: "FR",
      flag: "https://flagcdn.com/fr.svg",
    },
    {
      name: "Germany",
      code: "+49",
      shortName: "DE",
      flag: "https://flagcdn.com/de.svg",
    },
    {
      name: "Greece",
      code: "+30",
      shortName: "GR",
      flag: "https://flagcdn.com/gr.svg",
    },
    {
      name: "Hong Kong",
      code: "+852",
      shortName: "HK",
      flag: "https://flagcdn.com/hk.svg",
    },
    {
      name: "India",
      code: "+91",
      shortName: "IN",
      flag: "https://flagcdn.com/in.svg",
    },
    {
      name: "Indonesia",
      code: "+62",
      shortName: "ID",
      flag: "https://flagcdn.com/id.svg",
    },
    {
      name: "Ireland",
      code: "+353",
      shortName: "IE",
      flag: "https://flagcdn.com/ie.svg",
    },
    {
      name: "Italy",
      code: "+39",
      shortName: "IT",
      flag: "https://flagcdn.com/it.svg",
    },
    {
      name: "Japan",
      code: "+81",
      shortName: "JP",
      flag: "https://flagcdn.com/jp.svg",
    },
    {
      name: "Kenya",
      code: "+254",
      shortName: "KE",
      flag: "https://flagcdn.com/ke.svg",
    },
    {
      name: "Kuwait",
      code: "+965",
      shortName: "KW",
      flag: "https://flagcdn.com/kw.svg",
    },
    {
      name: "Laos",
      code: "+856",
      shortName: "LA",
      flag: "https://flagcdn.com/la.svg",
    },
    {
      name: "Malaysia",
      code: "+60",
      shortName: "MY",
      flag: "https://flagcdn.com/my.svg",
    },
    {
      name: "Mexico",
      code: "+52",
      shortName: "MX",
      flag: "https://flagcdn.com/mx.svg",
    },
    {
      name: "Myanmar",
      code: "+95",
      shortName: "MM",
      flag: "https://flagcdn.com/mm.svg",
    },
    {
      name: "Nepal",
      code: "+977",
      shortName: "NP",
      flag: "https://flagcdn.com/np.svg",
    },
    {
      name: "Netherlands",
      code: "+31",
      shortName: "NL",
      flag: "https://flagcdn.com/nl.svg",
    },
    {
      name: "New Zealand",
      code: "+64",
      shortName: "NZ",
      flag: "https://flagcdn.com/nz.svg",
    },
    {
      name: "Nigeria",
      code: "+234",
      shortName: "NG",
      flag: "https://flagcdn.com/ng.svg",
    },
    {
      name: "Norway",
      code: "+47",
      shortName: "NO",
      flag: "https://flagcdn.com/no.svg",
    },
    {
      name: "Oman",
      code: "+968",
      shortName: "OM",
      flag: "https://flagcdn.com/om.svg",
    },
    {
      name: "Pakistan",
      code: "+92",
      shortName: "PK",
      flag: "https://flagcdn.com/pk.svg",
    },
    {
      name: "Philippines",
      code: "+63",
      shortName: "PH",
      flag: "https://flagcdn.com/ph.svg",
    },
    {
      name: "Poland",
      code: "+48",
      shortName: "PL",
      flag: "https://flagcdn.com/pl.svg",
    },
    {
      name: "Portugal",
      code: "+351",
      shortName: "PT",
      flag: "https://flagcdn.com/pt.svg",
    },
    {
      name: "Qatar",
      code: "+974",
      shortName: "QA",
      flag: "https://flagcdn.com/qa.svg",
    },
    {
      name: "Russia",
      code: "+7",
      shortName: "RU",
      flag: "https://flagcdn.com/ru.svg",
    },
    {
      name: "Saudi Arabia",
      code: "+966",
      shortName: "SA",
      flag: "https://flagcdn.com/sa.svg",
    },
    {
      name: "Singapore",
      code: "+65",
      shortName: "SG",
      flag: "https://flagcdn.com/sg.svg",
    },
    {
      name: "South Africa",
      code: "+27",
      shortName: "ZA",
      flag: "https://flagcdn.com/za.svg",
    },
    {
      name: "South Korea",
      code: "+82",
      shortName: "KR",
      flag: "https://flagcdn.com/kr.svg",
    },
    {
      name: "Spain",
      code: "+34",
      shortName: "ES",
      flag: "https://flagcdn.com/es.svg",
    },
    {
      name: "Sri Lanka",
      code: "+94",
      shortName: "LK",
      flag: "https://flagcdn.com/lk.svg",
    },
    {
      name: "Sweden",
      code: "+46",
      shortName: "SE",
      flag: "https://flagcdn.com/se.svg",
    },
    {
      name: "Switzerland",
      code: "+41",
      shortName: "CH",
      flag: "https://flagcdn.com/ch.svg",
    },
    {
      name: "Taiwan",
      code: "+886",
      shortName: "TW",
      flag: "https://flagcdn.com/tw.svg",
    },
    {
      name: "Thailand",
      code: "+66",
      shortName: "TH",
      flag: "https://flagcdn.com/th.svg",
    },
    {
      name: "Turkey",
      code: "+90",
      shortName: "TR",
      flag: "https://flagcdn.com/tr.svg",
    },
    {
      name: "Ukraine",
      code: "+380",
      shortName: "UA",
      flag: "https://flagcdn.com/ua.svg",
    },
    {
      name: "United Arab Emirates",
      code: "+971",
      shortName: "AE",
      flag: "https://flagcdn.com/ae.svg",
    },
    {
      name: "United Kingdom",
      code: "+44",
      shortName: "GB",
      flag: "https://flagcdn.com/gb.svg",
    },
    {
      name: "United States",
      code: "+1",
      shortName: "US",
      flag: "https://flagcdn.com/us.svg",
    },
    {
      name: "Vietnam",
      code: "+84",
      shortName: "VN",
      flag: "https://flagcdn.com/vn.svg",
    },
  ];
  // Fetch country data
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const response = await fetch("https://restcountries.com/v3.1/all", {
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       if (!response.ok) throw new Error("Network response not ok");
  //       const data = await response.json();
  //       const countryList = data.map((country) => ({
  //         name: country.name.common,
  //         code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
  //         shortName: country.cca2,
  //         flag: country.flags.svg || country.flags.png,
  //       }));
  //       setCountries(countryList);
  //       const india = countryList.find((country) => country.name === "India");
  //       setSelectedCountryCode(india ? india.code : "+91");
  //     } catch (error) {
  //       console.error("Failed to fetch countries, using fallback:", error);
  //       setCountries(countriesFallback);
  //     }
  //   };

  //   fetchCountries();
  // }, [setSelectedCountryCode]);
  useEffect(() => {
    setCountries(countriesFallback);
    const india = countriesFallback.find((country) => country.name === "India");
    setSelectedCountryCode(india ? india.code : "+91");
  }, [setSelectedCountryCode]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    if (!isDropdownOpen) {
      setSearchQuery(""); // Reset search when opening dropdown
    }
  };

  const handleCountrySelect = (code) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  const getFilteredCountries = () => {
    const filtered = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.includes(searchQuery),
    );

    // Return all countries if no matches found
    return filtered.length > 0 ? filtered : countries;
  };

  return (
    <div className="relative">
      <div
        className="bg-gray-800 border border-lime-200 text-white rounded-md px-4 py-3 flex items-center justify-between cursor-pointer focus:ring-lime-200"
        onClick={toggleDropdown}
      >
        <span className="text-lime-200">{selectedCountryCode}</span>
        <img
          src={
            countries.find((country) => country.code === selectedCountryCode)
              ?.flag
          }
          alt="Selected Flag"
          className="w-6 h-6 ml-2 hidden md:block"
        />
      </div>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 bg-gray-800 border text-white border-lime-200 rounded-md w-80 mt-2">
          <div className="p-2 border-b border-gray-700 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search country or code..."
              className="flex-1 px-3 py-2 text-lime-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="p-2 text-lime-200 hover:bg-gray-700 rounded-md"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto custom-scrollbar">
            {getFilteredCountries().map((country, index) => (
              <div
                key={index}
                className="flex items-center p-2 text-lime-200 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleCountrySelect(country.code)}
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-6 h-6 mr-2"
                />
                <span>
                  {country.name} ({country.code})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
