
import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import(/* webpackChunkName: 'Home' */ '@/pages/Home')
const Dashboard = () => import(/* webpackChunkName: 'Dashboard' */ '@/pages/Dashboard')
const CandidateDashboard = () => import(/* webpackChunkName: 'CandidateDashboard' */ '@/pages/CandidateDashboard')
const Login = () => import(/* webpackChunkName: 'Login' */ '@/pages/Auth/Login')
// const Register = () => import(/* webpackChunkName: 'Register' */ '@/pages/Auth/Register')
const Reset = () => import(/* webpackChunkName: 'Reset' */ '@/pages/Auth/Reset')
const UpdatePassword = () => import(/* webpackChunkName: 'home' */ '@/pages/Auth/UpdatePassword')
const ZoomRedirect = () => import(/* webpackChunkName: 'ZoomRedirect' */ '@/pages/Auth/ZoomRedirect')
const ZoomDeactivate = () => import(/* webpackChunkName: 'ZoomDeactivate' */ '@/pages/Auth/ZoomDeactivate')
const Applicant = () => import(/* webpackChunkName: 'Applicant' */ '@/pages/Auth/Applicant')
const Contact = () => import(/* webpackChunkName: 'Contact' */ '@/pages/Auth/Contact')
const TermsOfService = () => import(/* webpackChunkName: 'TermsOfService' */ '@/pages/Auth/TermsOfService')
const Support = () => import(/* webpackChunkName: 'Support' */ '@/pages/Auth/Support')
const Learning = () => import(/* webpackChunkName: 'Learning' */ '@/pages/Auth/Learning')
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
      beforeEnter(to, from, next) {
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
      component: TermsOfService,
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