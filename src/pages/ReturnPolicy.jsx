import React from "react";
import Footer from "../components/Footer";

const ReturnPolicy = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gray-100">
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto bg-gray-700 bg-opacity-30 backdrop-blur-sm p-8 rounded-md shadow-2xl">
          <div className="w-full h-full flex flex-col justify-start items-start space-y-4 animate-slide-up text-white">
            <h1 className="text-3xl font-bold mb-2 text-[#9acc14]">
              Return Policy
            </h1>

            <p>
              We offer refund / exchange within the first{" "}
              <strong>5 days</strong> from the date of your purchase. If 5 days
              have passed since your purchase, you will not be offered a return,
              exchange or refund of any kind.
            </p>

            <div>
              <p>In order to become eligible for a return or an exchange:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  The purchased item should be unused and in the same condition
                  as you received it.
                </li>
                <li>The item must have original packaging.</li>
                <li>
                  If the item was purchased on sale, it may not be eligible for
                  a return or exchange.
                </li>
              </ul>
            </div>

            <p>
              Further, only such items are replaced by us (based on an exchange
              request), if they are found to be defective or damaged.
            </p>

            <p>
              You agree that there may be certain categories of products/items
              that are exempt from returns or refunds. These categories will be
              identified to you at the time of purchase.
            </p>

            <p>
              For accepted exchange/return requests (as applicable), once your
              returned product/item is received and inspected by us, we will
              send you an email to notify you of the receipt.
            </p>

            <p>
              If the return has been approved after our quality check, your
              request (i.e. return/exchange) will be processed in accordance
              with our policies.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnPolicy;
