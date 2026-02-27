import { motion } from "framer-motion";

interface ClassConfidences {
  [key: string]: number;
}

interface AnalysisResult {
  predicted_class: string;
  confidence: number;
  all_class_confidences: ClassConfidences;
}

const CLASS_INFO: Record<string, { name: string; risk: "low" | "medium" | "high" }> = {
  nv: { name: "Normal skin / Melanocytic Nevus (Mole) ", risk: "low" },
  mel: { name: "Melanoma", risk: "high" },
  bkl: { name: "Benign Keratosis", risk: "low" },
  bcc: { name: "Basal Cell Carcinoma", risk: "high" },
  akiec: { name: "Actinic Keratosis", risk: "medium" },
  vasc: { name: "Vascular Lesion", risk: "low" },
  df: { name: "Dermatofibroma", risk: "low" },
};

const riskConfig = {
  low: { label: "Low Risk", className: "bg-risk-low/10 text-risk-low" },
  medium: { label: "Medium Risk", className: "bg-risk-medium/10 text-risk-medium" },
  high: { label: "High Risk", className: "bg-risk-high/10 text-risk-high" },
};

const barColorClass = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
};

const ResultsCard = ({ result }: { result: AnalysisResult }) => {
  const predicted = result.predicted_class.toLowerCase();
  const info = CLASS_INFO[predicted] || { name: predicted.toUpperCase(), risk: "medium" as const };
  const risk = riskConfig[info.risk];

  const sorted = Object.entries(result.all_class_confidences).sort(
    ([, a], [, b]) => b - a
  );
  const maxConf = sorted[0]?.[1] || 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Main result */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 text-center space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Predicted Classification
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
          {info.name}
        </h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
            {result.confidence.toFixed(1)}% Confidence
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${risk.className}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Class Probabilities</h3>
        <div className="space-y-3">
          {sorted.map(([cls, conf]) => {
            const clsInfo = CLASS_INFO[cls] || { name: cls.toUpperCase(), risk: "medium" as const };
            return (
              <div key={cls} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground uppercase">{cls}</span>
                  <span className="text-muted-foreground">{conf.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(conf / maxConf) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`h-full rounded-full ${barColorClass[clsInfo.risk]}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class descriptions */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Class Reference</h3>
        <div className="grid gap-2">
          {Object.entries(CLASS_INFO).map(([key, val]) => (
            <div
              key={key}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                key === predicted ? "bg-secondary font-medium" : ""
              }`}
            >
              <span className="text-foreground">
                <span className="uppercase font-semibold">{key}</span> – {val.name}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskConfig[val.risk].className}`}>
                {riskConfig[val.risk].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsCard;
