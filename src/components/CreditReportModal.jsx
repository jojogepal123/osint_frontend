import { useState } from "react";
import instance from "../api/axios";
import { useAlert } from "./Alert";
import { X, FileText, Download, CheckCircle } from "lucide-react";
import InlineLoader from "./InlineLoader";

const CreditReportModal = ({ open, onClose, pan, name, mobile, onSuccess }) => {
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const showAlert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gender) {
      showAlert.error("Please select gender.");
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
      showAlert.success("Report downloaded successfully");
      if (onSuccess) onSuccess();
      onClose();
      return;
    } catch (error) {
      showAlert.error("Error occurred. Please check your data and try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Credit Report Request
            </h2>
            <p className="text-sm text-slate-400">Download your credit report</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              MOBILE
            </label>
            <input
              type="text"
              value={mobile}
              readOnly
              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              PAN
            </label>
            <input
              type="text"
              value={pan}
              readOnly
              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              NAME
            </label>
            <input
              type="text"
              value={name}
              readOnly
              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300"
            />
          </div>
          
          <div>
            <span className="text-sm font-medium text-slate-300 block mb-3">GENDER</span>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-slate-300">Male</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-slate-300">Female</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
            <span className="text-sm text-slate-300">
              By proceeding, I consent to the fetching of my credit report data.
            </span>
          </div>
          
          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <InlineLoader />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Credit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditReportModal;
