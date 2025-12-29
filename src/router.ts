import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './components/Dashboard.vue';
import { useAuthStore } from './stores/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      try {
        // Try to get user info (will work if cookie is valid)
        await authStore.me();
        next();
      } catch {
        // Not authenticated, redirect to login
        next('/login');
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
