import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CreateProduct = ({ id }) => {
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product if ID is passed for editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/products/${id}`)
        .then((response) => {
          const product = response.data;
          setSku(product.sku || '');
          setQuantity(product.quantity || '');
          setName(product.name || '');
          setDescription(product.description || '');
          if (product.images) {
            const newPreviewImages = product.images.map(imagePath => `http://localhost:5000/${imagePath}`);
            setPreviewImages(newPreviewImages);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle image change
  useEffect(() => {
    if (images.length > 0) {
      const newPreviewImages = Array.from(images).map(image => URL.createObjectURL(image));
      setPreviewImages(newPreviewImages);
    }
  }, [images]);

  const handleImageChange = (e) => {
    const newImages = e.target.files;
    if (newImages.length > 0) {
      setImages([...newImages]);
      const newPreviewImages = Array.from(newImages).map(image => URL.createObjectURL(image));
      setPreviewImages(newPreviewImages);
    }
  };

  const handleThumbnailChange = (index) => {
    setThumbnail(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sku', sku);
    formData.append('quantity', quantity);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('thumbnailIndex', thumbnail);
  
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
  
    axios
      .post(id ? `http://localhost:5000/api/products/${id}` : 'http://localhost:5000/api/products', formData)
      .then((response) => {
        alert(id ? 'Product updated successfully' : 'Product created successfully');
        // Clear form data after success
        setSku('');
        setQuantity('');
        setName('');
        setDescription('');
        setImages([]);
        setPreviewImages([]);
      })
      .catch((error) => {
        console.error('Error saving product:', error);
        alert('Failed to save product');
      });
  };

  const handleCancel = () => {
    setSku('');
    setQuantity('');
    setName('');
    setDescription('');
  };

  const openFileUpload = () => {
    document.getElementById('file-upload').click();
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="container p-10">
        <div className="relative mb-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-left uppercase mr-3 cursor-pointer">Products</h1>
            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-4 mr-1" />
            <span className="text-md text-primaryBlue ml-3">
              {id ? 'Edit Product' : 'Create Product'}
            </span>
          </div>
        </div>

        {/* Show loading message while fetching product for editing */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-900">SKU</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    placeholder="Enter SKU"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter Product Name"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">QTY</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min={1}
                    placeholder="Enter Product Quantity"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="col-span-full relative z-0 w-full mb-5 group">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Product Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter a brief product description"
                />
              </div>

              <div className="col-span-full relative z-0 w-full mb-5 group flex items-center">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 mb-0 mr-2">Product Images</label>
                {previewImages.length > 0 && (
                  <div className="ml-6 flex">
                    {previewImages.map((src, index) => (
                      <img key={index} src={src} alt={`Preview ${index}`} className="w-20 rounded-lg ml-2" />
                    ))}
                  </div>
                )}
                <span onClick={openFileUpload} className="cursor-pointer text-primaryBlue ml-6 underline">{id ? 'Edit Images' : 'Add Images'}</span>
                <input id="file-upload" name="images" type="file" className="sr-only" onChange={handleImageChange} multiple />
              </div>

              <div className="col-span-full mb-0">
                <p className="mt-3 text-sm leading-6 text-gray-500">JPEG, PNG, SVG, or GIF (Maximum file size 50MB)</p>
              </div>
            </div>

            {previewImages.map((src, index) => (
  <div key={index} className="relative">
    <img
      src={src}
      alt={`Preview ${index}`}
      className={`w-full h-auto border ${thumbnail === index ? 'border-indigo-600' : 'border-gray-300'}`}
      onClick={() => handleThumbnailChange(index)}
    />
    {thumbnail === index && (
      <div className="absolute inset-0 bg-indigo-600 bg-opacity-50 flex items-center justify-center">
        <span className="text-white font-semibold">Thumbnail</span>
      </div>
    )}
  </div>
))}

          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
