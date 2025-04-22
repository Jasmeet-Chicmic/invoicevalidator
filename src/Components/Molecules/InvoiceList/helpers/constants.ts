import { STRINGS } from '../../../../Shared/Constants';
import IMAGES from '../../../../Shared/Images';
import { ButtonActions } from './enum';

export const filterTabs = (
  selectedIds: number[]
  // selectedApprovedIds: number[]
) => [
  // {
  //   className: 'btn-primary exporttotelly',
  //   icon: IMAGES.exportIcon,
  //   alt: 'Export to Tally',
  //   label: 'Export to Tally',
  //   disabled: !selectedApprovedIds.length,
  //   actionType: ButtonActions.ExportToTally,
  // },
  {
    className: 'btn-primary downloadjson',
    icon: IMAGES.downloadIcon,
    alt: 'Download JSON',
    label: 'Download JSON',
    disabled: !selectedIds.length,
    actionType: ButtonActions.ExportToLocal,
  },
  {
    className: 'btn-primary  deletebtntop',
    icon: IMAGES.deleteIcon,
    alt: 'Delete',
    label: 'Delete',
    disabled: !selectedIds.length,
    actionType: ButtonActions.Delete,
  },
];

export const actionButtons = [
  {
    key: ButtonActions.Edit,
    icon: IMAGES.editIcon,
    alt: 'edit-icon',
    className: 'invoice-list__action-button--edit',
  },
  {
    key: ButtonActions.Delete,
    icon: IMAGES.deleteIcon,
    alt: 'delete-icon',
    className: 'invoice-list__action-button--delete',
  },
  {
    key: ButtonActions.ExportToTally,
    icon: IMAGES.exportIcon,
    alt: 'export-icon',
    className: 'invoice-list__action-button--export',
  },
  {
    key: ButtonActions.ExportToLocal,
    icon: IMAGES.downloadIcon,
    alt: 'download-icon',
    className: 'invoice-list__action-button--download',
  },
];

export const ConfirmationPopupDefaultValue = {
  isOpen: false,
  title: STRINGS.EMPTY_STRING,
  type: null,
  data: {},
};
