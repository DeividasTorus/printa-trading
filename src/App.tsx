import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import NavigationTabs from './components/Layout/NavigationTabs';
import DashboardScreen from './screens/DashboardScreen';
import YearlyOverviewScreen from './screens/YearlyOverviewScreen';
import OrderHistory from './screens/OrdersHistoryScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Navbar />
        <NavigationTabs />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/yearly-overview" element={<YearlyOverviewScreen />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
