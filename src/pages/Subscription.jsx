import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    color: "bg-blue-400",
    duration: "1 Month",
    price: "₹399",
    searches: 400,
    costPerSearch: "₹0.99 / search",
    bestFor: "New users, basic investigations",
  },
  {
    name: "Standard",
    color: "bg-orange-400",
    duration: "3 Months",
    price: "₹999",
    searches: 1200,
    costPerSearch: "₹0.83 / search",
    bestFor: "Freelancers, regular lookup needs",
  },
  {
    name: "Pro",
    color: "bg-yellow-400",
    duration: "6 Months",
    price: "₹1,799",
    searches: 2500,
    costPerSearch: "₹0.72 / search",
    bestFor: "Analysts, cybersec professionals",
  },
  {
    name: "Elite",
    color: "bg-red-500",
    duration: "12 Months",
    price: "₹3,299",
    searches: 5000,
    costPerSearch: "₹0.66 / search",
    bestFor: "Law enforcement, enterprise teams",
  },
];

const Subscription = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <div className="z-10 text-white min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-pink-400 text-lg">🔎</span>
              Final OSINT Subscription Plans (Search-Based)
            </h2>

            {/* Desktop Table View */}
            <div className="overflow-x-auto rounded-lg border border-gray-700 hidden md:block">
              <table className="min-w-full table-auto divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr className="text-left text-md font-medium text-gray-300">
                    <th className="px-4 py-3 lg:py-6">Plan Name</th>
                    <th className="px-4 py-3 lg:py-6">Duration</th>
                    <th className="px-4 py-3 lg:py-6">Price (INR)</th>
                    <th className="px-4 py-3 lg:py-6">Included Searches</th>
                    <th className="px-4 py-3 lg:py-6">Effective Cost/Search</th>
                    <th className="px-4 py-3 lg:py-6">Best For</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800 text-sm">
                  {plans.map((plan) => (
                    <tr key={plan.name}>
                      <td className="px-4 py-3 lg:py-6 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${plan.color}`}></span>
                        <span className="font-semibold text-white">{plan.name}</span>
                      </td>
                      <td className="px-4 py-3 lg:py-6 text-gray-300">{plan.duration}</td>
                      <td className="px-4 py-3 lg:py-6 text-gray-300">{plan.price}</td>
                      <td className="px-4 py-3 lg:py-6 text-gray-300">{plan.searches}</td>
                      <td className="px-4 py-3 lg:py-6 text-gray-300">{plan.costPerSearch}</td>
                      <td className="px-4 py-3 lg:py-6 text-gray-300">{plan.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4 mt-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${plan.color}`}></span>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Duration:</strong> {plan.duration}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Price:</strong> {plan.price}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Searches:</strong> {plan.searches}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Cost/Search:</strong> {plan.costPerSearch}
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Best For:</strong> {plan.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button type="button" onClick={() => navigate("/dashboard")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-12 fill-lime-400"
              >
                <g clipPath="url(#a)">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h20v20H0z" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
