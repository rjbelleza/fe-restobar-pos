import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, Search, X, PencilLine, Trash } from 'lucide-react';
import ComponentLoading from './ComponentLoading';
import api from '../api/axios';
import Snackbar from './Snackbar';

const UsersListTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ 
    lname: '', 
    fname: '', 
    mname: '', 
    username: '', 
    role: 'admin',
    password: '' 
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [addUser, setAddUser] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [responseStatus, setResponseStatus] = useState('');

  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/user/update/${selectedRow.id}`, selectedRow);
      setRefreshKey(prev => prev + 1);
      setShowUpdateModal(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedRow) {
      setSelectedRow(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/add', newUser);
      setNewUser({
        fname: '',
        lname: '', 
        mname: '',
        username: '',
        password: '',
        role: 'admin'
      });
      setRefreshKey(prev => prev + 1);
      setMessage(res.response.message);
      setResponseStatus('success');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Error adding user');
      setResponseStatus(e.response.data.status)
    } finally {
      setShowSnackbar(true);
      setAddUser(false);
    }
  }

  const handleDeleteClick = (row) => {
    setUserIdToDelete(row.original.id);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await api.put(`/user/${userIdToDelete}/disable`);
      setRefreshKey(prev => prev + 1);
      setMessage('User deleted successfully');
      setResponseStatus('success');
      setShowSnackbar(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting user');
      setShowSnackbar(true);
      setResponseStatus('error');
    } finally {
      setDeleteModal(false);
      setUserIdToDelete(null);
    }
  };

  useEffect(() => {
    // Fetch Users data from server
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setMessage(err.response?.data?.message || 'Error fetching users');
        setShowSnackbar(true);
      }
    }
    fetchUsers();
  }, [refreshKey]);

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

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
      accessorKey: 'fname',
      header: 'First Name',
      cell: info => info.getValue(),
      size: 190,
    },
    {
      accessorKey: 'lname',
      header: 'Last Name',
      cell: info => info.getValue(),
      size: 190,
    },
    {
      accessorKey: 'mname',
      header: 'Middle Name',
      cell: info => info.getValue(),
      size: 190,
    },
    {
      accessorKey: 'username',
      header: 'User Name',
      cell: info => info.getValue(),
      size: 190,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: info => info.getValue(),
      size: 190,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex w-full gap-2'>
          <button
              onClick={() => handleUpdateClick(row)}
              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-3 py-2"
            >
              <PencilLine size={15} />
          </button>
          <button
              onClick={() => handleDeleteClick(row)}
              className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-3 py-2"
            >
              <Trash size={15} />
          </button>
        </div>
      ),
      size: 40,
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
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(search);
    },
  });

  return (
    <div className="h-[455px] w-full p-1">
      {/* Snackbar for messages */}
      {showSnackbar && (
          <Snackbar 
            message={message}
            type={responseStatus}
            onClose={() => setShowSnackbar(false)}
          />
        )}

      {/* Search and Add */}
      <div className='flex items-center justify-end h-[35px] w-full mb-2'>
        <Search className='mr-[-30px] text-primary' />
        <input
          type='text'
          placeholder='Search user by name'
          className='text-[13px] h-[35px] border border-black pl-9 pr-2 py-1 rounded-sm'
          value={globalFilter}
          onChange={handleSearchChange}
        />
        <div className="flex justify-end ml-2">
          <button
            onClick={() => setAddUser(true)}
            className="flex items-center gap-2 h-[35px] bg-primary text-white font-medium px-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
          >
            <CirclePlus />
            Add New User
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 rounded-sm shadow-lg w-[300px]">
            <div className='flex justify-center w-full'>
              <p>Are you sure you want to delete this user?</p>
            </div>
            <div className='flex justify-end gap-2 w-full mt-5'>
              <button 
                onClick={handleDeleteUser}
                className="bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
              >
                Delete
              </button>
              <button 
                onClick={() => {
                  setDeleteModal(false);
                  setUserIdToDelete(null);
                }}
                className="bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-30 pb-10 scrollbar-thin overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              ADD NEW USER
              <button
                type='button' 
                onClick={() => setAddUser(false)} 
                className="text-gray-800 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </p>
            <form className="flex flex-col" onSubmit={handleAddUser}>
              <label className="text-[15px] mb-2">Last Name</label>
              <input
                type="text"
                name="lname"
                value={newUser.lname}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">First Name</label>
              <input
                type="text"
                name="fname"
                value={newUser.fname}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Middle Initial</label>
              <input
                type="text"
                name="mname"
                value={newUser.mname}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
              />
              <label className="text-[15px] mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Role</label>
              <select 
                name='role' 
                value={newUser.role}
                onChange={handleInputChange}
                className='mb-7 text-[17px] border border-gray-500 px-5 py-1 rounded-sm'
              >
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
              </select>
              <label className="text-[15px] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <button type="submit" className="bg-primary text-white font-medium py-3 rounded-sm hover:bg-mustard hover:text-black">
                ADD NEW USER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white p-7 px-20 pb-10 rounded-sm shadow-lg">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8">
              EDIT USER
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-800 hover:text-gray-600">
                <X size={20} />
              </button>
            </p>
            <form className="flex flex-col" onSubmit={handleUpdateSubmit}>
              <label className="text-[15px] mb-2">Last Name</label>
              <input
                type="text"
                name="lname"
                value={selectedRow.lname || ''}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">First Name</label>
              <input
                type="text"
                name="fname"
                value={selectedRow.fname || ''}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Middle Name</label>
              <input
                type="text"
                name="mname"
                value={selectedRow.mname || ''}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
              />
              <label className="text-[15px] mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={selectedRow.username || ''}
                onChange={handleInputChange}
                className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                required
              />
              <label className="text-[15px] mb-2">Role</label>
              <select 
                name='role' 
                value={selectedRow.role || 'admin'}
                onChange={handleInputChange}
                className='mb-7 text-[17px] border border-gray-500 px-5 py-1 rounded-sm'
              >
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
              </select>
              <button type="submit" className="bg-primary text-white font-medium py-3 rounded-sm hover:bg-mustard hover:text-black">
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
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-gray-200"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer flex items-center' : 'flex items-center'}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-600 font-medium border border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  {loading ? <ComponentLoading /> : 'No users found'}
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

export default UsersListTable;
