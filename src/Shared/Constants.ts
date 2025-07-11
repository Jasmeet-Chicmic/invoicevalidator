const STRING: string = 'Test';
export { STRING };

const ROUTES = {
  HOMEPAGE: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about-us',
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.HOMEPAGE,
  PRIVATE: ROUTES.LOGIN,
};

const ROUTES_CONFIG = {
  HOMEPAGE: {
    path: ROUTES.HOMEPAGE,
    title: 'Master Plan',
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    title: 'Login',
  },
  REGISTER: {
    path: ROUTES.REGISTER,
    title: 'Register',
  },
  ABOUT: {
    path: ROUTES.ABOUT,
    title: 'About us',
  },
};

const MESSAGES = {
  NOTIFICATION: {
    FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
  },
  FILE_UPLOADER: {
    MESSAGE: 'Click or drag and drop a PDF or image here',
  },
};
const SNACKBAR_CONFIG = {
  MAX_SNACK: 3,
  AUTOHIDE_DURATION: 3000,
};

const INPUT = {
  INPUT_TYPE: {
    FILE: 'file',
  },
  INPUT_REGEX: {
    FILE: '.pdf,image/*',
  },
};

export {
  SNACKBAR_CONFIG,
  ROUTES,
  WILDCARD_ROUTES,
  ROUTES_CONFIG,
  MESSAGES,
  INPUT,
};
