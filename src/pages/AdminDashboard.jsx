import Header from '../layouts/Header';
import AdminSidemenu from '../layouts/AdminSidemenu';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import ColumnChart from '../components/ColumnChart';
import Footer from '../layouts/Footer'; 
import { Calendar } from 'lucide-react';
import Snackbar from '../components/Snackbar';
import ComponentLoading from '../components/ComponentLoading';
import { useState, useEffect } from 'react';
import api from '../api/axios';


const AdminDashboard = () => {
   const [range, setRange] = useState('current_day');
    const [summary, setSummary] = useState({});
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');
    const [loading, setLoading] = useState(true);
    
    const fetchSummaryByRange = async () => {
        try {
          setLoading(true);
          const response = await api.get('/summary/fetch', {
            params: { range: range }
          });
          
          // Ensure data is properly structured before setting state
          if (response.data && response.data.data) {
            setSummary(response.data.data);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (err) {
          setMessage(err.response?.data?.message || 'Something went wrong');
          setResponseStatus(err.response?.data?.status || 'error');
          setShowSnackbar(true);
          console.error('Error fetching summary:', err);
        } finally {
          setLoading(false);
        }
    };

     const formatCurrency = (value) => {
        if(loading) {
            return <ComponentLoading />
        }
        if(value === undefined || value === null || isNaN(value)) {
            return <ComponentLoading />
        }
        return `₱${Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };

    useEffect(() => {
        fetchSummaryByRange();
    }, [range]);

  return (
    <div className="h-screen w-screen flex flex-col gap-1 overflow-hidden">

      {showSnackbar && (
            <Snackbar 
            message={message && message}
            type={responseStatus}
            onClose={() => setShowSnackbar(false)}
            />
        )}

      <Header />
      <div className="flex w-full h-full gap-3">
        <AdminSidemenu />
        <div className="flex flex-col gap-5 w-full h-fit pr-[10px] mt-2">
          <Breadcrumb />
          <div className="grid grid-cols-4 w-full px-5 gap-5 mb-3">
              <button 
                onClick={() => setRange('current_day')}
                className={`flex items-center justify-center gap-2 ${range === 'current_day' ? 'bg-mustard' : 'bg-secondary'} focus:bg-mustard py-2 focus:text-black hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                  <Calendar size={15} /> Current Day
              </button>
              <button 
                onClick={() => setRange('last_week')}
                className={`flex items-center justify-center gap-2 ${range === 'last_week' ? 'bg-mustard' : 'bg-secondary'} focus:bg-mustard py-2 focus:text-black hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                  <Calendar size={15} /> Last Week
              </button>
              <button 
                onClick={() => setRange('last_month')}
                className={`flex items-center justify-center gap-2 ${range === 'last_month' ? 'bg-mustard' : 'bg-secondary'} focus:bg-mustard py-2 focus:text-black hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                  <Calendar size={15} /> Last Month
              </button>
              <button 
                  onClick={() => setRange('last_year')}
                  className={`flex items-center justify-center gap-2 ${range === 'last_year' ? 'bg-mustard' : 'bg-secondary'} focus:bg-mustard py-2 focus:text-black hover:bg-mustard hover:text-black rounded-full text-black text-[14px] font-medium shadow-md shadow-gray-900 cursor-pointer`}>
                  <Calendar size={15} /> Last Year
              </button>
          </div>
          <div className="flex justify-between h-full w-full gap-4">
            <ColumnChart range={range} />
            <div className='grid grid-rows-3 gap-4 w-full px-5'>  
                <Card category="Current Sales" value={formatCurrency(summary.total_sales)} color="#B82132" />
                <Card category="Current Expenses" value={formatCurrency(summary.total_expenses)} color="#B82132" />
                <Card category="Net Profit" value={formatCurrency(summary.net_profit)} color="#B82132" />
            </div>
          </div>
          <Footer />  
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
