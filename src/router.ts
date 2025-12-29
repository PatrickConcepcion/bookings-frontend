import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Dashboard from './pages/Dashboard.vue';
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
      // Redirect to login
      next('/login');
    } else {
      next();
    }
  } else {
    // Redirect to dashboard if already authenticated and trying to access login/register
    if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  }
});

export default router;
