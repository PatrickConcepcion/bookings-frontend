<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ modalTitle }}</h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Form @submit="onSubmit" :validation-schema="bookingSchema" :initial-values="formInitialValues">
          <div class="space-y-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Field
                name="date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="date" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
              <label for="start_time" class="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <Field
                name="start_time"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="start_time" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
              <label for="end_time" class="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <Field
                name="end_time"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="end_time" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <Field
                name="notes"
                as="textarea"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="notes" class="text-red-500 text-sm mt-1 block" />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ submitButtonText }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useBookingsStore } from '../stores/bookings';
import { useFormErrors } from '../composables/useFormErrors';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  booking: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'created', 'updated']);

const bookingsStore = useBookingsStore();
const { handleValidationErrors } = useFormErrors();

const isEditMode = computed(() => !!props.booking);
const modalTitle = computed(() => isEditMode.value ? 'Edit Booking' : 'Create New Booking');
const submitButtonText = computed(() => isEditMode.value ? 'Update Booking' : 'Create Booking');

const bookingSchema = toTypedSchema(
  z.object({
    date: z.string().nonempty('Date is required'),
    start_time: z.string().nonempty('Start time is required'),
    end_time: z.string().nonempty('End time is required'),
    notes: z.string().optional(),
  })
);

const formInitialValues = computed(() => {
  if (isEditMode.value && props.booking) {
    return {
      date: props.booking.date.split('T')[0],
      start_time: props.booking.start_time.substring(0, 5),
      end_time: props.booking.end_time.substring(0, 5),
      notes: props.booking.notes || '',
    };
  }
  return {
    date: '',
    start_time: '',
    end_time: '',
    notes: '',
  };
});

const onSubmit = async (values, { setErrors, resetForm }) => {
  try {
    if (isEditMode.value) {
      await bookingsStore.updateBooking(props.booking.id, values);
      emit('updated');
    } else {
      await bookingsStore.createBooking(values);
      emit('created');
    }
    // Emit close first before resetForm to prevent rendering issues
    emit('close');
    // Use nextTick to ensure DOM updates properly
    setTimeout(() => {
      resetForm();
    }, 0);
  } catch (error) {
    console.error('Booking operation error:', error);
    handleValidationErrors(error, setErrors);
  }
};

const close = () => {
  emit('close');
};
</script>
