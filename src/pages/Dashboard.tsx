import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import FGTSContent from "@/components/fgts/FGTSContent";
import CertificatesContent from "@/components/certificates/CertificatesContent";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "fgts":
        return <FGTSContent />;
      case "certidoes":
        return <CertificatesContent />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">
                Conteúdo de <span className="font-semibold text-foreground">{activeTab}</span> em desenvolvimento.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeTab={activeTab} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
