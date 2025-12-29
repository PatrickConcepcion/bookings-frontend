import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import api from '../api/axios';
import type { Booking, CreateBookingData, UpdateBookingData } from '../types/booking';

dayjs.extend(customParseFormat);

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBookings = async (params?: {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/bookings', { params });
      bookings.value = response.data.bookings || [];
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings';
      bookings.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createBooking = async (data: CreateBookingData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/bookings', data);
      bookings.value.unshift(response.data.booking);
      return response.data.booking;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create booking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBooking = async (id: number, data: UpdateBookingData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put(`/bookings/${id}`, data);
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) {
        // Preserve the user relationship from the existing booking
        // since the update response might not include it
        const existingUser = bookings.value[index].user;
        bookings.value[index] = {
          ...response.data.booking,
          user: response.data.booking.user || existingUser,
        };
      }
      return response.data.booking;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to update booking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBooking = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/bookings/${id}`);
      bookings.value = bookings.value.filter(b => b.id !== id);
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete booking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const checkConflict = (booking: Booking): boolean => {
    const result = bookings.value.some((b) => {
      if (b.id === booking.id || b.status === 'cancelled') return false;

      // Extract just the date part (YYYY-MM-DD) from ISO format
      const bookingDate = booking.date.split('T')[0];
      const otherDate = b.date.split('T')[0];

      if (bookingDate !== otherDate) return false;

      // Parse times by combining clean date with time strings
      const bookingStart = dayjs(`${bookingDate} ${booking.start_time}`, 'YYYY-MM-DD HH:mm:ss');
      const bookingEnd = dayjs(`${bookingDate} ${booking.end_time}`, 'YYYY-MM-DD HH:mm:ss');
      const otherStart = dayjs(`${otherDate} ${b.start_time}`, 'YYYY-MM-DD HH:mm:ss');
      const otherEnd = dayjs(`${otherDate} ${b.end_time}`, 'YYYY-MM-DD HH:mm:ss');

      if (!bookingStart.isValid() || !bookingEnd.isValid() || !otherStart.isValid() || !otherEnd.isValid()) {
        return false;
      }

      // Two time ranges overlap if one starts before the other ends AND ends after the other starts
      return bookingStart.isBefore(otherEnd) && bookingEnd.isAfter(otherStart);
    });

    return result;
  };

  const checkGap = (booking: Booking): boolean => {
    const bookingDate = booking.date.split('T')[0];

    const sameDay = bookings.value
      .filter(b => {
        const otherDate = b.date.split('T')[0];
        return otherDate === bookingDate && b.id !== booking.id && b.status !== 'cancelled';
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (sameDay.length === 0) return false;

    const bookingStart = dayjs(`${bookingDate} ${booking.start_time}`, 'YYYY-MM-DD HH:mm:ss');
    const bookingEnd = dayjs(`${bookingDate} ${booking.end_time}`, 'YYYY-MM-DD HH:mm:ss');

    for (const b of sameDay) {
      const otherDate = b.date.split('T')[0];
      const otherStart = dayjs(`${otherDate} ${b.start_time}`, 'YYYY-MM-DD HH:mm:ss');
      const otherEnd = dayjs(`${otherDate} ${b.end_time}`, 'YYYY-MM-DD HH:mm:ss');

      const gap1 = Math.abs(bookingEnd.diff(otherStart, 'minute'));
      const gap2 = Math.abs(otherEnd.diff(bookingStart, 'minute'));

      if ((gap1 > 15 && gap1 < 120) || (gap2 > 15 && gap2 < 120)) {
        return true;
      }
    }

    return false;
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    checkConflict,
    checkGap,
  };
});
