<template>
  <div
    :class="[
      'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 flex flex-col',
      conflictClass
    ]"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-semibold text-gray-900">{{ formattedDate }}</h3>
        <p class="text-sm text-gray-600">{{ timeRange }}</p>
      </div>
      <span
        :class="statusClass"
        class="px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ booking.status }}
      </span>
    </div>

    <div class="space-y-2 flex-grow">
      <div v-if="booking.notes" class="text-gray-700">
        <p class="text-sm">{{ booking.notes }}</p>
      </div>
    </div>

    <div v-if="showBookedBy" class="mt-4 italic text-sm text-gray-600">
      Booked by: {{ booking.user?.name || 'N/A' }}
    </div>

    <div v-if="!showBookedBy" class="mt-4 flex gap-2 justify-end">
      <button
        @click="$emit('edit', booking)"
        class="p-2 cursor-pointer text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        title="Edit"
      >
        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
      </button>
      <button
        @click="handleDelete"
        class="p-2 cursor-pointer text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
        title="Delete"
      >
        <font-awesome-icon :icon="['fas', 'trash-can']" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

library.add(faPenToSquare, faTrashCan);

dayjs.extend(customParseFormat);

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  hasConflict: {
    type: Boolean,
    default: false
  },
  hasGap: {
    type: Boolean,
    default: false
  },
  showBookedBy: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete-confirm']);

const formattedDate = computed(() => {
  return dayjs(props.booking.date).format('MMMM D, YYYY');
});

const timeRange = computed(() => {
  const start = dayjs(props.booking.start_time, 'HH:mm:ss').format('h:mm A');
  const end = dayjs(props.booking.end_time, 'HH:mm:ss').format('h:mm A');
  return `${start} - ${end}`;
});

const statusClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return classes[props.booking.status] || 'bg-gray-100 text-gray-800';
});

const conflictClass = computed(() => {
  if (props.hasConflict) return 'border-red-500';
  if (props.hasGap) return 'border-yellow-500';
  return 'border-transparent';
});

const handleDelete = () => {
  emit('delete-confirm', props.booking);
};
</script>
