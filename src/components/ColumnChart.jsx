import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from '../api/axios';
import ComponentLoading from './ComponentLoading';
import Loading from '../components/Loading';

const ColumnChart = ({ range }) => {
  const [chartData, setChartData] = useState({
    sales: [],
    expenses: [],
    months: [],
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/graph-data/fetch', {
          params: { range: range }
        });
        
        if (!response.data || !response.data.status === 'success') {
          throw new Error('Invalid data format received');
        }
        
        // Transform the data for the chart
        const transformedData = {
          sales: response.data.monthlyData.map(item => item.sales),
          expenses: response.data.monthlyData.map(item => item.expenses),
          months: response.data.monthlyData.map(item => item.label),
          lastUpdated: response.data.updatedAt
        };
        
        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching chart data');
        setLoading(false);
        console.error('Error fetching chart data:', err);
      }
    };

    fetchData();
  }, [range]); // Re-fetch when range changes

  const options = {
    series: [{
      name: 'Sales',
      data: chartData.sales,
      color: '#F44336'
    }, {
      name: 'Expenses',
      data: chartData.expenses,
      color: '#FFDE59'
    }],
    chart: {
      type: 'bar',
      height: 540,
      width: 980,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.months,
      labels: {
        style: {
          colors: '#333',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true,
        color: '#78909C'
      },
      axisTicks: {
        show: true,
        color: '#78909C'
      }
    },
    yaxis: {
      title: {
        text: 'Amount (₱)',
        style: {
          color: '#333',
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          colors: '#333',
          fontSize: '12px'
        },
        formatter: function (value) {
          return '₱' + value.toLocaleString();
        }
      },
      axisBorder: {
        show: true,
        color: '#78909C'
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return '₱' + val.toLocaleString();
        }
      },
      style: {
        fontSize: '12px'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 100,
      labels: {
        colors: '#333',
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
      borderColor: '#f1f1f1'
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (loading) {
    return (
      <div className="chart-container min-w-[980px]">
        <h2>Monthly Sales & Expenses</h2>
        <div className="loading-message" style={{ width: '980px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container min-w-[980px]">
        <h2>Monthly Sales & Expenses</h2>
        <div className="error-message" style={{ width: '980px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container min-w-[980px]">
      <h2>Sales & Expenses</h2>
      <div className="chart-wrapper">
        <Chart 
          options={options} 
          series={options.series} 
          type="bar" 
          height={400} 
          width={980}
        />
      </div>
    </div>
  );
};

export default ColumnChart;
