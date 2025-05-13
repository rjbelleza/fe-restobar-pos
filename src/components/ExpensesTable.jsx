import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, Calendar, X } from 'lucide-react';
import api from '../api/axios';
import Snackbar from '../components/Snackbar';
import Loading from '../components/Loading';

const ExpensesTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [addExpense, setAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ 
    description: '', 
    date: new Date().toISOString().split('T')[0], // Default to current date
    time: new Date().toTimeString().substring(0, 5),
    total_amount: '' // Default to current time (HH:MM)
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRangeModal, setDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const currentDateTime = new Date();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev, 
      [name]: name === 'total_amount' 
          ? value === '' || /^[0-9]*\.?[0-9]*$/.test(value) ? value : prev[name] 
          : value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/expenses/create', newExpense);
      setAddExpense(false);
      setKeyTrigger(prev => prev + 1);
    } catch (err) {
      setMessage('Error adding expenses');
      setResponseStatus('error');
      setShowSnackbar(true);
    } finally {
      setNewExpense({ 
        description: '', 
        date: currentDateTime.toISOString().split('T')[0],
        time: currentDateTime.toTimeString().substring(0, 5),
        total_amount: ''
      });
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses/fetch', {
          params: {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize
          }
        });
        setData(res.data?.data);
        setPageCount(res.data?.last_page || 0);
        setTotalRecords(res.data?.total || 0);
      } catch (err) { 
        setMessage('Error fetching expenses');
        setResponseStatus('error');
        setShowSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [keyTrigger,pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => (pagination.pageIndex * pagination.pageSize) + row.index + 1,
        accessorFn: (row, index) => index + 1,
        size: 50,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        accessorKey: 'total_amount',
        header: 'Total Amount',
        cell: info => `₱ ${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'created_at',
        header: 'Date & Time',
        cell: info => info.getValue(),
        size: 160,
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="h-[455px] w-full p-1">

      {showSnackbar && (
        <Snackbar 
          message={message && message}
          type={responseStatus}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      <div className="flex items-center justify-between h-[35px] w-full mb-2 pr-4">
        <div>
          {startDate && endDate && (
            <p>Sales from <span className='font-medium'>{startDate}</span><span> to <span className='font-medium'>{endDate}</span></span></p>
          )}
        </div>
        <div className='flex'>
          <div className='flex items-center gap-2 h-[37px] ml-4'>
            <button 
              onClick={() => setDateRangeModal(true)}
              className='flex items-center gap-3 bg-primary text-white text-[14px] font-medium px-4 py-2 rounded-sm cursor-pointer hover:bg-mustard hover:text-black'
            >
              <Calendar size={18} />
              Select Date Range
            </button>
          </div>
          <div className="flex justify-end ml-2">
            <button
              onClick={() => setAddExpense(true)}
              className="flex items-center gap-2 h-[37px] bg-primary text-white font-medium px-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
            >
              <CirclePlus />
              Add New Expense
            </button>
          </div>
        </div>
      </div>

      {dateRangeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="w-[400px] bg-white p-7 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              SELECT DATE RANGE
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setDateRangeModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <form className='flex flex-col w-full'>
              <label htmlFor='start_date' className='w-full mb-2'>Start Date</label>
              <input 
                id='start_date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='border border-black px-5 py-2 mb-10 rounded-sm'
              />
              <label htmlFor='end_date' className='w-full mb-2'>End Date</label>
              <input 
                id='end_date'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='border border-black px-5 py-2 mb-10 rounded-sm'
              />
              <div className='flex gap-2 w-full'>
                <button 
                  type='button'
                  onClick={() => {setStartDate(''); setEndDate('')}}
                  className='bg-primary text-white w-full hover:bg-mustard hover:text-black px-3 py-2 rounded-sm cursor-pointer'
                >
                  Clear
                </button>
                <button 
                  type='button'
                  onClick={() => setDateRangeModal(false)}
                  className='bg-primary text-white w-full hover:bg-mustard hover:text-black px-3 py-2 rounded-sm cursor-pointer'
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {addExpense && (
        <div className="fixed inset-0 flex items-center justify-center z-1000" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              ADD EXPENSE
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button onClick={() => setAddExpense(false)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </span>
            </p>
            <form className="flex flex-col" onSubmit={handleAddSubmit}>
              <label className="text-[15px] mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                className="w-full text-[17px] border border-gray-500 px-3 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Amount</label>
              <input
                type="text"
                name="total_amount"
                value={newExpense.total_amount}
                onChange={handleInputChange}
                className="w-full text-[17px] border border-gray-500 px-3 py-1 rounded-sm mb-7"
                required
              />
              
              <div className="flex gap-4 mb-7">
                <div className="flex flex-col">
                  <label className="text-[15px] mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="w-[150px] text-[17px] border border-gray-500 px-3 py-1 rounded-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[15px] mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={newExpense.time}
                    onChange={handleInputChange}
                    className="w-[150px] text-[17px] border border-gray-500 px-3 py-1 rounded-sm"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-primary text-white font-medium py-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
              >
                ADD NEW EXPENSE
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Table */}
      <div className="min-h-[450px] max-h-[450px] overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-gray-200"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : 'flex items-center'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <span className="ml-2">↑</span>,
                          desc: <span className="ml-2">↓</span>,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-600 font-medium border border-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  {loading ? <Loading /> : 'No expenses found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="ml-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                totalRecords
              )}
            </span>{' '}
            of <span className="font-medium">{totalRecords}</span> results
          </p>
          <div>
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                &laquo;
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() =>
                  table.setPageIndex(table.getPageCount() - 1)
                }
                disabled={!table.getCanNextPage()}
                className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesTable;
