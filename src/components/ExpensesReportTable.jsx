import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const ExpensesReportTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetch('/data/expensesReport.json')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'description',
        header: 'Description',
        cell: info => info.getValue(),
        size: 190,
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
  });

  return (
    <div className="h-[455px] w-full p-1">
      <div className="flex items-center justify-end h-[35px] w-full mb-2">
        <div className='flex items-center gap-2 h-[37px] ml-4'>
          <label className='text-[15px]'>Filter by date:</label>
          <input
            type="date"
            id="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="h-[35px] px-3 py-2 border border-gray-500 rounded-sm shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate('')}
              className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="h-full overflow-auto rounded-lg border border-gray-200">
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
                      style={{
                        width: cell.column.getSize(),
                      }}
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
          </tbody>
          {/* Footer with Total Sales */}
          <tfoot className="sticky bottom-0 bg-secondary">
            <tr>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Total Expenses
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                ₱{totalSalesAmount.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpensesReportTable;
