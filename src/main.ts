import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

// Initialize auth state BEFORE router to avoid race condition
const authStore = useAuthStore();
await authStore.initAuth();

app.use(router);
app.mount('#app');
