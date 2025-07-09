import StrategyDashboard from '../components/Cards/StrategyDashboard';
import CumulativePnLCard from '../components/Cards/CumulativePnLCard';
import PortfolioGraph from '../components/Charts/PortfolioGraph';
import ActivePositionsTable from '../components/Cards/ActivePositionsTable';

export default function DashboardScreen() {
    return (
        <>
            <StrategyDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 mt-6">
                <CumulativePnLCard />
                <PortfolioGraph />
            </div>
            <div className="px-10 mt-6 pb-10">
                <ActivePositionsTable />
            </div>
        </>
    );
}
