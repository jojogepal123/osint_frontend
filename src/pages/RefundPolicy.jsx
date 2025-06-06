import React from "react";

const RefundPolicy = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gray-100">
      <div className="w-full md:max-w-[80%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto bg-gray-700 bg-opacity-30 backdrop-blur-sm p-8 rounded-md shadow-2xl">
        <div className="w-full h-full flex flex-col justify-start items-start space-y-4 animate-slide-up text-white">
          <h1 className="text-3xl font-bold mb-2 text-[#9acc14]">
            Refund & Cancellation Policy
          </h1>

          <p>
            This refund and cancellation policy outlines how you can cancel or
            seek a refund for a product/service that you have purchased through
            the Platform.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Cancellations will only be considered if the request is made
              within 5 days of placing the order. However, cancellation requests
              may not be entertained if the orders have been communicated to
              such sellers/merchant(s) listed on the Platform and they have
              initiated the process of shipping them, or the product is out for
              delivery. In such an event, you may choose to reject the product
              at the doorstep.
            </li>
            <li>
              REDOASISS LLP does not accept cancellation requests for perishable
              items like flowers, eatables, etc. However, a refund/replacement
              can be made if the user establishes that the quality of the
              product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report to
              our customer service team. The request would be entertained once
              the seller/merchant listed on the Platform has checked and
              determined the same at its own end. This should be reported within
              5 days of receipt of the product.
            </li>
            <li>
              In case you feel that the product received is not as shown on the
              site or as per your expectations, you must bring it to the notice
              of our customer service within 5 days of receiving the product.
              The customer service team, after looking into your complaint, will
              take an appropriate decision.
            </li>
            <li>
              In case of complaints regarding products that come with a warranty
              from the manufacturers, please refer the issue to them directly.
            </li>
            <li>
              In case of any refunds approved by REDOASISS LLP, it will take 6
              days for the refund to be processed to you.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
