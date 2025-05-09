import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, Search, X, Settings, PencilLine, Trash } from 'lucide-react';
import api from '../api/axios';
import Snackbar from '../components/Snackbar';

const BeverageTable = ({openSettingsModal}) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [addBeverage, setAddBeverage] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newBeverage, setNewBeverage] = useState({ name: '', stock: '', category: 'beverages' });
  const [globalFilter, setGlobalFilter] = useState('');
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');

  const [updateBeverage, setUpdateBeverage] = useState({
    name: '',
    stock: 0,
  });

  useEffect(() => {
    if (selectedRow) {
      setUpdateBeverage({
        name: selectedRow.name || '',
        stock: selectedRow.stock || 0,
      });
    }
  }, [selectedRow]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateBeverage(prev => ({
      ...prev, 
      [name]: name === 'stock' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();    
    try {
        if (!selectedRow || !selectedRow.id) {
            return;
        }

        const response = await api.put(`/beverage/update/${selectedRow.id}`, updateBeverage);
        setMessage(response.data?.message);
        setResponseStatus(response.data?.status);
        setShowUpdateModal(false);
        setShowSnackbar(true);
        setKeyTrigger(prev => prev + 1);
    } catch (error) {
        setMessage(error.response?.data?.message);
        setResponseStatus(error.response?.data?.status);
        setShowUpdateModal(false);
        setShowSnackbar(true);
    }
  };

  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row.original);
    setShowDeleteModal(true);
  };

  const deleteBeverage = async () => {
    try {
      const response = await api.patch(`/beverage/delete/${selectedRow.id}`);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowSnackbar(true);
      setKeyTrigger(prev => prev + 1);
      setShowDeleteModal(false);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const updatedData = data.map(item =>
      item.name === selectedRow.name ? selectedRow : item
    );
    setData(updatedData);
    setShowUpdateModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showUpdateModal) {
      setSelectedRow(prev => ({ ...prev, [name]: value }));
    } else {
      setNewBeverage(prev => ({ 
        ...prev, [name]: name === 'stock' 
                       ? value === '' || /^[0-9]*\.?[0-9]*$/.test(value) ? value : prev[name] 
                       : value
      }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/beverage', newBeverage);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowSnackbar(true);
      setAddBeverage(false);
      setKeyTrigger(prev => prev + 1);
      setNewBeverage({ name: '', stock: '' , category: 'beverages'});
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
    }
  };

  const stockColorCode = (stock_quantity) => {
    if (stock_quantity <= 25) return 'bg-red-500';
    else return 'bg-green-500';
  };

  const fetchBeverage = async () => {
    try {
      const response = await api.get('/beverages');
      setData(response.data?.data);
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeverage();
  }, [keyTrigger]);

  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
        accessorFn: (row, index) => index + 1,
        size: 50,
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
        cell: info => (
          <p className={`${stockColorCode(info.getValue())} text-white py-1 px-3 w-[48px]`}>
            {info.getValue()}
          </p>
        ),
        size: 160,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
                onClick={() => handleUpdateClick(row)}
                className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
              >
                <PencilLine size={15} />
            </button>
            <button
              onClick={() => handleDeleteClick(row)}
              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
            >
              <Trash size={15} />
            </button>
          </div>
        ),
        size: 20,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
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
    <div className="h-[455px] w-full p-1 mt-[-35px]">

    {showSnackbar && (
      <Snackbar 
        message={message && message}
        type={responseStatus}
        onClose={() => setShowSnackbar(false)}
      />
    )}

      <div className="flex items-center justify-end h-[35px] w-full mb-2">
      <p className='mr-2 text-[15px] font-medium'>Legend:</p>
        <p className='px-3 py-1 bg-green-500 rounded-sm text-[14px] font-medium mr-2'>High Stock</p>
        <p className='px-3 py-1 bg-red-500 rounded-sm text-[14px] font-medium mr-5'>Low Stock</p>
        <div className='relative'>
          <Search className="text-primary absolute top-1 left-2" />
          <input
            type="text"
            placeholder="Search ingredient by name"
            className="text-[13px] h-[35px] w-[205px] border border-black pl-9 pr-3 py-1 rounded-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex justify-end ml-2 gap-2">
          <button
            onClick={() => setAddBeverage(true)}
            className="flex items-center gap-2 h-[35px] bg-primary text-white font-medium px-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
          >
            <CirclePlus />
            Add New Beverage  
          </button>
          <button 
            onClick={() => openSettingsModal(true)}
            className='bg-primary px-3 rounded-sm cursor-pointer hover:bg-mustard'>
            <Settings className='text-white hover:text-black' />
          </button>
        </div>
      </div>

      {showDeleteModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-50"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
        <div className="bg-white p-7 rounded-sm shadow-lg w-[350px]">
          <div className='flex justify-center w-full'>
            <p>Are you sure to delete this beverage?</p>
          </div>
          <div className='flex justify-end gap-2 w-full mt-5'>
            <button
              onClick={deleteBeverage} 
              className='bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black'>
              Yes
            </button>
            <button 
                onClick={() => setShowDeleteModal(false)}
                className='bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black'>
              No
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Add Beverage Modal */}
      {addBeverage && (
        <div className="fixed inset-0 flex items-center justify-center z-1000" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              ADD NEW BEVERAGE
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button onClick={() => setAddBeverage(false)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </span>
            </p>
            <form className="flex flex-col" onSubmit={handleAddSubmit}>
              <label className="text-[15px] mb-2">Beverage Name</label>
              <input
                type="text"
                name="name"
                value={newBeverage.name}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Quantity</label>
              <input
                type="text"
                name="stock"
                value={newBeverage.stock}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                min={0}
                required
              />
              <button
                type="submit"
                className="bg-primary text-white font-medium py-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
              >
                ADD NEW BEVERAGE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* (Update modal remains unchanged) */}
      {showUpdateModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-1000" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              UPDATE INGREDIENTS
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button onClick={() => setShowUpdateModal(false)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </span>
            </p>
            <form className="flex flex-col" onSubmit={handleSaveUpdate}>
              <label className="text-[15px] mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={updateBeverage.name}
                onChange={handleUpdateChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
              />
              <label className="text-[15px] mb-2">Quantity</label>
              <input
                type="number"
                name="stock"
                value={updateBeverage.stock}
                onChange={handleUpdateChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                min={0}
              />
              <button
                type="submit"
                className="bg-primary text-white font-medium py-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
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
                  {loading ? 'Fetching beverages...' : 'No beverages available'}
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
