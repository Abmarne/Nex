import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BackgroundGlow } from "@/components/landing/BackgroundGlow";

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Nex",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "description": "High-performance digital queue management system for modern businesses. Frictionless tokens, zero-install access, and live updates.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "850"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nex Platform",
      "url": "https://nex-lovat.vercel.app",
      "logo": "https://nex-lovat.vercel.app/icon.png",
      "sameAs": [
        "https://twitter.com/nexplatform",
        "https://linkedin.com/company/nexplatform"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Nex digital queue management?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nex is a high-performance digital queue management system that allows businesses to manage waiting lines in real-time. Customers can join the queue by scanning a QR code without installing any apps."
          }
        },
        {
          "@type": "Question",
          "name": "How does the zero-install waitlist work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nex uses a web-based terminal. Customers simply scan a QR code at your business location, which takes them to a live-updating web page showing their position in line and estimated wait time."
          }
        },
        {
          "@type": "Question",
          "name": "Is Nex suitable for clinics and salons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Nex is built for clinics, salons, retail stores, and any business that experiences waiting lines. It provides real-time updates and appointment scheduling features."
          }
        }
      ]
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-white font-sans overflow-hidden selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundGlow />
      <LandingHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}

