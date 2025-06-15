import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';

function ProductFormWithHookForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Convert price and stock to numbers
      const productData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock)
      };
      
      await dispatch(createProduct(productData)).unwrap();
      toast.success('Product created successfully!');
      reset(); // Reset form
    } catch (error) {
      toast.error(error || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full border p-2 rounded"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
        
        <div>
          <label className="block">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required', min: 0 })}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>
        
        <div>
          <label className="block">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="beauty">Beauty & Personal Care</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>
        
        <div>
          <label className="block">Stock</label>
          <input
            type="number"
            {...register('stock', { required: 'Stock is required', min: 0 })}
            className="w-full border p-2 rounded"
          />
          {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
        </div>
        
        <div>
          <label className="block">Image URL</label>
          <input
            type="text"
            {...register('image')}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductFormWithHookForm;