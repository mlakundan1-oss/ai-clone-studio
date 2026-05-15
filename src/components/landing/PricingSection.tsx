"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Star, Building2, Sparkles } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    price: 0,
    yearlyPrice: 0,
    description: "Start creating with AI-powered tools",
    color: "#6b7280",
    borderColor: "rgba(107,114,128,0.3)",
    features: [
      "5 AI video generations/month",
      "720p exports",
      "10 GB cloud storage",
      "Basic effects library",
      "MP4 export format",
      "Community support",
    ],
    credits: "50 AI credits/mo",
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Star,
    price: 29,
    yearlyPrice: 19,
    description: "For serious content creators",
    color: "#2563eb",
    borderColor: "rgba(37,99,235,0.5)",
    popular: true,
    gradient: "from-blue-600 to-violet-600",
    features: [
      "100 AI video generations/month",
      "4K exports at 60fps",
      "100 GB cloud storage",
      "All effects & transitions",
      "AI captions & subtitles",
      "Voice cloning (3 voices)",
      "AI avatar (1 avatar)",
      "Priority rendering",
      "MP4, MOV, WEBM export",
    ],
    credits: "500 AI credits/mo",
    cta: "Start Pro Trial",
  },
  {
    id: "studio",
    name: "Studio",
    icon: Sparkles,
    price: 79,
    yearlyPrice: 59,
    description: "For agencies and power users",
    color: "#7c3aed",
    borderColor: "rgba(124,58,237,0.4)",
    gradient: "from-violet-600 to-pink-600",
    features: [
      "Unlimited AI generations",
      "4K exports + cloud rendering",
      "1 TB cloud storage",
      "Advanced AI auto-editor",
      "Unlimited voice cloning",
      "10 AI avatars",
      "Team workspace (5 users)",
      "Real-time collaboration",
      "API access",
      "Custom branding",
      "Analytics dashboard",
    ],
    credits: "2000 AI credits/mo",
    cta: "Start Studio Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: 299,
    yearlyPrice: 249,
    description: "For large teams and organizations",
    color: "#06b6d4",
    borderColor: "rgba(6,182,212,0.3)",
    features: [
      "Everything in Studio",
      "Unlimited team members",
      "Unlimited cloud storage",
      "Custom AI model training",
      "Dedicated rendering cluster",
      "SSO & SAML integration",
      "Custom SLA",
      "Dedicated account manager",
      "On-premise option",
      "White-label solution",
    ],
    credits: "Unlimited credits",
    cta: "Contact Sales",
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">Simple Pricing</span>
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-5">
            Scale Your <span className="gradient-text">Creative Power</span>
          </h2>
          <p className="text-lg text-white/50 mb-8">
            Start free. Upgrade as you grow. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center glass border border-white/10 rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                !yearly ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                Save 35%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative glass rounded-2xl p-6 border transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500/50 scale-[1.02]"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                }`}
                style={{
                  boxShadow: plan.popular ? `0 0 40px rgba(37,99,235,0.2)` : undefined,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-white/50">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold font-orbitron" style={{ color: plan.color }}>
                      ${yearly ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-white/40 text-sm mb-1.5">/mo</span>
                  </div>
                  <div
                    className="text-xs px-2 py-1 rounded-lg inline-block"
                    style={{ background: `${plan.color}15`, color: plan.color }}
                  >
                    {plan.credits}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white neon-blue"
                      : "glass border border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {plan.cta}
                </motion.button>

                {/* Features */}
                <div className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${plan.color}20` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                      </div>
                      <span className="text-sm text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
