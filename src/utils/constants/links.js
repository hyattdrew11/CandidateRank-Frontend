
const LINKS = Object.freeze({
  HOME: {
    HREF: '/',
    TITLE: 'Home'
  },
  TERMS_OF_SERVICE: {
    TITLE: 'Terms of Use',
    HREF: '/terms-of-service',
  },
  LEARNING: {
    TITLE: 'Learning',
    HREF: '/learning',
  },
  SUPPORT: {
    TITLE: 'Support',
    HREF: '/support',
  },
  CONTACT_US: {
    TITLE: 'Contact Us',
    HREF: '/contact-us'
  },
  LOGIN: {
    TITLE: 'Login',
    HREF: '/login',
  },
  RESET: {
    TITLE: 'Reset',
    HREF: '/reset',
  },
  UPDATE_PASSWORD: {
    TITLE: 'Update Password',
    HREF: '/update/password/:email/:reset_link',
  },
  DASHBOARD: {
    TITLE: 'Dashboard',
    HREF: '/dashboard',
  },
  CANDIDATE_DASHBOARD: {
    TITLE: 'Candidate Dashboard',
    HREF: '/candidate/:org/:year/:uuid',
  },
  APPLICANT: {
    TITLE: 'Applicant',
    HREF: '/applicant',
  },
  ZOOM_REDIRECT: {
    HREF: '/zoomredirect',
    TITLE: 'ZoomRedirect'
  },
  ZOOM_DEACTIVATE: {
    HREF: '/zoomdeactivate',
    TITLE: 'ZoomDeactivate'
  }
});

export default LINKS;
