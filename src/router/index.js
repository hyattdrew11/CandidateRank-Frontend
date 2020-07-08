import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home/Index.vue';
import AdminDashboard from '../components/Admin-Dashboard/index.vue';
import EvaluatorDashboard from '../components/Evaluator-Dashboard/index.vue';
import CandidateDashboard from '../components/Candidate-Dashboard/index.vue';
import Login from '../components/Auth/Login.vue';
import Register from '../components/Auth/Register.vue';
import Terms from '../components/Auth/tos.vue';
import Support from '../components/Auth/support.vue';
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
      component: AdminDashboard
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms,
    },
    {
      path: '/support',
      name: 'Support',
      component: Support,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    // {
    //   path: '/evaluator/:org/:year/:email/:uuid',
    //   name: 'Evaluator',
    //   component: EvaluatorDashboard,
    // },
    // {
    //   path: '/candidate/:org/:year/:email/:uuid',
    //   name: 'Candidate',
    //   component: CandidateDashboard,
    // },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: Register,
    // }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/login', '/terms', '/support', '/help'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired && !store.getters.isAuthenticated) {
      return next('/login')
  }
  next();
})