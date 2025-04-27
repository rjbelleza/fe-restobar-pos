import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, Search, X, PencilLine, Eye } from 'lucide-react';

const OtherProduct = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [globalFilter, setGlobalFilter] = useState('');
  const [addItem, setAddItem] = useState(false);

  useEffect(() => {
    fetch('/data/otherProduct.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleUpdateClick = (row) => {
    setSelectedRow({ ...row.original });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const updated = data.map((item, index) =>
      index === selectedRow.index ? selectedRow : item
    );
    setData(updated);
    setShowUpdateModal(false);
    setSelectedRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'price' ? parseFloat(value) || 0 : value;

    if (selectedRow) {
      setSelectedRow(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      name: newItem.name,
      price: Number(newItem.price),
    };
    setData(prev => [...prev, newEntry]);
    setAddItem(false);
    setNewItem({ name: '', price: '' });
  };

  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const columns = useMemo(() => [
    {
      id: 'rowNumber',
      header: '#',
      cell: ({ row }) => row.index + 1,
      size: 50,
    },
    {
      accessorKey: 'name',
      header: 'Name',
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
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className='space-x-2'>
            <button

              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => handleUpdateClick(row)}
              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
            >
              <PencilLine size={15} />
            </button>
            <button
            
              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
            >
              <X size={15} />
            </button>
          </div>
      ),
      size: 20,
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return row.getValue('name').toLowerCase().includes(search);
    },
  });

  return (
    <div className="h-[455px] w-full p-1 mt-[-35px]">
      {/* Search and Add */}
      <div className='flex items-center justify-end h-[35px] w-full mb-2'>
        <Search className='mr-[-30px] text-primary' />
        <input
          type='text'
          placeholder='Search Item by name'
          className='text-[13px] h-[35px] border border-black pl-9 pr-2 py-1 rounded-sm'
          value={globalFilter}
          onChange={handleSearchChange}
        />
        <div className="flex justify-end ml-2">
          <button
            onClick={() => setAddItem(true)}
            className="flex items-center gap-2 h-[35px] bg-primary text-white font-medium px-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
          >
            <CirclePlus />
            Add New Item
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {addItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              ADD NEW ITEM
              <button onClick={() => setAddItem(false)} className="text-gray-800 hover:text-gray-600">
                <X size={20} />
              </button>
            </p>
            <form className="flex flex-col" onSubmit={handleAddSubmit}>
              <label className="text-[15px] mb-2">Item Name</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                min={0}
                required
              />
              <button type="submit" className="bg-primary text-white font-medium py-3 rounded-sm hover:bg-mustard hover:text-black">
                ADD NEW ITEM 
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedRow && (
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
          className="fixed inset-0 flex items-center justify-center z-1000"
        >
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className='flex justify-between text-[19px] font-medium text-primary mb-8'>
              UPDATE MAIN DISH
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
              
              <label className='text-[15px] mb-2'>Price</label>
              <input 
                type='number'
                name="price"
                value={selectedRow.price.toFixed(2) || ''}
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

export default OtherProduct;
