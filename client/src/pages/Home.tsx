import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, Zap, Brain, Code, TrendingUp, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ChatBot from "@/components/ChatBot";
import TechnoAILogo from "@/components/TechnoAILogo";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactMutation = trpc.contact.submit.useMutation();

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "AI eCommerce", href: "#ecommerce" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Business Automation",
      description: "Streamline workflows and eliminate manual processes with intelligent automation that scales with your business.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Custom AI Agents",
      description: "Deploy specialized AI agents for sales, marketing, support, and operations — trained on your business data.",
      color: "from-teal-400 to-cyan-600",
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: "Data Decision Systems",
      description: "Build intelligent systems that transform raw data into actionable insights and competitive advantages.",
      color: "from-green-400 to-emerald-600",
    },
  ];

  const metrics = [
    { value: "85%", label: "Increase in Leads", color: "text-blue-400" },
    { value: "40%", label: "Cost Reduction", color: "text-teal-400" },
    { value: "3.2x", label: "ROI Improvement", color: "text-green-400" },
  ];

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync(formData);
      toast.success("Message sent! We'll be in touch soon.");
      setFormData({ name: "", email: "", company: "", message: "" });
      setContactFormOpen(false);
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-[#f0f4ff] border border-[rgba(41,98,255,0.25)] rounded-lg focus:outline-none focus:border-[#2962FF] focus:ring-1 focus:ring-[#2962FF] text-[#0d1b3e] placeholder:text-[#8a9abf] text-sm transition-colors";

  return (
    <div className="min-h-screen bg-white text-[#0d1b3e]">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-[rgba(41,98,255,0.12)] shadow-sm z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <TechnoAILogo size={40} />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-[#0d1b3e]">TechnoAI</span>
              <p className="text-[10px] text-[#5a6a9a] leading-none">KVS TechnoAI LLC</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-[#3a4a7a]">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => scrollToSection(item.href)}
                className="hover:text-[#2962FF] transition-colors">
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex gap-3">
            <Button variant="outline" size="sm"
              className="border-[rgba(41,98,255,0.35)] text-[#3a4a7a] hover:border-[#2962FF] hover:text-[#2962FF] bg-transparent"
              onClick={() => scrollToSection("#contact")}>
              Contact
            </Button>
            <Button size="sm"
              className="brand-gradient text-white hover:opacity-90 border-0"
              onClick={() => setContactFormOpen(true)}>
              Book Consultation
            </Button>
          </div>

          <button className="md:hidden p-2 text-[#3a4a7a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[rgba(41,98,255,0.12)] shadow-sm">
            <div className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => scrollToSection(item.href)}
                  className="text-left text-sm text-[#3a4a7a] hover:text-[#2962FF] transition-colors">
                  {item.label}
                </button>
              ))}
              <Button size="sm" className="brand-gradient text-white border-0 w-full"
                onClick={() => setContactFormOpen(true)}>
                Book Consultation
              </Button>
            </div>
          </div>
        )}
      </nav>


      {/* ── HERO ── */}
      <section id="home" className="pt-32 pb-24 relative overflow-hidden hero-bg grid-bg">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#2962FF]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-[#00C8B3]/10 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(41,98,255,0.4)] bg-[rgba(41,98,255,0.08)] text-xs text-[#2962FF] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C8B3] animate-pulse" />
                Business Automation & AI Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transforming Businesses{" "}
                <span className="brand-gradient-text">with AI</span>
              </h1>
              <p className="text-lg text-[#4a5a8a] mb-8 leading-relaxed">
                Automate workflows, improve decision-making, and reduce operational costs with custom AI solutions built for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg"
                  className="brand-gradient gradient-animate text-white border-0 glow-blue px-8"
                  onClick={() => setContactFormOpen(true)}>
                  Book Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline"
                  className="border-[rgba(41,98,255,0.35)] text-[#3a4a7a] hover:border-[#2962FF] hover:text-[#2962FF] bg-transparent"
                  onClick={() => scrollToSection("#services")}>
                  Explore Services
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10">
                {metrics.map((m, i) => (
                  <div key={i}>
                    <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                    <div className="text-xs text-[#5a6a9a]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden md:flex items-center justify-center h-96">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2962FF]/10 to-[#00C8B3]/5 border border-[rgba(41,98,255,0.2)]" />
              <div className="relative z-10 text-center">
                <TechnoAILogo size={140} className="mx-auto mb-4 drop-shadow-2xl" />
                <p className="text-[#3a4a7a] text-sm font-medium">KVS TechnoAI LLC</p>
                <p className="text-[#5a6a9a] text-xs">Business Automation & AI Solutions</p>
              </div>
              <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-[#2962FF]/20 blur-xl" />
              <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-[#00C8B3]/20 blur-xl" />
            </div>
          </div>
        </div>
      </section>


      {/* ── SERVICES ── */}
      <section id="services" className="py-20 bg-[#f8faff]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#2962FF] text-sm font-semibold uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
            <p className="text-[#4a5a8a] max-w-2xl mx-auto">
              Comprehensive AI solutions designed to drive growth and efficiency across your entire organization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx}
                className="card-hover bg-white border border-[rgba(41,98,255,0.15)] rounded-xl p-8 shadow-sm">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5`}>
                  <div className="text-white">{service.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-[#4a5a8a] mb-6 text-sm leading-relaxed">{service.description}</p>
                <button onClick={() => setContactFormOpen(true)}
                  className="flex items-center gap-1 text-sm text-[#2962FF] hover:text-[#00C8B3] transition-colors font-medium">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL MARKETING METRICS ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 brand-gradient opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Results That Matter</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Digital Marketing: Optimized Campaigns & ROI
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Outcome-focused strategies with custom-built AI agents and data-driven optimization.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {metrics.map((metric, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <p className="text-sm text-white/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-20 bg-[#f8faff]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00C8B3] text-sm font-semibold uppercase tracking-widest mb-3">Case Studies</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-[#4a5a8a] max-w-2xl mx-auto">
              See how we've helped businesses transform with AI-powered solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-hover bg-white border border-[rgba(41,98,255,0.15)] rounded-xl p-8 shadow-sm">
              <div className="inline-flex px-3 py-1 rounded-full bg-[rgba(0,200,179,0.1)] border border-[rgba(0,200,179,0.3)] text-[#00C8B3] text-xs font-medium mb-6">
                SaaS Company
              </div>
              <h3 className="text-xl font-bold mb-6">Reducing Manual Support Tickets by 80%</h3>
              <div className="space-y-5">
                {[
                  { label: "Challenge", text: "A growing SaaS company was overwhelmed with customer support tickets, causing response delays and customer dissatisfaction." },
                  { label: "Solution", text: "We deployed a custom AI support agent that automatically handles common inquiries, routes complex issues, and learns from interactions." },
                  { label: "Outcome", text: "80% reduction in manual tickets, 60% faster response times, and 95% customer satisfaction improvement." },
                ].map((item) => (
                  <div key={item.label}>
                    <h4 className="text-[#2962FF] font-semibold text-sm mb-1">{item.label}</h4>
                    <p className="text-[#4a5a8a] text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-hover bg-white border border-[rgba(41,98,255,0.15)] rounded-xl p-8 shadow-sm">
              <div className="inline-flex px-3 py-1 rounded-full bg-[rgba(41,98,255,0.1)] border border-[rgba(41,98,255,0.3)] text-[#2962FF] text-xs font-medium mb-6">
                Key Metrics
              </div>
              <h3 className="text-xl font-bold mb-8">Measurable Business Impact</h3>
              <div className="space-y-5">
                {[
                  { label: "Leads Generated", value: "+85%", color: "text-blue-400" },
                  { label: "Cost Reduction", value: "-40%", color: "text-teal-400" },
                  { label: "ROI Improvement", value: "3.2x", color: "text-green-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#3a4a7a] text-sm">{item.label}</span>
                      <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                    </div>
                    <div className="h-px bg-[rgba(41,98,255,0.15)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── ABOUT ── */}
      <section id="about" className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#2962FF] text-sm font-semibold uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About TechnoAI</h2>
              <p className="text-[#4a5a8a] mb-4 leading-relaxed">
                We are a team of AI specialists, engineers, and business strategists dedicated to transforming enterprises through intelligent automation and data-driven solutions.
              </p>
              <p className="text-[#4a5a8a] mb-8 leading-relaxed">
                With deep expertise in machine learning, natural language processing, and enterprise software, we deliver solutions that create measurable impact on your bottom line.
              </p>
              <div className="space-y-5">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Enterprise-Grade Security", desc: "All solutions comply with industry standards and best practices." },
                  { icon: <Users className="w-5 h-5" />, title: "Expert Team", desc: "Dedicated professionals with proven track records in AI implementation." },
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Proven Results", desc: "Measurable improvements in efficiency, revenue, and customer satisfaction." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(41,98,255,0.1)] text-[#2962FF] flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-[#4a5a8a]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[rgba(41,98,255,0.1)] to-[rgba(0,200,179,0.05)] border border-[rgba(41,98,255,0.2)] rounded-2xl p-10 flex flex-col items-center justify-center min-h-80 text-center">
                <TechnoAILogo size={112} className="mx-auto mb-5" />
                <p className="font-bold text-lg">KVS TechnoAI LLC</p>
                <p className="text-[#5a6a9a] text-sm mt-1">Business Automation & AI Solutions</p>
                <div className="flex gap-3 mt-6">
                  <span className="px-3 py-1 rounded-full bg-[rgba(41,98,255,0.15)] text-[#2962FF] text-xs border border-[rgba(41,98,255,0.3)]">AI Automation</span>
                  <span className="px-3 py-1 rounded-full bg-[rgba(0,200,179,0.15)] text-[#00C8B3] text-xs border border-[rgba(0,200,179,0.3)]">ML & NLP</span>
                  <span className="px-3 py-1 rounded-full bg-[rgba(0,203,83,0.15)] text-[#00CB53] text-xs border border-[rgba(0,203,83,0.3)]">Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── AI eCOMMERCE ── */}
      <section id="ecommerce" className="py-20 bg-[#f8faff]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00CB53] text-sm font-semibold uppercase tracking-widest mb-3">eCommerce AI</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI eCommerce Solutions</h2>
            <p className="text-[#4a5a8a] max-w-2xl mx-auto">
              Omnichannel platform capabilities for custom growth, ROI, and business scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-hover bg-white border border-[rgba(41,98,255,0.15)] rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Growth & Automation Features</h3>
              <ul className="space-y-4">
                {[
                  "Intelligent product recommendations",
                  "Automated customer segmentation",
                  "Dynamic pricing optimization",
                  "Predictive inventory management",
                  "AI-powered ad campaign optimization",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00C8B3] flex-shrink-0" />
                    <span className="text-[#3a4a7a] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-hover bg-white border border-[rgba(41,98,255,0.15)] rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Success Metrics</h3>
              <div className="space-y-6">
                {[
                  { value: "85%", label: "Increase in Leads", color: "text-blue-400", bar: "bg-blue-500", pct: "85%" },
                  { value: "40%", label: "Reduction in Op-Ex", color: "text-teal-400", bar: "bg-teal-400", pct: "40%" },
                  { value: "+3.2x", label: "ROI on Ad Spend", color: "text-green-400", bar: "bg-green-400", pct: "80%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#3a4a7a] text-sm">{item.label}</span>
                      <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-[rgba(41,98,255,0.15)] rounded-full overflow-hidden">
                      <div className={`h-full ${item.bar} rounded-full`} style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[#2962FF] text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-[#4a5a8a] max-w-2xl mx-auto">
              Contact us today for a free consultation and discover how AI can drive your growth.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-[rgba(41,98,255,0.15)] rounded-2xl p-8 shadow-md">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#3a4a7a] mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange}
                      required className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3a4a7a] mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange}
                      required className={inputCls} placeholder="you@company.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3a4a7a] mb-2">Company *</label>
                  <input type="text" name="company" value={formData.company} onChange={handleFormChange}
                    required className={inputCls} placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3a4a7a] mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleFormChange}
                    required rows={5} className={`${inputCls} resize-none`}
                    placeholder="Tell us about your project and goals..." />
                </div>
                <Button type="submit" size="lg"
                  className="w-full brand-gradient text-white border-0 hover:opacity-90 glow-blue"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer className="bg-[#f0f4ff] border-t border-[rgba(41,98,255,0.15)] py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <TechnoAILogo size={40} />
                <div>
                  <p className="font-bold text-[#0d1b3e]">TechnoAI</p>
                  <p className="text-[10px] text-[#5a6a9a]">KVS TechnoAI LLC</p>
                </div>
              </div>
              <p className="text-sm text-[#4a5a8a]">Business Automation & AI Solutions</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#0d1b3e] mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-[#4a5a8a]">
                {["Business Automation", "AI Agents", "Data Systems"].map((s) => (
                  <li key={s}><button onClick={() => scrollToSection("#services")} className="hover:text-[#2962FF] transition-colors">{s}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#0d1b3e] mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#4a5a8a]">
                <li><button onClick={() => scrollToSection("#about")} className="hover:text-[#2962FF] transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection("#portfolio")} className="hover:text-[#2962FF] transition-colors">Portfolio</button></li>
                <li><button onClick={() => scrollToSection("#contact")} className="hover:text-[#2962FF] transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#0d1b3e] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#4a5a8a]">
                <li><a href="#" className="hover:text-[#2962FF] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#2962FF] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[rgba(41,98,255,0.15)] pt-8 text-center text-sm text-[#4a5a8a]">
            <p>&copy; 2025 KVS TechnoAI LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>


      {/* ── CONTACT MODAL ── */}
      {contactFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(41,98,255,0.2)] rounded-2xl max-w-md w-full p-7 relative shadow-2xl">
            <button onClick={() => setContactFormOpen(false)}
              className="absolute top-4 right-4 text-[#5a6a9a] hover:text-[#0d1b3e] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Book a Consultation</h3>
              <p className="text-[#5a6a9a] text-sm mt-1">We'll get back to you within 24 hours.</p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3a4a7a] mb-1.5">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange}
                  required className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a4a7a] mb-1.5">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange}
                  required className={inputCls} placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a4a7a] mb-1.5">Company *</label>
                <input type="text" name="company" value={formData.company} onChange={handleFormChange}
                  required className={inputCls} placeholder="Your company" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a4a7a] mb-1.5">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleFormChange}
                  required rows={4} className={`${inputCls} resize-none`}
                  placeholder="Tell us about your project..." />
              </div>
              <Button type="submit" size="lg"
                className="w-full brand-gradient text-white border-0 hover:opacity-90"
                disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}
