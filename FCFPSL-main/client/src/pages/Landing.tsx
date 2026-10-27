import { Layout } from "@/components/Layout";
import { BrutalButton } from "@/components/BrutalButton";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Star, Zap, Youtube, Instagram, Send, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const logo = (window as any).__BRAND_CONFIG__?.logoUrl || "/branding/logo.png";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 md:py-16 overflow-hidden border-b-2 border-golden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, hsl(43 96% 56%) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div className="text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-golden text-black px-4 py-1 font-mono font-bold text-sm mb-6 uppercase tracking-widest transform -rotate-1">{t("hero.badge")}</span>
            <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tight leading-none">{(window as any).__BRAND_CONFIG__?.name || t("hero.title1")}</h1>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-golden uppercase tracking-tight leading-none">{t("hero.title2")}</h2>
            <div className="flex items-center gap-3 mb-6">
              {socialButtons((window as any).__BRAND_CONFIG__?.socialLinks || {})}
            </div>
            <p className="text-base md:text-lg font-medium mb-7 font-mono text-muted-foreground">{t("hero.subtitle")}</p>
            <Link href="/register"><BrutalButton variant="primary" size="lg" className="w-full sm:w-1/5 min-w-[180px]">Enquiry <ArrowRight className="ml-2 w-5 h-5" /></BrutalButton></Link>
          </motion.div>
          <HeroMedia items={(window as any).__BRAND_CONFIG__?.heroMedia || []} />
        </div>
      </section>

      {/* Session 2026-27 Admission Strip */}
      <section className="bg-[#D4AF37] border-b-2 border-black py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
              <div className="text-center">
                <p className="font-black text-black text-xs uppercase tracking-widest">
                  {t("admission.badge")}
                </p>
              </div>
              <div className="hidden md:block w-px h-8 bg-black/30" />
              <div className="flex items-center gap-2">
                <span className="bg-black text-[#D4AF37] font-black font-mono text-xs uppercase px-3 py-1 tracking-widest">
                  {t("admission.free")}
                </span>
                <span className="font-mono font-bold text-black text-xs uppercase">
                  {t("admission.classes.start")}
                </span>
              </div>
            </div>
            <Link href="/register">
              <span className="inline-block bg-black text-[#D4AF37] font-black font-mono text-xs uppercase px-6 py-2 tracking-widest hover:bg-neutral-800 transition-colors">
                {t("admission.seats")} →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title={t("features.concept.title")}
              desc={t("features.concept.desc")}
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8" />}
              title={t("features.mentor.title")}
              desc={t("features.mentor.desc")}
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8" />}
              title={t("features.material.title")}
              desc={t("features.material.desc")}
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 border-t-2 border-golden bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37] px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono font-bold text-[#D4AF37] text-xs uppercase tracking-widest">
              {t("admission.badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase text-golden">{t("cta.title")}</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-[#D4AF37] text-black font-black font-mono text-sm uppercase px-4 py-1.5 tracking-widest">
              {t("admission.free")}
            </span>
            <span className="border-2 border-[#D4AF37] text-[#D4AF37] font-mono font-bold text-sm uppercase px-4 py-1.5">
              {t("admission.classes.start")}
            </span>
          </div>
          <p className="text-lg font-mono mb-12 max-w-2xl mx-auto opacity-80">
            {t("cta.subtitle")}
          </p>
          <Link href="/register">
            <button className="btn-3d-primary px-12 py-5 text-xl font-black uppercase">
              {t("cta.button")}
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-brutal flex flex-col items-start h-full"
    >
      <div className="bg-golden text-black p-3 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 uppercase">{title}</h3>
      <p className="font-mono text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function socialButtons(links: Record<string, string>) {
  const items = [
    { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { key: "youtube", label: "YouTube", Icon: Youtube },
    { key: "instagram", label: "Instagram", Icon: Instagram },
    { key: "telegram", label: "Telegram", Icon: Send },
  ];
  return items.map(({ key, label, Icon }) => links[key] ? <a key={key} href={links[key]} target="_blank" rel="noreferrer" aria-label={label} title={label} className="inline-flex items-center justify-center h-11 w-11 border-2 border-golden hover:bg-golden hover:text-black transition-colors"><Icon size={21} /></a> : <span key={key} title={`${label}: add ${key.toUpperCase()} URL in Render environment`} className="inline-flex items-center justify-center h-11 w-11 border-2 border-golden/40 text-muted-foreground"><Icon size={21} /></span>);
}

function HeroMedia({ items }: { items: Array<{type?: string; url: string; link?: string}> }) {
  const [index, setIndex] = useState(0);
  const validItems = Array.isArray(items) ? items.filter((item) => item && item.url).slice(0, 10) : [];
  const current = validItems[index];
  useEffect(() => {
    if (!current || current.type === "video") return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % validItems.length), 4000);
    return () => window.clearTimeout(timer);
  }, [index, current, validItems.length]);
  if (!current) return <div className="w-full max-w-sm mx-auto aspect-[9/16] max-h-[520px] border-2 border-dashed border-golden/50 flex items-center justify-center text-center p-6 font-mono text-sm text-muted-foreground">Add up to 10 images/videos using BRAND_HERO_MEDIA in Render Environment.</div>;
  const content = current.type === "video" ? <video key={current.url} src={current.url} className="w-full h-full object-cover" autoPlay muted playsInline controls onEnded={() => setIndex((i) => (i + 1) % validItems.length)} /> : <img src={current.url} alt="Explore" className="w-full h-full object-cover" onError={() => setIndex((i) => (i + 1) % validItems.length)} />;
  return <div className="w-full max-w-sm mx-auto aspect-[9/16] max-h-[520px] overflow-hidden border-2 border-golden shadow-[8px_8px_0_#D4AF37] relative bg-black">
    {content}
    <a href={current.link || "#"} target={current.link ? "_blank" : undefined} rel="noreferrer" onClick={(e) => { if (!current.link) e.preventDefault(); }} className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 bg-black/80 text-[#D4AF37] font-black uppercase tracking-widest py-4">Explore <ExternalLink size={16} /></a>
    {validItems.length > 1 && <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-mono px-2 py-1">{index + 1}/{validItems.length}</div>}
  </div>;
}
