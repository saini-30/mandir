import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';

export const useEvents = () => {
  const [events, setEvents] = useState({ mainEvent: null, otherEvents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getPublic();
      setEvents(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};

export const useEvent = (slug) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await eventsAPI.getPublicEvent(slug);
        setEvent(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  return { event, loading, error };
};