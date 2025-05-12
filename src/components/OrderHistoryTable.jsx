import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { X, Eye } from 'lucide-react';
import api from '../api/axios';
import Snackbar from '../components/Snackbar';

const OrderHistoryTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setShowUpdateModal(true);
  };

  function capitalize(str) {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await api.get('/sales/fetch', {
          params: {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize
          }
        });
        setData(res.data?.sales?.data || []);
        setPageCount(res.data?.sales?.last_page || 0);
        setTotalRecords(res.data?.sales?.total || 0);
      } catch (err) {
        setMessage('Error fetching records');
        setResponseStatus('error');
        setShowSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [pagination.pageIndex, pagination.pageSize]);

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
        accessorKey: 'subtotal',
        header: 'Subtotal',
        cell: info => `₱ ${parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'discount',
        header: 'Discount',
        cell: info => `₱ ${parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'total_amount',
        header: 'Total Amount',
        cell: info => `₱ ${parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'order_type',
        header: 'Order Type',
        cell: info => capitalize(info.getValue()),
        size: 190,
      },
      {
        accessorKey: 'payment_method',
        header: 'Payment Method',
        cell: info => capitalize(info.getValue()),
        size: 190,
      },
      {
        accessorKey: 'amount_paid',
        header: 'Amount Paid',  
        cell: info => `₱ ${parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'change',
        header: 'Change',
        cell: info => `₱ ${parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'created_at',
        header: 'Date & Time',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <button
            onClick={() => handleUpdateClick(row)}
            className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2"
          >
            <Eye size={20} />
          </button>
        ),
        size: 20,
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
            message={message}
            type={responseStatus}
            onClose={() => setShowSnackbar(false)}
          />
        )}

      {/* View Modal */}
      {showUpdateModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-1000" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="w-[500px] bg-white px-7 py-7  pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              ORDER DETAILS
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button onClick={() => setShowUpdateModal(false)} className="cursor-pointer">
                  <X size={20} />
                </button>
              </span>
            </p>
            <table className='w-full border-collapse'>
                <thead className='rounded-md'>
                  <tr className='text-[13px] text-left rounded-md'>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Product</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Price (₱)</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Quantity</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Total Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRow.sale_items.map((s) => (
                      <tr key={s.id} className='text-[13px]'>
                        <td className='px-3 py-2 border-b border-gray-200'>{s.product.name}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{parseFloat(s.product.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{s.quantity}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{parseFloat(s.total).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="min-h-[500px] max-h-[500px] overflow-x-auto rounded-lg border border-gray-200">
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
                  {loading ? 'Fetching records...' : 'No records found'}
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

export default OrderHistoryTable;
