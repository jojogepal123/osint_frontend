import React from "react";
import Footer from "../components/Footer";

const ShippingPolicy = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gray-100">
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto bg-gray-700 bg-opacity-30 backdrop-blur-sm p-8 rounded-md shadow-2xl">
          <div className="w-full h-full flex flex-col justify-start items-start space-y-4 animate-slide-up text-white">
            <h1 className="text-3xl text-[#9acc14] font-bold mb-2">
              Shipping Policy
            </h1>

            <p>
              The orders for the user are shipped through registered domestic
              courier companies and/or speed post only. Orders are shipped
              within 6 days from the date of the order and/or payment or as per
              the delivery date agreed at the time of order confirmation and
              delivering of the shipment, subject to courier company / post
              office norms.
            </p>

            <p>
              The Platform Owner shall not be liable for any delay in delivery
              by the courier company or postal authority. Delivery of all orders
              will be made to the address provided by the buyer at the time of
              purchase.
            </p>

            <p>
              Delivery of our services will be confirmed on your email ID as
              specified at the time of registration.
            </p>

            <p>
              If there are any shipping cost(s) levied by the seller or the
              Platform Owner (as the case may be), the same is not refundable.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
