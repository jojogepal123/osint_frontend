
const PlanTable = ({ plans, onSelect }) => {
  return (
    <div className="w-full max-w-6xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="text-slate-200">Final OSINT Subscription Plans</span>
        <span className="text-cyan-400 font-normal">(Search-Based)</span>
      </h2>

      {/* Desktop Table View */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl hidden md:block">
        <table className="min-w-full table-auto divide-y divide-slate-700/50">
          <thead className="bg-slate-800/80">
            <tr className="text-left text-md font-medium text-cyan-400">
              <th className="px-4 py-4 lg:py-5">Plan Name</th>
              <th className="px-4 py-4 lg:py-5">Duration</th>
              <th className="px-4 py-4 lg:py-5">Price (INR)</th>
              <th className="px-4 py-4 lg:py-5">Included Searches</th>
              <th className="px-4 py-4 lg:py-5">Effective Cost/Search</th>
              <th className="px-4 py-4 lg:py-5">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30 text-sm">
            {plans.map((plan) => (
              <tr
                key={plan.name}
                title={onSelect ? "Click to subscribe" : ""}
                onClick={onSelect ? () => onSelect(plan) : undefined}
                tabIndex={onSelect ? 0 : undefined}
                role={onSelect ? "button" : undefined}
                onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(plan); } } : undefined}
                className={`${
                  onSelect ? "cursor-pointer hover:bg-slate-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" : ""
                } transition-all duration-300`}
              >
                <td className="px-4 py-4 lg:py-5 flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <span className="font-semibold text-slate-200">{plan.name}</span>
                </td>
                <td className="px-4 py-4 lg:py-5 text-slate-400">
                  {plan.duration}
                </td>
                <td className="px-4 py-4 lg:py-5 text-emerald-400 font-medium">
                  {plan.price}
                </td>
                <td className="px-4 py-4 lg:py-5 text-slate-400">
                  {plan.searches}
                </td>
                <td className="px-4 py-4 lg:py-5 text-slate-400">
                  {plan.costPerSearch}
                </td>
                <td className="px-4 py-4 lg:py-5 text-slate-400">
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
            tabIndex={onSelect ? 0 : undefined}
            role={onSelect ? "button" : undefined}
            onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(plan); } } : undefined}
            className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-slate-700/50 hover:border-cyan-500/30 ${
              onSelect ? "cursor-pointer hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" : ""
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-3 h-3 rounded-full ${plan.color}`} />
              <h3 className="text-lg font-semibold text-slate-200">{plan.name}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-1">
              <strong className="text-slate-300">Duration:</strong> {plan.duration}
            </p>
            <p className="text-slate-400 text-sm mb-1">
              <strong className="text-slate-300">Price:</strong> <span className="text-emerald-400 font-medium">{plan.price}</span>
            </p>
            <p className="text-slate-400 text-sm mb-1">
              <strong className="text-slate-300">Searches:</strong> {plan.searches}
            </p>
            <p className="text-slate-400 text-sm mb-1">
              <strong className="text-slate-300">Cost/Search:</strong> {plan.costPerSearch}
            </p>
            <p className="text-slate-400 text-sm">
              <strong className="text-slate-300">Best For:</strong> {plan.bestFor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTable;
