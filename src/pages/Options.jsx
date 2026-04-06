import { useEffect, useState } from "react";

const Options = ({ selectedCountryCode, setSelectedCountryCode }) => {
  const [countries, setCountries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Fallback data
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
      name: "Mexico",
      code: "+52",
      shortName: "MX",
      flag: "https://flagcdn.com/mx.svg",
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
      name: "Pakistan",
      code: "+92",
      shortName: "PK",
      flag: "https://flagcdn.com/pk.svg",
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
        country.code.includes(searchQuery)
    );

    // Return all countries if no matches found
    return filtered.length > 0 ? filtered : countries;
  };

  return (
    <div className="relative">
      <div
        className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-3 py-3 flex items-center gap-2 cursor-pointer hover:border-cyan-500/50 transition-all duration-200"
        onClick={toggleDropdown}
      >
        <img
          src={
            countries.find((country) => country.code === selectedCountryCode)
              ?.flag
          }
          alt="Selected Flag"
          className="w-6 h-6 rounded-sm"
        />
        <span className="text-cyan-400 font-medium">{selectedCountryCode}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl w-80 mt-2 shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search country or code..."
              className="flex-1 px-3 py-2 text-white bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {getFilteredCountries().map((country) => (
              <div
                key={country.shortName}
                className="flex items-center p-3 hover:bg-slate-800/50 cursor-pointer transition-colors duration-150"
                onClick={() => handleCountrySelect(country.code)}
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-6 h-6 mr-3 rounded-sm"
                />
                <span className="text-slate-300 text-sm">
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
