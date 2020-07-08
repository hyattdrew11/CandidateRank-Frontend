import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home/Index.vue';
import Dashboard from '../components/Dashboard/index.vue';
import Login from '../components/Auth/Login.vue';
import Register from '../components/Auth/Register.vue';
import Terms from '../components/Auth/tos.vue';
import Profile from '../components/Profile/Index.vue';
import store from '@/store'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: Register,
    // }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/login', '/terms', '/help'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && !store.getters.isAuthenticated) {
      return next('/login')
  }
  next();
})