import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit, 
  Eye,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { galleryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadPreview, setUploadPreview] = useState([]);  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: ''
  });
  const [pagination, setPagination] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'festivals',
    isPublic: true,
    location: 'Temple Complex',
    date: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef(null);

  const categories = [
    { value: 'festivals', label: 'Festivals' },
    { value: 'mandir', label: 'Temple' },
    { value: 'events', label: 'Events' },
    { value: 'daily', label: 'Daily Activities' }
  ];

  useEffect(() => {
    fetchGalleries();
  }, [filters]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAdmin(filters);
      setGalleries(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };
  const handleFileSelect = (e) => {
    let files = Array.from(e.target.files);
    
    if (files.length > 20) {
      toast.error('You can only upload up to 20 images at once');
      files = files.slice(0, 20);
    }
    
    setSelectedFiles(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setUploadPreview(previews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedFiles.length) {
        toast.error('Please select at least one image');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(
        `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`
      );

      try {
        // Create separate upload for each image
        const uploadPromises = selectedFiles.map(async (file, index) => {
          const singleFormData = new FormData();
          
          // Add all form data
          Object.keys(formData).forEach(key => {
            singleFormData.append(key, formData[key]);
          });
          
          // Add numbered suffix to title if multiple images
          if (selectedFiles.length > 1) {
            singleFormData.set('title', `${formData.title} ${index + 1}`);
          }
          
          // Add single image
          singleFormData.append('images', file);

          if (editingGallery) {
            return galleryAPI.update(editingGallery._id, singleFormData);
          } else {
            return galleryAPI.create(singleFormData);
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(
          `Successfully uploaded ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`
        );

        // Reset form and close modal
        setFormData({
          title: '',
          description: '',
          category: 'festivals',
          isPublic: true,
          location: 'Temple Complex',
          date: new Date().toISOString().split('T')[0]
        });
        setSelectedFiles([]);
        setUploadPreview([]);
        setShowModal(false);
        setEditingGallery(null);
        
        // Refresh gallery list
        fetchGalleries();
      } catch (error) {
        console.error('Upload error:', error);
        toast.dismiss(loadingToast);
        toast.error('Failed to upload one or more images. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to process the form. Please try again.');
    }
  };

  const handleEdit = (gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || '',
      category: gallery.category,
      isPublic: gallery.isPublic,
      location: gallery.location || 'Temple Complex',
      date: gallery.date ? new Date(gallery.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (galleryId) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await galleryAPI.delete(galleryId);
      toast.success('Gallery item deleted successfully');
      fetchGalleries();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const handlePinToggle = async (gallery) => {
    try {
      await galleryAPI.togglePin(gallery._id);
      toast.success(gallery.isPinned ? 'Image unpinned successfully' : 'Image pinned successfully');
      fetchGalleries();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Maximum 6 images can be pinned');
      } else {
        toast.error('Failed to update pin status');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'festivals',
      isPublic: true,
      location: 'Temple Complex',
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedFiles([]);
    setUploadPreview([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage temple photos and gallery collections</p>
        </div>
        
        <button
          onClick={() => {
            setEditingGallery(null);
            resetForm();
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search gallery items..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ page: 1, limit: 20, category: 'all', search: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : galleries.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No gallery items found</p>
          </div>
        ) : (
          galleries.map((gallery) => (
            <motion.div
              key={gallery._id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                gallery.isPinned ? 'ring-2 ring-primary' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-48 bg-gray-200">
                {gallery.images && gallery.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={gallery.images[0].url}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                    {gallery.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                        +{gallery.images.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinToggle(gallery);
                    }}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors group"
                    title={gallery.isPinned ? 'Unpin from homepage' : 'Pin to homepage'}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className={`w-4 h-4 ${gallery.isPinned ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}
                    >
                      <path 
                        fill={gallery.isPinned ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M12 2L4 12h3v8h10v-8h3L12 2z"
                      />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(gallery);
                    }}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(gallery._id);
                    }}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {categories.find(c => c.value === gallery.category)?.label}
                  </span>
                </div>

                {!gallery.isPublic && (
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      Private
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {gallery.title}
                </h3>
                
                {gallery.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {gallery.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{gallery.location}</span>
                  <span>{formatDate(gallery.date)}</span>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {gallery.images?.length || 0} image(s)
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setFilters(prev => ({ ...prev, page }))}
                  className={`px-3 py-2 border rounded-lg ${
                    pagination.currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Create/Edit Gallery Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter gallery title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">
                      Make public (visible on website)
                    </label>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {uploadPreview.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {uploadPreview.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              onClick={() => {
                                setSelectedFiles(files => files.filter((_, i) => i !== index));
                                setUploadPreview(previews => previews.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload images or drag and drop (up to 20 images)
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP up to 5MB each
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                    />
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingGallery ? 'Update Gallery Item' : 'Create Gallery Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;