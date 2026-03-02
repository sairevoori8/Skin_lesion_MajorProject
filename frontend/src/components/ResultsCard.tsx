import { motion } from "framer-motion";

interface ClassConfidences {
  [key: string]: number;
}

interface AnalysisResult {
  predicted_class: string;
  confidence: number;
  all_class_confidences: ClassConfidences;
}

const CLASS_INFO: Record<string, { name: string; risk: "low" | "medium" | "high", desc: string, doctor: string }> = {
  nv: { name: "Normal skin / Melanocytic Nevus (Mole) ", risk: "low", desc: "Normal skin or melanocytic nevus (commonly known as a mole) is a benign growth of pigment-producing cells. Most moles are harmless and remain stable over time.", doctor: "Safe" },
  mel: { name: "Melanoma", risk: "high", desc: "Melanoma is a serious form of skin cancer that develops from pigment-producing melanocytes. It can spread to other parts of the body if not detected early.", doctor: "Seek immediate medical attention and consult a dermatologist." },
  bkl: { name: "Benign Keratosis", risk: "low", desc: "Benign keratosis refers to non-cancerous skin growths such as seborrheic keratosis. These are common and usually harmless.", doctor: "Generally no treatment needed, but consult a doctor if it causes discomfort." },
  bcc: { name: "Basal Cell Carcinoma", risk: "high", desc: "Basal Cell Carcinoma is the most common type of skin cancer. It grows slowly but can cause local tissue damage if untreated.", doctor: "Treat immediately with surgical removal or other appropriate therapies." },
  akiec: { name: "Actinic Keratosis", risk: "medium", desc: "Actinic keratosis is a rough, scaly patch caused by sun damage. It is considered a precancerous condition that may develop into squamous cell carcinoma.", doctor: "Treat with cryotherapy, topical medications, or other prescribed therapies." },
  vasc: { name: "Vascular Lesion", risk: "low", desc: "Vascular lesions are abnormal growths of blood vessels in the skin. They are usually benign but may require treatment depending on their type and location.", doctor: "Consult a dermatologist for proper evaluation and treatment." },
  df: { name: "Dermatofibroma", risk: "low", desc: "Dermatofibroma is a benign nodule that typically appears as a small, firm bump in the skin. It is usually harmless and does not require treatment unless symptomatic.", doctor: "Generally no treatment needed, but consult a doctor if it causes discomfort." },
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
  const info = CLASS_INFO[predicted] || { name: predicted.toUpperCase(), risk: "medium" as const ,desc: "No description available.", doctor: "Consult a healthcare professional."};
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
        <div className="text-m text-foreground/80 max-w-md mx-auto">
          {info.desc}
          {info.doctor && (
            <p className="mt-2 font-medium text-m text-foreground">
              Recommendation: {info.doctor}
            </p>
          )}
        </div>
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
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${key === predicted ? "bg-secondary font-medium" : ""
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
