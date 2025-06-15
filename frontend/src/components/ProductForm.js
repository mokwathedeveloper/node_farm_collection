import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';
import api from '../config/api';

function ProductForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Create form data for upload
    const formData = new FormData();
    formData.append('image', file);
    
    setUploadingImage(true);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success('Product created successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
      setImagePreview(null);
    } catch (error) {
      toast.error(error || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="4"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded p-2"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="beauty">Beauty & Personal Care</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Product Image</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded p-2"
            />
            {uploadingImage && <span className="text-blue-500">Uploading...</span>}
          </div>
          
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-40 object-contain border rounded p-1" 
              />
            </div>
          )}
          
          {!imagePreview && formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Product" 
                className="h-40 object-contain border rounded p-1" 
              />
            </div>
          )}
          
          <div className="mt-2">
            <label className="block text-gray-700 mb-1">Or enter image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading || uploadingImage}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
