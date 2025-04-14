import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus } from 'lucide-react';
import { Search } from 'lucide-react';
import { X } from 'lucide-react';

const BeverageTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Update button handler
  const handleUpdateClick = (row) => {
    setSelectedRow(row.original); // Store the entire row data
    setShowUpdateModal(true);
  };

  // Update modal submit handler
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the data
    console.log('Updated data:', selectedRow);
    setShowUpdateModal(false);
  };

  // Update modal input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stockColorCode = (stock_quantity) => {
    if(stock_quantity <= 25) {
        return 'bg-red-500'
    } 
    else if(stock_quantity > 25 && stock_quantity <= 50) {
        return 'bg-yellow-500'
    }
    else {
        return 'bg-green-500'
    }
  }


  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  useEffect(() => {
    fetch('/data/beverage.json')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
        size: 50,
        accessorFn: (row, index) => index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        accessorKey: 'stock',
        header: 'Quantity',
        cell: info => <p className={`${stockColorCode(info.getValue())} text-white py-1 px-3 w-[48px]`}>{info.getValue()}</p>,
        size: 160,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <button 
            onClick={() => handleUpdateClick(row)}
            className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
          >
            Update
          </button>
        ),
        size: 20,
      },
    ],
    []
  );

  // Initialize the table
  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="h-[455px] w-full p-1 mt-[-35px]">
        <div className='flex items-center justify-end h-[35px] w-full mb-2'>
            <Search className='mr-[-30px] text-primary' />
            <input 
                type='text' 
                placeholder='Search product by name' 
                className='text-[13px] h-[35px] border border-black pl-9 pr-2 py-1 rounded-sm' 
            />
        </div>

      {/* Update Modal */}
      {showUpdateModal && selectedRow && (
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
          className="fixed inset-0 flex items-center justify-center z-1000"
        >
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className='flex justify-between text-[19px] font-medium text-primary mb-8'>
              UPDATE INGREDIENTS
              <span className='text-gray-800 hover:text-gray-600 font-normal'>
                <button 
                  onClick={() => setShowUpdateModal(false)}
                  className='cursor-pointer'
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <form className='flex flex-col' onSubmit={handleUpdateSubmit}>
              <label className='text-[15px] mb-2'>Product Name</label>
              <input 
                type='text'
                name="name"
                value={selectedRow.name || ''}
                onChange={handleInputChange}
                className='w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7'                      
              />
              
              <label className='text-[15px] mb-2'>Quantity</label>
              <input 
                type='number'
                name="stock"
                value={selectedRow.stock || ''}
                onChange={handleInputChange}
                className='w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7'                       
                min={0}
              />
              
              <button 
                type='submit'
                className='bg-primary text-white font-medium py-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black'
              >
                UPDATE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="h-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-gray-200"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : 'flex items-center',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
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
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="px-4 py-3 text-sm text-gray-600 font-medium border border-gray-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  data.length
                )}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">First</span>
                &laquo;
              </button>
              <button
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Last</span>
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeverageTable;
