<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-700">{{ message }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            @click="confirm"
            :class="confirmButtonClass"
            class="px-4 py-2 rounded-md text-white"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  variant: {
    type: String,
    default: 'danger', // 'danger', 'primary', 'success'
  },
});

const emit = defineEmits(['close', 'confirm']);

const confirmButtonClass = computed(() => {
  const variants = {
    danger: 'bg-red-600 hover:bg-red-700',
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
  };
  return variants[props.variant] || variants.primary;
});

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm');
};
</script>
