import React from "react";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PlanTable from "../components/PlanTable";
import instance from "../api/axios"; // Make sure this is your Axios instance

const plans = [
  {
    name: "Starter",
    color: "bg-blue-400",
    duration: "1 Month",
    price: "₹399",
    amount: 399,
    searches: 400,
    costPerSearch: "₹0.99 / search",
    bestFor: "New users, basic investigations",
  },
  {
    name: "Standard",
    color: "bg-orange-400",
    duration: "3 Months",
    price: "₹999",
    amount: 999,
    searches: 1200,
    costPerSearch: "₹0.83 / search",
    bestFor: "Freelancers, regular lookup needs",
  },
  {
    name: "Pro",
    color: "bg-yellow-400",
    duration: "6 Months",
    price: "₹1,799",
    amount: 1799,
    searches: 2500,
    costPerSearch: "₹0.72 / search",
    bestFor: "Analysts, cybersec professionals",
  },
  {
    name: "Elite",
    color: "bg-red-500",
    duration: "12 Months",
    price: "₹3,299",
    amount: 3299,
    searches: 5000,
    costPerSearch: "₹0.66 / search",
    bestFor: "Law enforcement, enterprise teams",
  },
];

const Subscription = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handlePayment = async (plan) => {
    try {
      const res = await instance.post("/api/create-cashfree-order", {
        amount: plan.amount,
        plan: plan.name,
      });

      const sessionId = res.data.payment_session_id;

      if (!sessionId) {
        alert("Failed to get session ID");
        return;
      }

      const cashfree = new window.Cashfree();
      cashfree.checkout({
        paymentSessionId: sessionId,
        returnUrl: `${window.location.origin}/payment-success?order_id={order_id}`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed");
    }
  };

  return (
    <>
      {user && (
        <div className="z-10 text-white min-h-screen flex flex-col items-center justify-center p-6">
          <PlanTable plans={plans} onSelect={handlePayment} />

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
