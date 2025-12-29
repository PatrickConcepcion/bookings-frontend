<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
        <Form @submit="onSubmit" :validation-schema="registerSchema" :initial-values="values">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <Field
              name="name"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <Field
              name="email"
              type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <Field
              name="password"
              type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
          </div>
          <div class="mb-6">
            <label for="confirm_password" class="block text-sm font-medium text-gray-700"
              >Confirm password</label
            >
            <Field
              name="confirm_password"
              type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage name="confirm_password" class="text-red-500 text-sm mt-1 block" />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </Form>
        <p class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500"
            >Login here</router-link
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
import { ref } from 'vue';

const router = useRouter();

// Define Zod validation schema
const registerSchema = toTypedSchema(
  z
    .object({
      name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
      email: z
        .string({ required_error: 'Email is required' })
        .nonempty('Email is required')
        .email('Invalid email address'),
      password: z
        .string({ required_error: 'Password is required' })
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirm_password: z
        .string({ required_error: 'Confirm password is required' })
        .nonempty('Confirm password is required'),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    })
);

const values = ref({ name: '', email: '', password: '', confirm_password: '' });

const onSubmit = (values) => {
  // Handle validated form submission
  console.log('Registered values:', values);
  // In a real app, this would call an API or the auth store to register
  router.push('/dashboard');
};
</script>
