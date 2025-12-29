<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Welcome, {{ authStore.user?.name }}!</span>
            <button
              @click="handleLogout"
              class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Available Bookings</h2>
          <button
            @click="openCreateModal"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Booking
          </button>
        </div>

        <BookingFilters @filter="handleFilter" />

        <div v-if="bookingsStore.loading" class="text-center py-12">
          <p class="text-gray-500">Loading bookings...</p>
        </div>

        <div v-else-if="bookingsStore.bookings.length === 0" class="text-center py-12">
          <p class="text-gray-500">No bookings available. Create one to get started!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BookingCard
            v-for="booking in bookingsStore.bookings"
            :key="booking.id"
            :booking="booking"
            :has-conflict="bookingsStore.checkConflict(booking)"
            :has-gap="bookingsStore.checkGap(booking)"
            @edit="handleEdit"
            @delete-confirm="handleDeleteConfirm"
          />
        </div>
      </div>
    </main>

    <BookingModal
      :is-open="isModalOpen"
      :booking="selectedBooking"
      @close="closeModal"
      @created="handleBookingCreated"
    />

    <ConfirmationModal
      :is-open="isConfirmModalOpen"
      title="Delete Booking"
      message="Are you sure you want to delete this booking? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      @close="closeConfirmModal"
      @confirm="handleDeleteConfirmed"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBookingsStore } from '../stores/bookings';
import BookingCard from '../components/BookingCard.vue';
import BookingModal from '../components/BookingModal.vue';
import BookingFilters from '../components/BookingFilters.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const bookingsStore = useBookingsStore();
const isModalOpen = ref(false);
const selectedBooking = ref(null);
const isConfirmModalOpen = ref(false);
const bookingToDelete = ref(null);
const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

let debounceTimer = null;

const fetchWithFilters = () => {
  const params = {};

  if (filters.value.search) params.search = filters.value.search;
  if (filters.value.status) params.status = filters.value.status;
  if (filters.value.dateFrom) params.date_from = filters.value.dateFrom;
  if (filters.value.dateTo) params.date_to = filters.value.dateTo;

  bookingsStore.fetchBookings(params);
};

const debouncedFetch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchWithFilters();
  }, 500);
};

watch(filters, () => {
  debouncedFetch();
}, { deep: true });

const handleFilter = (newFilters) => {
  filters.value = newFilters;
};

const openCreateModal = () => {
  selectedBooking.value = null;
  isModalOpen.value = true;
};

const handleEdit = (booking) => {
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBooking.value = null;
};

const handleBookingCreated = () => {
  fetchWithFilters();
};

const handleDeleteConfirm = (booking) => {
  bookingToDelete.value = booking;
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  bookingToDelete.value = null;
};

const handleDeleteConfirmed = async () => {
  if (bookingToDelete.value) {
    try {
      await bookingsStore.deleteBooking(bookingToDelete.value.id);
      closeConfirmModal();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    router.push('/login');
  }
};

onMounted(() => {
  bookingsStore.fetchBookings();
});
</script>
