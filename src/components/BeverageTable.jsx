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
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Update button handler
  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
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

  // Fetch data
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
        header: 'Stock qty.',
        cell: info => <p className={`${stockColorCode(info.getValue())} text-white py-1 px-3 w-[48px]`}>{info.getValue()}</p>,
        size: 160,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: info => info.getValue(),
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
      {/* Search bar */}
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
      <div className="h-full overflow-x-auto overflow-y-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          {/* Table header */}
          <thead className="bg-gray-200 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-gray-200"
                    style={{ width: header.getSize() }}
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
          
          {/* Table body */}
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
        {/* ... keep your existing pagination code ... */}
      </div>

      {/* Add product modal (keep your existing add modal) */}
      {showModal && (
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* ... keep your existing add modal content ... */}
        </div>
      )}
    </div>
  );
};

export default BeverageTable;
