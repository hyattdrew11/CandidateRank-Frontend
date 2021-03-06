import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home/Index.vue';
import Dashboard from '../components/Dashboard/index.vue';
// import EvaluatorDashboard from '../components/Evaluator-Dashboard/index.vue';
import CandidateDashboard from '../components/Candidate-Dashboard/index.vue';
import ZoomRedirect from '../components/Auth/zoomredirect.vue';
import ZoomDeactivate from '../components/Auth/zoomdeactivate.vue';
import Login from '../components/Auth/Login.vue';
import Applicant from '../components/Auth/Applicant.vue';
import Contact from '../components/Auth/Contact.vue';
// import Register from '../components/Auth/Register.vue';
import Reset from '../components/Auth/Reset.vue';
import UpdatePassword from '../components/Auth/UpdatePassword.vue';
import Terms from '../components/Auth/tos.vue';
import Learning from '../components/Auth/learning.vue';
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
      component: Dashboard,
      beforeEnter (to, from, next) {
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms,
    },
    {
      path: '/learning',
      name: 'Learning',
      component: Learning,
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
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    // {
    //   path: '/evaluator/:org/:year/:email/:uuid',
    //   name: 'Evaluator',
    //   component: EvaluatorDashboard,
    // },
    {
      path: '/candidate/:org/:year/:uuid',
      name: 'Candidate',
      component: CandidateDashboard,
    },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: Register,
    // },
    {
      path: '/applicant',
      name: 'Applicant',
      component: Applicant,
    },
    {
      path: '/reset',
      name: 'Reset',
      component: Reset,
    },
    {
      path: '/update/password/:email/:reset_link',
      name: 'UpdatePassword',
      component: UpdatePassword,
    },
    {
      path: '/zoomredirect',
      name: 'ZoomRedirect',
      component: ZoomRedirect,
    },
    {
      path: '/zoomdeactivate',
      name: 'ZoomDeactivate',
      component: ZoomDeactivate,
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/', '/login', '/terms', '/support', '/help', '/contact', '/evaluator'];
//   const authRequired = !publicPages.includes(to.path);
//   if (authRequired && !store.getters.isAuthenticated) {
//       return next('/login')
//   }
//   next();
// })