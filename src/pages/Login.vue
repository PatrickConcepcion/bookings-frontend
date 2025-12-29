<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
        <Form @submit="onSubmit" :validation-schema="loginSchema" :initial-values="initialValues">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <Field
              name="email"
              type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <Field
              name="password"
              type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Login
          </button>
        </Form>
        <p class="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-indigo-600 hover:text-indigo-500"
            >Register here</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useFormErrors } from '../composables/useFormErrors';

const router = useRouter();
const authStore = useAuthStore();
const { handleValidationErrors } = useFormErrors();

// Define Zod validation schema
const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .nonempty('Email is required')
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .nonempty('Password is required')
  })
);

const initialValues = { email: '', password: '' };

const onSubmit = async (values, { setErrors }) => {
  try {
    await authStore.login(values);
    router.push('/dashboard');
  } catch (error) {
    handleValidationErrors(error, setErrors);
  }
};
</script>
