import { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const AlertContext = createContext(null);

const alertStyles = {
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    text: "text-emerald-300",
    iconBg: "bg-emerald-500/20",
    dot: "bg-emerald-400",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-400",
    text: "text-red-300",
    iconBg: "bg-red-500/20",
    dot: "bg-red-400",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "text-amber-400",
    text: "text-amber-300",
    iconBg: "bg-amber-500/20",
    dot: "bg-amber-400",
  },
  info: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    text: "text-cyan-300",
    iconBg: "bg-cyan-500/20",
    dot: "bg-cyan-400",
  },
};

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function AlertItem({ alert, onDismiss }) {
  const style = alertStyles[alert.type] || alertStyles.info;
  const Icon = iconMap[alert.type] || Info;

  useEffect(() => {
    if (alert.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(alert.id);
      }, alert.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.id, alert.duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl ${style.bg} ${style.border} border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_ease-out]`}
      style={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
    >
      <div className={`w-9 h-9 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${style.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        {alert.title && (
          <p className={`text-sm font-semibold ${style.text} mb-0.5`}>{alert.title}</p>
        )}
        <p className={`text-sm ${style.text} opacity-90`}>{alert.message}</p>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className={`w-7 h-7 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity`}
      >
        <X className={`w-3.5 h-3.5 ${style.icon}`} />
      </button>
    </div>
  );
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message, options = {}) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      type,
      message,
      title: options.title || "",
      duration: options.duration !== undefined ? options.duration : 4000,
    };
    setAlerts((prev) => [...prev, alert]);
    return id;
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const showAlert = {
    success: (message, options) => addAlert("success", message, options),
    error: (message, options) => addAlert("error", message, options),
    warning: (message, options) => addAlert("warning", message, options),
    info: (message, options) => addAlert("info", message, options),
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <AlertItem alert={alert} onDismiss={dismissAlert} />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}
