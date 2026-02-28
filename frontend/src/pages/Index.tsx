import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowDown,
  Loader2,
  AlertCircle,
  Brain,
  Zap,
  Lock,
  Activity,
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import CaptureGuide from "@/components/CaptureGuide";
import ResultsCard from "@/components/ResultsCard";

interface AnalysisResult {
  predicted_class: string;
  confidence: number;
  class_index: number;
  all_class_confidences: Record<string, number>;
}

const features = [
  {
    icon: Brain,
    title: "Deep Learning Model",
    desc: "Trained on thousands of dermoscopic images for accurate classification.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Get AI-powered analysis in seconds with detailed confidence scores.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    desc: "Your images are processed securely and never stored on our servers.",
  },
];

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("http://13.232.242.131/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Server error");
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch {
      setError(
        "Unable to analyze image. Please ensure the API server is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [file]);

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-5xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              DermAI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Skin Lesion Classification
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary glow-blob" />
          <div className="absolute -top-16 right-0 w-80 h-80 rounded-full bg-accent glow-blob" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full bg-primary/20 glow-blob" />
        </div>

        <div className="relative py-20 sm:py-32 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              AI-Powered Dermatology
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight">
              Skin Lesion{" "}
              <span className="text-primary">Analysis</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Upload a dermoscopic image to receive AI-based classification
              results with detailed confidence scores across 7 lesion types.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={scrollToUpload}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl hero-gradient text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Analyze Image
                <ArrowDown className="w-4 h-4" />
              </button>
              <p className="text-xs text-muted-foreground">
                For educational and clinical support use only
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-5 h-5 text-secondary-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-semibold font-display text-foreground mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capture Guide */}
      <CaptureGuide />

      {/* Upload + Results */}
      <section
        id="upload-section"
        className="pb-24 px-4 space-y-8"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">
              Upload Your Image
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Supported formats: JPG, JPEG, PNG
            </p>
          </div>
        </div>

        <ImageUploader
          file={file}
          preview={preview}
          onFileSelect={handleFileSelect}
          onRemove={handleRemove}
        />

        {/* Analyze button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl hero-gradient text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing image… Please wait
              </>
            ) : (
              "Analyze Image"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {result && <ResultsCard result={result} />}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 px-4">
        <div className="container max-w-5xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md hero-gradient flex items-center justify-center">
              <Shield className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              DermAI
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl text-center">
            This AI system is for educational and assistive purposes only. It
            does not replace professional medical diagnosis. Always consult a
            qualified dermatologist for clinical decisions.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DermAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
