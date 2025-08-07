import React, { useState } from "react";
import instance from "../api/axios";
import { toast } from "react-toastify";

const CreditReportModal = ({ open, onClose, pan, name, mobile, onSuccess }) => {
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gender) {
      alert("Please select gender.");
      return;
    }

    const payload = {
      type: "credit_report",
      data: {
        pan,
        name,
        mobile,
        gender,
        consent: "Y",
      },
    };

    setLoading(true);
    try {
      const response = await instance.post(
        "/api/corporate-intelligence",
        payload,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `credit_report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
      if (onSuccess) onSuccess();
      onClose();
      setLoading(false);
      return;
    } catch (error) {
      toast.error("Error occurred. Please check your data and try again.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };
  // const handleNewSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!gender) {
  //     alert("Please select gender.");
  //     return;
  //   }
  //   setLoading(true);
  //   console.log({
  //     pan,
  //     name,
  //     mobile,
  //     gender,
  //     consent: "Y",
  //   });
  //   try {
  //     const response = await instance.post(
  //       "/api/generate-credit-report",
  //       {
  //         data: {
  //           pan,
  //           name,
  //           mobile,
  //           gender,
  //           consent: "Y",
  //         },
  //         type: "credit_report",
  //       },
  //       {
  //         responseType: "blob", // Expect binary PDF file
  //       }
  //     );

  //     // Create a blob from the PDF
  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);

  //     // Create download link
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "credit-report.pdf");
  //     document.body.appendChild(link);
  //     link.click();

  //     // Clean up
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //     toast.success("Credit report generated successfully!");
  //     if (onSuccess) onSuccess();
  //     onClose();
  //   } catch (error) {
  //     toast.error("Failed to generate credit report.");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-lime-400 rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">
          Credit Report Request
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-black">
            MOBILE
            <input
              type="text"
              value={mobile}
              readOnly
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="font-semibold text-black">
            PAN
            <input
              type="text"
              value={pan}
              readOnly
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="font-semibold text-black">
            NAME
            <input
              type="text"
              value={name}
              readOnly
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <div>
            <span className="font-semibold text-black">GENDER</span>
            <div className="flex gap-4 mt-1">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />{" "}
                Female
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked readOnly />
            <span className="text-black">
              By clicking the checkbox, I consent to the fetching of my credit
              report data.
            </span>
          </label>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-black text-white rounded font-bold"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Credit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditReportModal;
