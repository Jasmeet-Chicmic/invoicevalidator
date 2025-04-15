const STRING: string = 'Test';
export { STRING };

const ROUTES = {
  HOMEPAGE: '/',
  LISTING: '/listing',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about-us',
  INVOICES: '/invoices',
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.HOMEPAGE,
  PRIVATE: ROUTES.LOGIN,
};

const ROUTES_CONFIG = {
  HOMEPAGE: {
    path: ROUTES.HOMEPAGE,
    title: 'home',
  },
  LISTING: {
    path: ROUTES.LISTING,
    title: 'listing',
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
  INVOICES: {
    path: ROUTES.INVOICES,
    title: 'Invoices',
  },
};

const MESSAGES = {
  NOTIFICATION: {
    FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    APPROVED: 'Approved',
    APPROVE: 'Approve',
    SAVED: 'Saved',
  },
  FILE_UPLOADER: {
    MESSAGE: 'Click or drag and drop a PDF or image here',
  },
};
const SNACKBAR_CONFIG = {
  MAX_SNACK: 3,
  AUTOHIDE_DURATION: 3000,
};

const MODAL_MESSAGES = {
  DELETE_CONFIRMATION: 'Are you sure you want to delete?',
  CANCLE_INVOICE_CONFIRMATION: 'Are you sure you want to cancel this invoice?',
};

const BUTTON_TEXT = {
  SAVE: 'Save',
  DRAFT: 'Draft',
};

export {
  SNACKBAR_CONFIG,
  BUTTON_TEXT,
  ROUTES,
  WILDCARD_ROUTES,
  ROUTES_CONFIG,
  MESSAGES,
  MODAL_MESSAGES,
};
