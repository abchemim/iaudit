import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
