import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, Search, X, PencilLine, CircleMinus } from 'lucide-react';
import api from '../../api/axios';
import Snackbar from '../Snackbar';

const MainDish = () => {
  const [data, setData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showDishModal, setShowDishModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDish, setCurrentDish] = useState({ 
    id: '',
    name: '', 
    price: '', 
    category: 'main_dish', 
    image: null,
    imagePath: '',
    ingredients: [] 
  });
  const [ingredientQuantities, setIngredientQuantities] = useState({});
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ingredients.length > 0) {
      const initialQuantities = {};
      ingredients.forEach(ing => {
        initialQuantities[ing.id] = 0;
      });
      setIngredientQuantities(initialQuantities);
    }
  }, [ingredients]);

  const handleIncrement = (ingredientId) => {
    const currentQuantity = ingredientQuantities[ingredientId] || 0;
    const newQuantity = currentQuantity + 1;
    
    setIngredientQuantities(prev => ({ ...prev, [ingredientId]: newQuantity }));
    
    if (currentQuantity === 0) {
      setCurrentDish(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { id: ingredientId, quantity: newQuantity }]
      }));
    } else {
      setCurrentDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(i => 
          i.id === ingredientId ? { ...i, quantity: newQuantity } : i
        )
      }));
    }
  };

  const handleDecrement = (ingredientId) => {
    const currentQuantity = ingredientQuantities[ingredientId] || 0;
    const newQuantity = Math.max(0, currentQuantity - 1);
    
    setIngredientQuantities(prev => ({ ...prev, [ingredientId]: newQuantity }));
    
    if (newQuantity === 0) {
      setCurrentDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(i => i.id !== ingredientId)
      }));
    } else {
      setCurrentDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(i => 
          i.id === ingredientId ? { ...i, quantity: newQuantity } : i
        )
      }));
    }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', currentDish.name);
    formData.append('price', currentDish.price);
    formData.append('category', currentDish.category);
    
    if (currentDish.image) {
      formData.append('image', currentDish.image); 
    }

    currentDish.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][id]`, ingredient.id);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    try {
      let response;
      if (isEditing) {
        formData.append('_method', 'PUT');
        response = await api.post(`/product/update/${currentDish.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/product/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setMessage(isEditing ? 'Dish updated successfully' : 'Dish added successfully');
      setResponseStatus(response.data?.status || 'success');
      setShowSnackbar(true);
      setShowDishModal(false);
      setKeyTrigger(prev => prev + 1);
      resetDishForm();
    } catch (error) {
      setMessage(error.response?.data?.message || (isEditing ? 'Error updating dish' : 'Error adding dish'));
      setResponseStatus(error.response?.data?.status || 'error');
      setShowSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDishForm = () => {
    setCurrentDish({ 
      id: '',
      name: '', 
      price: '', 
      category: 'main_dish', 
      image: null,
      imagePath: '',
      ingredients: [] 
    });
    setIngredientQuantities({});
    setIsEditing(false);
    setImageChanged(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files?.length > 0) {
      setImageChanged(true);
      setCurrentDish(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setCurrentDish(prev => ({
        ...prev,
        [name]: name === 'price' 
          ? value === '' || /^[0-9]*\.?[0-9]*$/.test(value) ? value : prev[name] 
          : value
      }));
    }
  };

  const handleEditClick = (row) => {
    const dish = row.original;
    const quantities = {};
    const dishIngredients = dish.ingredients || [];
    
    // Fix: Make sure we're correctly accessing the ingredient ID and quantity
    dishIngredients.forEach(ing => {
      // Check the structure of your ingredient object and use the correct property
      // If the ingredient object has ingredient_id or ingredient.id, use that
      const ingredientId = ing.ingredient_id || ing.ingredient?.id || ing.id;
      quantities[ingredientId] = ing.pivot?.quantity || ing.quantity || 0;
    });

    // Convert ingredients array to the expected format for currentDish
    const formattedIngredients = dishIngredients.map(ing => {
      const ingredientId = ing.ingredient_id || ing.ingredient?.id || ing.id;
      return {
        id: ingredientId,
        quantity: ing.pivot?.quantity || ing.quantity || 0
      };
    });

    setCurrentDish({
      id: dish.id,
      name: dish.name,
      price: dish.price.toString(),
      category: dish.category,
      imagePath: dish.image,
      image: null,
      ingredients: formattedIngredients
    });
    
    setIngredientQuantities(quantities);
    setIsEditing(true);
    setShowDishModal(true);
    setImageChanged(false);

    // Debug: Log the quantities and ingredients to help troubleshoot
    console.log('Dish ingredients:', dishIngredients);
    console.log('Formatted ingredients:', formattedIngredients);
    console.log('Ingredient quantities:', quantities);
  };

  const handleDeleteClick = (row) => {
    setCurrentDish(row.original);
    setShowDeleteModal(true);
  };

  const deleteDish = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.patch(`/product/disable/${currentDish.id}`);
      setMessage('Dish deleted successfully');
      setResponseStatus(response.data?.status || 'success');
      setShowSnackbar(true);
      setShowDeleteModal(false);
      setKeyTrigger(prev => prev + 1);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting dish');
      setResponseStatus(error.response?.data?.status || 'error');
      setShowSnackbar(true);
    } finally {
      setShowDeleteModal(false);
      setIsSubmitting(false);
    }
  };

  const fetchMainDish = async () => {
    try {
      const response = await api.get('/product/fetch', {
        params: {
          category: 'main_dish'
        }
      });
      setData(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching dishes');
      setResponseStatus(error.response?.data?.status || 'error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/ingredient/fetch');
      setIngredients(response.data)
    } catch (err) {
      setResponseStatus(err.response?.data?.status);
      setMessage(err.response?.data?.message)
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainDish();
    fetchIngredients();
  }, [keyTrigger]);

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
      cell: info => "₱" + info.getValue(),
      size: 160,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className='space-x-2'>
          <button
            onClick={() => handleEditClick(row)}
            disabled={isSubmitting}
            className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2 disabled:opacity-50"
          >
            <PencilLine size={15} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            disabled={isSubmitting}
            className="text-white bg-primary hover:bg-mustard hover:text-black cursor-pointer rounded-sm px-2 py-2 disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>
      ),
      size: 20,
    },
  ], [isSubmitting]);

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
    <div className="h-[455px] w-full p-1 mt-[-35px]">
      
      {showSnackbar && (
        <Snackbar 
          message={message}
          type={responseStatus}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      {/* Search and Add */}
      <div className='flex items-center justify-end h-[35px] w-full mb-2'>
        <div className='relative'>
          <Search className='absolute left-3 top-2 text-primary' />
          <input
            type='text'
            placeholder='Search dish by name'
            className='text-[13px] h-[35px] border border-black pl-9 pr-2 py-1 rounded-sm'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex justify-end ml-2">
          <button
            onClick={() => {
              resetDishForm();
              setShowDishModal(true);
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 h-[35px] bg-primary text-white font-medium px-3 rounded-sm cursor-pointer hover:bg-mustard hover:text-black disabled:opacity-50"
          >
            <CirclePlus />
            Add New Dish
          </button>
        </div>
      </div>

      {/* Dish Modal (Add/Edit) */}
      {showDishModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
          <div className="bg-white max-h-[600px] min-h-[500px] px-5 pt-5 rounded-sm shadow-lg overfloy-auto scrollbar-thin">
            <p className="flex justify-between text-[19px] font-medium text-primary mb-8 pl-5">
              {isEditing ? 'UPDATE DISH' : 'ADD NEW DISH'}
              <button 
                onClick={() => {
                  setShowDishModal(false);
                  resetDishForm();
                }} 
                disabled={isSubmitting}
                className="text-gray-800 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
              >
                <X size={20} />
              </button>
            </p>
            <form className="flex flex-col h-full" onSubmit={handleDishSubmit} encType="multipart/form-data">
              <div className='flex gap-40 mb-15'>
                <div className='flex flex-col'>
                  <label className="text-[15px] mb-2">Dish Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentDish.name}
                    onChange={handleInputChange}
                    className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                    required
                    disabled={isSubmitting}
                  />
                  <label className="text-[15px] mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={currentDish.price}
                    onChange={handleInputChange}
                    className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-[300px] text-[17px] border border-gray-500 px-5 py-1 rounded-sm mb-7 cursor-pointer"
                    required={!isEditing}
                    disabled={isSubmitting}
                  />
                </div>
                <div className='w-full min-w-[350px] max-h-[300px] min-h-[300px] overflow-y-auto scrollbar-thin'>
                  <p className='mb-10 sticky top-0 bg-white text-primary font-medium pb-5'>
                      INGREDIENTS
                      <span className='ml-15 text-black'>
                        <input 
                          type='text'
                          className='text-[13px] border border-gray-500 px-3 py-1 rounded-sm w-[150px]'
                          placeholder='Search...'
                          value={ingredientSearch}
                          onChange={(e) => setIngredientSearch(e.target.value)}
                        />
                      </span>
                  </p>
                  {ingredients
                  .filter(i => i.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
                  .map((i) => (
                    <div key={i.id} className='grid grid-cols-2 min-w-[150px] mb-5'>
                      <p>{i.name}</p>
                      <div className='w-fit flex gap-2'>
                        <button 
                          type='button' 
                          onClick={() => handleDecrement(i.id)}
                          disabled={isSubmitting || ingredientQuantities[i.id] === 0}
                          className="cursor-pointer"
                        >
                          <CircleMinus size={25} className={`rounded-full ${ingredientQuantities[i.id] > 0 ? 'text-black' : 'text-gray-300'}`} />
                        </button>
                        <input 
                          type='text'
                          min="0"
                          value={ingredientQuantities[i.id] || 0}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            if (newValue > ingredientQuantities[i.id]) {
                              handleIncrement(i.id);
                            } else if (newValue < ingredientQuantities[i.id]) {
                              handleDecrement(i.id);
                            }
                          }}
                          className='w-[35px] text-[15px] px-3 font-medium py-1 rounded-sm'
                          disabled={isSubmitting}
                          readOnly
                        />
                        <button 
                          type='button' 
                          onClick={() => handleIncrement(i.id)}
                          disabled={isSubmitting}
                          className="cursor-pointer"
                        >
                          <CirclePlus size={25} className='rounded-full text-black' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-primary text-white font-medium py-3 cursor-pointer rounded-sm hover:bg-mustard hover:text-black"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? isEditing 
                    ? 'UPDATING...' 
                    : 'ADDING...'
                  : isEditing 
                    ? 'UPDATE DISH' 
                    : 'ADD NEW DISH'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
        <div className="bg-white p-7 rounded-sm shadow-lg w-[350px]">
          <div className='flex justify-center w-full'>
            <p>Are you sure to delete this dish?</p>
          </div>
          <div className='flex justify-end gap-2 w-full mt-5'>
            <button 
              onClick={deleteDish}
              disabled={isSubmitting}
              className='bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black disabled:opacity-50'>
              {isSubmitting ? 'Processing...' : 'Yes'}
            </button>
            <button 
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
              className='bg-primary px-3 py-1 text-white rounded-sm cursor-pointer hover:bg-mustard hover:text-black disabled:opacity-50'>
              No
            </button>
          </div>
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
                  {loading ? 'Fetching main dishes...' : 'No main dish available'}
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

export default MainDish;
