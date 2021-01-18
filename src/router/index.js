
import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import(/* webpackChunkName: 'Home' */ '@/pages/Home')
const TermsOfService = () => import(/* webpackChunkName: 'TermsOfService' */ '@/pages/TermsOfService')
const Learning = () => import(/* webpackChunkName: 'Learning' */ '@/pages/Learning')
const Support = () => import(/* webpackChunkName: 'Support' */ '@/pages/Support')
const ContactUs = () => import(/* webpackChunkName: 'Contact' */ '@/pages/ContactUs')
const Login = () => import(/* webpackChunkName: 'Login' */ '@/pages/Auth/Login')
const Reset = () => import(/* webpackChunkName: 'Reset' */ '@/pages/Auth/Reset')
const Applicant = () => import(/* webpackChunkName: 'Applicant' */ '@/pages/Auth/Applicant')
const UpdatePassword = () => import(/* webpackChunkName: 'home' */ '@/pages/Auth/UpdatePassword')
const ZoomRedirect = () => import(/* webpackChunkName: 'ZoomRedirect' */ '@/pages/Zoom/ZoomRedirect')
const ZoomDeactivate = () => import(/* webpackChunkName: 'ZoomDeactivate' */ '@/pages/Zoom/ZoomDeactivate')
const Dashboard = () => import(/* webpackChunkName: 'Dashboard' */ '@/pages/Dashboard')
const CandidateDashboard = () => import(/* webpackChunkName: 'CandidateDashboard' */ '@/pages/CandidateDashboard')
import LINKS from '@/utils/constants/links'
import store from '@/store'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: LINKS.HOME.HREF,
      name: LINKS.HOME.TITLE,
      component: Home
    },
    {
      path: LINKS.TERMS_OF_SERVICE.HREF,
      name: LINKS.TERMS_OF_SERVICE.TITLE,
      component: TermsOfService,
    },
    {
      path: LINKS.LEARNING.HREF,
      name: LINKS.LEARNING.TITLE,
      component: Learning,
    },
    {
      path: LINKS.SUPPORT.HREF,
      name: LINKS.SUPPORT.TITLE,
      component: Support,
    },
    {
      path: LINKS.CONTACT_US.HREF,
      name: LINKS.CONTACT_US.TITLE,
      component: ContactUs,
    },
    {
      path: LINKS.LOGIN.HREF,
      name: LINKS.LOGIN.TITLE,
      component: Login,
    },
    {
      path: LINKS.RESET.HREF,
      name: LINKS.RESET.TITLE,
      component: Reset,
    },
    {
      path: LINKS.UPDATE_PASSWORD.HREF,
      name: LINKS.UPDATE_PASSWORD.TITLE,
      component: UpdatePassword,
    },
    {
      path: LINKS.DASHBOARD.HREF,
      name: LINKS.DASHBOARD.TITLE,
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
      path: LINKS.CANDIDATE_DASHBOARD.HREF,
      name: LINKS.CANDIDATE_DASHBOARD.TITLE,
      component: CandidateDashboard,
    },
    {
      path: LINKS.APPLICANT.HREF,
      name: LINKS.APPLICANT.TITLE,
      component: Applicant,
    },
    {
      path: LINKS.ZOOM_REDIRECT.HREF,
      name: LINKS.ZOOM_REDIRECT.TITLE,
      component: ZoomRedirect,
    },
    {
      path: LINKS.ZOOM_DEACTIVATE.HREF,
      name: LINKS.ZOOM_DEACTIVATE.TITLE,
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