import React from "react";

const PlanTable = ({ plans, onSelect }) => {
  return (
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
              <tr
                key={plan.name}
                title={onSelect ? "Click to subscribe" : ""}
                onClick={onSelect ? () => onSelect(plan) : undefined}
                className={`${
                  onSelect ? "cursor-pointer hover:bg-gray-800" : ""
                } transition-all`}
              >
                <td className="px-4 py-3 lg:py-6 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${plan.color}`} />
                  <span className="font-semibold text-white">{plan.name}</span>
                </td>
                <td className="px-4 py-3 lg:py-6 text-gray-300">
                  {plan.duration}
                </td>
                <td className="px-4 py-3 lg:py-6 text-gray-300">
                  {plan.price}
                </td>
                <td className="px-4 py-3 lg:py-6 text-gray-300">
                  {plan.searches}
                </td>
                <td className="px-4 py-3 lg:py-6 text-gray-300">
                  {plan.costPerSearch}
                </td>
                <td className="px-4 py-3 lg:py-6 text-gray-300">
                  {plan.bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-4 mt-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            onClick={onSelect ? () => onSelect(plan) : undefined}
            className={`bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 ${
              onSelect ? "cursor-pointer hover:bg-gray-700" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${plan.color}`} />
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
  );
};

export default PlanTable;
