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
        <div
          class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center"
        >
          <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Welcome to your Dashboard!</h2>
            <p class="text-gray-600 mb-6">You are successfully logged in.</p>
            <p class="text-gray-500">Email: {{ authStore.user?.email }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect to login even if logout fails
    router.push('/login');
  }
};
</script>
