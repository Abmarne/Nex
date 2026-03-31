import React from "react";

export function FAQSection() {
  const faqs = [
    {
       q: "What is Nex digital queue management?",
       a: "Nex is a high-performance digital queue management system that allows businesses to manage waiting lines in real-time. Customers can join the queue by scanning a QR code without installing any apps, reducing friction and improving customer satisfaction."
    },
    {
       q: "How does the zero-install waitlist work?",
       a: "Nex uses a web-based terminal interface. Customers simply scan a unique branded QR code at your business location. This instantly places them in the digital waitlist, and they receive live updates on their position and estimated wait time directly in their mobile browser."
    },
    {
       q: "Is Nex suitable for clinics and salons?",
       a: "Absolutely. Nex is specifically designed for businesses where waiting time is a core part of the service delivery, such as medical clinics, hair salons, retail centers, and restaurants. It handles both walk-ins and scheduled appointments seamlessly."
    },
    {
       q: "Can I manage multiple service lines?",
       a: "Yes, the Nex Command Center allows you to create and manage multiple queues simultaneously. Each queue can have its own settings, dedicated QR codes, and real-time analytics."
    }
  ];

  return (
    <section className="py-24 md:py-40 px-6 relative z-10 bg-black/40 border-t border-white/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-6">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-muted-foreground text-sm md:text-lg font-medium tracking-wide">Everything you need to know about the Nex digital queue protocol.</p>
        </div>
        
        <div className="space-y-6 md:space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-4 text-white">
                <span className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px] md:text-xs">Q</span>
                {faq.q}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-10 md:pl-12 font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
