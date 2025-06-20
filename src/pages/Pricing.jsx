import React from "react";
import PlanTable from "../components/PlanTable";
import Footer from "../components/Footer";

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

const Pricing = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-blur px-4 py-10 text-white z-10">
        <PlanTable plans={plans} />
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
