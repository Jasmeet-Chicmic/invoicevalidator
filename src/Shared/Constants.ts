const STRING: string = 'Test';
export { STRING };
const TOAST_CONFIG = {
  LIMIT: 3,
  TIME_TO_SHOW: 1000,
};

const ROUTES = {
  HOMEPAGE: '/',
  LISTING: '/listing',
  EDIT: '/edit',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about-us',
  INVOICES: '/invoices',
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.HOMEPAGE,
  PRIVATE: ROUTES.LOGIN,
};
const MainTitle = 'Bookeep AI';
const ROUTES_CONFIG = {
  HOMEPAGE: {
    path: ROUTES.HOMEPAGE,
    title: MainTitle,
  },
  LISTING: {
    path: ROUTES.LISTING,
    title: MainTitle,
  },
  EDIT: {
    path: ROUTES.EDIT,
    title: MainTitle,
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    title: MainTitle,
  },
  REGISTER: {
    path: ROUTES.REGISTER,
    title: MainTitle,
  },
  ABOUT: {
    path: ROUTES.ABOUT,
    title: MainTitle,
  },
  INVOICES: {
    path: ROUTES.INVOICES,
    title: MainTitle,
  },
};

const MESSAGES = {
  NOTIFICATION: {
    FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    APPROVED: 'Approved',
    APPROVE: 'Approve',
    SAVED: 'Saved',
    INVOICE_ID_NOT_FOUND: 'Invoice ID not found',
    INVOICE_DELETED_SUCCESSFULLY: 'Invoice deleted successfully',
    INVOICE_EXPORTED_TO_TALLY_SUCCESSFULLY:
      'Invoice exported to tally successfully',
    INVOICE_EXPORTED_TO_LOCAL_SUCCESSFULLY:
      'Invoice exported to local successfully',
    FAILED_TO_DOWNLOAD: 'Failed to download',
  },
  FILE_UPLOADER: {
    FILE_DATA_ERROR:
      'Error extracting data. Please go back and re-upload the image.',
    MESSAGE: 'Click or drag and drop a image here.',
  },
};
const SNACKBAR_CONFIG = {
  MAX_SNACK: 3,
  AUTOHIDE_DURATION: 3000,
};

const MODAL_MESSAGES = {
  DELETE_CONFIRMATION: 'Are you sure you want to delete this invoice?',
  EXPORT_CONFIRMATION: 'Are you sure you want to export this invoice to tally?',
  EXPORT_ALL_APPROVED_CONFIRMATION:
    'Are you sure you want to export all approved invoices to tally?',
  EXPORT_SELECTED_APPROVED_CONFIRMATION:
    'Are you sure you want to export selected approved invoices to tally?',
  EXPORT_ALL_APPROVED_TO_LOCAL_CONFIRMATION:
    'Are you sure you want to export all approved invoices to local?',
  EXPORT_SELECTED_APPROVED_TO_LOCAL_CONFIRMATION:
    'Are you sure you want to export selected invoices to local?',
  DOWNLOAD_CONFIRMATION:
    'Are you sure you want to export this invoice to local?',
  DELETE_ALL_CONFIRMATION:
    'Are you sure you want to delete the selected invoices?',
  CANCLE_INVOICE_CONFIRMATION: 'Are you sure you want to cancel this invoice?',
  EDIT_INVOICE_CONFIRMATION: 'Are you sure you want to discard changes?',
};

const INVOICE_STATUS = {
  APPROVED: 'Approved',
  PENDING: 'Pending',
};
const BUTTON_TEXT = {
  SAVE: 'Save as Approved',
  PENDING: 'Save as Pending',
};
const CONFIDENCE_CONFIG = {
  DANGER: 0.5,
  WARNING: 0.7,
  CONFIDENCE_MULTIPLIER: 100,
};
const FILE_TYPES = {
  IMAGE: 'image',
  PDF: 'pdf',
};
const INPUT = {
  INPUT_TYPE: {
    FILE: 'file',
  },
  INPUT_REGEX: {
    FILE: '.pdf,image/*',
  },
};
type ButtonType = 'button' | 'submit' | 'reset';
const BUTTON = {
  BUTTON_TYPE: {
    button: 'button' as ButtonType,
    submit: 'submit' as ButtonType,
    reset: 'reset' as ButtonType,
  },
};

const STRINGS = {
  INVOICES: 'Invoices',
  EMPTY_STRING: '',
  SPACE: ' ',
  COMMA: ',',
  DOT: '.',
  SLASH: '/',
  COLON: ':',
  SEMICOLON: ';',
  HYPHEN: '-',
  UNDERSCORE: '_',
  EQUAL: '=',
};

export {
  STRINGS,
  FILE_TYPES,
  CONFIDENCE_CONFIG,
  SNACKBAR_CONFIG,
  BUTTON_TEXT,
  ROUTES,
  WILDCARD_ROUTES,
  ROUTES_CONFIG,
  MESSAGES,
  MODAL_MESSAGES,
  INPUT,
  BUTTON,
  INVOICE_STATUS,
  TOAST_CONFIG,
};
