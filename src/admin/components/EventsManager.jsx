import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  Target,
  Users,
  Upload,
  X
} from 'lucide-react';
import { eventsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({});  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    eventDate: '',
    endDate: '',
    location: 'Main Temple Complex',
    category: 'Festival',
    priority: 5,
    isMainEvent: false,
    images: [],
    imagePreviewUrls: []
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAdmin(filters);
      setEvents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {      const formDataToSend = new FormData();
      
      // Add each field individually to FormData
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('targetAmount', formData.targetAmount);
      formDataToSend.append('eventDate', formData.eventDate || '');
      formDataToSend.append('endDate', formData.endDate || '');
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority.toString());
      formDataToSend.append('isMainEvent', formData.isMainEvent.toString());
      formDataToSend.append('status', 'active');
      
      // Append each image file
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, formDataToSend);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(formDataToSend);
        toast.success('Event created successfully');
      }

      setShowModal(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (editingEvent ? 'Failed to update event' : 'Failed to create event');
      toast.error(errorMessage);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      targetAmount: event.targetAmount.toString(),
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      location: event.location,
      category: event.category,
      priority: event.priority,
      isMainEvent: event.isMainEvent,
      images: [],
      imagePreviewUrls: event.images?.map(img => img.url) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(eventId);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleSetMain = async (eventId) => {
    try {
      await eventsAPI.setMain(eventId);
      toast.success('Main event updated successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to set main event');
    }
  };  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      eventDate: '',
      endDate: '',
      location: 'Main Temple Complex',
      category: 'Festival',
      priority: 5,
      isMainEvent: false,
      images: [],
      imagePreviewUrls: []
    });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }

    // Generate preview URLs for the images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: files,
      imagePreviewUrls: previewUrls
    }));
  };
  // Cleanup preview URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      formData.imagePreviewUrls?.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData.imagePreviewUrls]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Create and manage temple events and fundraising campaigns</p>
        </div>
        
        <button
          onClick={() => {
            setEditingEvent(null);
            resetForm();
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ page: 1, limit: 20, status: 'all', search: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {event.images && event.images[0] && (
                <div className="w-full h-48 relative">
                  <img
                    src={event.images[0].url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(event.status)}
                    {event.isMainEvent && (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Main</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Target</span>
                    <span className="font-semibold">{formatAmount(event.targetAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Raised</span>
                    <span className="font-semibold text-green-600">{formatAmount(event.raisedAmount)}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((event.raisedAmount / event.targetAmount) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.donationCount} donors</span>
                    </div>
                    <span>{Math.round((event.raisedAmount / event.targetAmount) * 100)}% funded</span>
                  </div>

                  {event.eventDate && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  {!event.isMainEvent && event.status === 'active' && (
                    <button
                      onClick={() => handleSetMain(event._id)}
                      className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      Set as Main
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
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

      {/* Create/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter event description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter target amount"
                      min="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Festival">Festival</option>
                      <option value="Seva">Seva</option>
                      <option value="Development">Development</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
                      placeholder="Enter event location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="1"
                      max="10"
                    />
                  </div>                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="event-images"
                      />
                      <label htmlFor="event-images" className="cursor-pointer block">
                        <div className="text-center">                          {formData.imagePreviewUrls?.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              {formData.imagePreviewUrls?.map((url, index) => (
                                <div key={index} className="relative aspect-video">
                                  <img
                                    src={url}
                                    alt={`Event preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newImages = [...formData.images];
                                      const newPreviews = [...formData.imagePreviewUrls];
                                      newImages.splice(index, 1);
                                      newPreviews.splice(index, 1);
                                      setFormData(prev => ({
                                        ...prev,
                                        images: newImages,
                                        imagePreviewUrls: newPreviews
                                      }));
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                Click to upload images or drag and drop (up to 5 images)
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB each</p>
                            </>
                          )}
                          {(formData.imagePreviewUrls?.length || 0) < 5 && (
                            <button
                              type="button"
                              onClick={() => document.getElementById('event-images').click()}
                              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              {!formData.imagePreviewUrls?.length ? 'Upload Images' : 'Add More Images'}
                            </button>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isMainEvent"
                        checked={formData.isMainEvent}
                        onChange={(e) => setFormData(prev => ({ ...prev, isMainEvent: e.target.checked }))}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="isMainEvent" className="text-sm font-medium text-gray-700">
                        Set as main event (featured on homepage)
                      </label>
                    </div>
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
                    {editingEvent ? 'Update Event' : 'Create Event'}
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

export default EventsManager;