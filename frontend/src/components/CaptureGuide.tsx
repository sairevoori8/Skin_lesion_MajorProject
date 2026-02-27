import { motion } from "framer-motion";
import {
  Sun,
  Focus,
  Scissors,
  Droplets,
  Sparkles,
  Ruler,
  Hand,
} from "lucide-react";

const steps = [
  {
    icon: Sun,
    title: "Ensure Proper Lighting",
    tips: [
      "Use bright, natural white light",
      "Avoid yellow indoor lighting",
      "Avoid strong flash reflections",
      "Lesion should be visible without shadows",
    ],
  },
  {
    icon: Focus,
    title: "Keep the Image Well-Focused",
    tips: [
      "Hold the camera steady",
      "Ensure the lesion is sharp, not blurry",
      "Fill most of the frame with the lesion",
      "Keep the lesion centered",
    ],
  },
  {
    icon: Scissors,
    title: "Remove Hair Obstruction",
    tips: [
      "Gently move hair aside if covering the lesion",
      "Do not shave aggressively before capture",
      "Ensure the lesion surface is clearly visible",
    ],
  },
  {
    icon: Droplets,
    title: "Clean the Skin Surface",
    tips: [
      "Remove dirt, sweat, and cosmetics",
      "Gently clean with water or alcohol wipe",
      "Dry the area before taking the picture",
    ],
  },
  {
    icon: Sparkles,
    title: "Avoid Reflections and Glare",
    tips: [
      "Apply gel or alcohol to reduce air gaps with dermoscope",
      "Ensure no air bubbles between lens and skin",
      "Avoid strong light reflections",
    ],
  },
  {
    icon: Ruler,
    title: "Maintain Proper Distance",
    tips: [
      "Do not zoom digitally",
      "Keep camera 5–10 cm away",
      "Avoid extreme close-ups that distort edges",
    ],
  },
  {
    icon: Hand,
    title: "Use a Stable Position",
    tips: [
      "Rest your hand on a stable surface",
      "Ask someone for help if needed",
      "Avoid motion blur",
    ],
  },
];

const CaptureGuide = () => {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-4">
            Preparation Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            How to Capture a Proper Skin Lesion Image
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Follow these steps to ensure optimal image quality for accurate AI analysis.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <step.icon className="w-4.5 h-4.5 text-secondary-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold font-display text-foreground mb-2">
                    {step.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip) => (
                      <li
                        key={tip}
                        className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-accent shrink-0 mt-1.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-xs text-muted-foreground text-center mt-8 max-w-xl mx-auto leading-relaxed"
        >
          For best results, use a dermoscopic camera or macro lens attachment.
          Proper image quality improves AI accuracy.
        </motion.p>
      </div>
    </section>
  );
};

export default CaptureGuide;
