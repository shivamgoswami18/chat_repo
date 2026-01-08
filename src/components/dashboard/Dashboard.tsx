import DashboardCard from "./DashboardCard";
import DashboardHeaderCard from "./DashboardHeaderCard";
import DashboardSection from "./DashboardSection";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full md:flex-[4]">
        <DashboardSection />
      </div>

      <div className="w-full md:flex-[2] space-y-4">
        <DashboardHeaderCard />
        <DashboardCard />
      </div>
    </div>
  );
};

export default Dashboard;
