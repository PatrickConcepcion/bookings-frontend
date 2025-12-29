<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          v-model="localFilters.search"
          type="text"
          placeholder="Search bookings..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="emitFilters"
        />
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          v-model="localFilters.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">
          From Date
        </label>
        <input
          id="dateFrom"
          v-model="localFilters.dateFrom"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        />
      </div>

      <div>
        <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">
          To Date
        </label>
        <input
          id="dateTo"
          v-model="localFilters.dateTo"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        />
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        @click="clearFilters"
        class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter']);

const localFilters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

const emitFilters = () => {
  emit('filter', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  };
  emitFilters();
};
</script>
