import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'; 
import { Calendar, X } from 'lucide-react';

const SalesReportTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [dateRangeModal, setDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetch('/data/salesReport.json')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product_name',
        header: 'Product Name',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: info => "₱" + info.getValue().toFixed(2),
        size: 160,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: info => info.getValue(),
        size: 160,
      },
      {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: info => "₱" + info.getValue().toFixed(2),
        size: 160,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: info => info.getValue(),
        size: 160,
      }
    ],
    []
  );

  // Filter data by date and calculate total sales
  const filteredData = useMemo(() => {
    if (!searchDate) return data;
    
    return data.filter(item => {
      try {
        // Handle different date formats
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime())) return false; // Skip invalid dates
        
        const formattedItemDate = itemDate.toISOString().split('T')[0];
        return formattedItemDate === searchDate;
      } catch (e) {
        console.warn('Invalid date format for item:', item);
        return false;
      }
    });
  }, [data, searchDate]);

  const totalSalesAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  }, [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="h-[455px] w-full p-1">
      <div className="flex items-center justify-between h-[35px] w-full mb-2 pr-4">
        <div>
          {startDate && endDate && (
            <p>Sales from <span className='font-medium'>{startDate}</span><span> to <span className='font-medium'>{endDate}</span></span></p>
          )}
        </div>
        <div className='flex items-center gap-2 h-[37px] ml-4'>
            <button 
              onClick={() => setDateRangeModal(true)}
              className='flex items-center gap-3 bg-primary text-white text-[14px] font-medium px-4 py-2 rounded-sm cursor-pointer hover:bg-mustard hover:text-black'
            >
              <Calendar size={18} />
              Select Date Range
            </button>
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

      {/* Table */}
      <div className="h-full overflow-x-auto rounded-lg border border-gray-200">
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
                  No records found
                </td> 
              </tr> 
            )}
            {/* Total Sales Row */}
            {data.length > 0 && (
              <tr className="font-semibold sticky bottom-0 bg-secondary">
                <td className="px-4 py-3 text-sm text-gray-600 border border-gray-200" colSpan={3}>
                  Total Sales
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border border-gray-200">
                  ₱{totalSalesAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border border-gray-200" colSpan={1}></td>
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
            {table.getRowModel().rows.length > 0 ? (
              <>
                Showing{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    filteredData.length
                  )}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> results
              </>
            ) : (
              'No records to show'
            )}
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
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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

export default SalesReportTable;
