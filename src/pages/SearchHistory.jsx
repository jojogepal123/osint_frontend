import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../api/axios";
import useAuthContext from "../context/AuthContext";
import UserCard from "../components/UserCard";
import MainHeader from "../components/MainHeader";
import FullScreenLoader from "../components/FullScreenLoader";

const TYPE_LABELS = {
  tel: "Phone",
  email: "Email",
  vehicle: "Vehicle",
  upi: "UPI",
  challan: "Challan",
  leak: "Leak",
  corporate: "Corporate",
  verification: "Verification",
  social: "Social",
};

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

// Render the stored `query` field as a human-readable string.
// The backend stores some search types (e.g. `leak`) as JSON-encoded
// objects/arrays. Render the meaningful `value` from those.
const formatQuery = (query) => {
  if (query === null || query === undefined || query === "") return "—";
  if (typeof query !== "string") return String(query);
  const trimmed = query.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return query;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const values = parsed
        .map((item) => {
          if (item === null || typeof item !== "object") return String(item);
          return item.value ?? item.query ?? null;
        })
        .filter((v) => v !== null && v !== "");
      if (values.length > 0) return values.join(", ");
    } else if (parsed && typeof parsed === "object") {
      const values = Object.values(parsed)
        .filter((v) => v !== null && v !== "" && v !== undefined)
        .map(String);
      if (values.length > 0) return values.join(", ");
    }
    return query;
  } catch {
    return query;
  }
};

const SearchHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.cms_role === "auditor") {
      navigate("/cms/cases", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    instance
      .get("/api/search-results")
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setItems(
          list
            .filter((q) => q.public_id && q.result)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        );
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          err.response?.data?.error || "Failed to load search history.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {loading && <FullScreenLoader text="Loading saved searches..." />}
      <UserCard />
      <div className="flex-1 flex flex-col items-center z-10 text-white mt-10 sm:mt-20 px-4 pb-12">
        <MainHeader header="Recent Searches" />
        <div className="w-full max-w-5xl bg-gray-900/70 border border-lime-300/50 rounded-lg p-4 md:p-8 mt-6">
          {!loading && items.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              No saved searches yet. Run a search to see it here.
            </p>
          )}
          {items.length > 0 && (
            <ul className="divide-y divide-white/10">
              {items.map((q) => (
                <li
                  key={q.id}
                  className="py-3 flex items-center gap-4 flex-wrap"
                >
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-cyan-400/20 text-cyan-300 rounded capitalize">
                    {TYPE_LABELS[q.type] || q.type}
                  </span>
                  <span className="text-white font-mono text-sm break-all flex-1 min-w-[120px]">
                    {formatQuery(q.query)}
                  </span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(q.created_at)}
                  </span>
                  <Link
                    to={
                      q.type === "social"
                        ? `/social-results/${q.public_id}`
                        : `/results/${q.public_id}`
                    }
                    className="px-3 py-1 rounded bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900 text-xs font-bold hover:opacity-90"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchHistory;
