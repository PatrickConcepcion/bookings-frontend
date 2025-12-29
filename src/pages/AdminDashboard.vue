<template>
  <DashboardLayout title="Admin Dashboard">
    <template #actions>
      <router-link
        to="/dashboard"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        My Bookings
      </router-link>
    </template>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">All Users' Bookings</h2>
    </div>

    <BookingFilters @filter="handleFilter" />

    <div v-if="bookingsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-transparent flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="space-y-2">
            <SkeletonLoader class="h-6 w-32" />
            <SkeletonLoader class="h-4 w-24" />
          </div>
          <SkeletonLoader class="h-6 w-16 rounded-full" />
        </div>

        <!-- Notes section -->
        <div class="space-y-2 flex-grow">
          <SkeletonLoader class="h-4 w-full" />
          <SkeletonLoader class="h-4 w-3/4" />
        </div>

        <!-- Booked by section -->
        <div class="mt-4">
          <SkeletonLoader class="h-4 w-24" />
        </div>
      </div>
    </div>

    <div v-else-if="bookingsStore.bookings.length === 0" class="text-center py-12">
      <p class="text-gray-500">No bookings available.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BookingCard
        v-for="booking in bookingsStore.bookings"
        :key="booking.id"
        :booking="booking"
        :has-conflict="bookingsStore.checkConflict(booking)"
        :has-gap="bookingsStore.checkGap(booking)"
        :show-booked-by="true"
        @edit="handleEdit"
        @delete-confirm="handleDeleteConfirm"
      />
    </div>

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
  </DashboardLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBookingsStore } from '../stores/bookings';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import BookingCard from '../components/BookingCard.vue';
import BookingModal from '../components/BookingModal.vue';
import BookingFilters from '../components/BookingFilters.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';

const router = useRouter(); // Keeping router for consistency if needed later, but removed unused logout logic requiring it
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

  bookingsStore.fetchAdminBookings(params);
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

const handleEdit = (booking) => {
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {  // Re-adding closeModal as it was missing in target content but needed for template
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

onMounted(() => {
  bookingsStore.fetchAdminBookings();
});
</script>
