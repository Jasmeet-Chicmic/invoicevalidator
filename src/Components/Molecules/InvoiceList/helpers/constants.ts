import IMAGES from '../../../../Shared/Images';

export const filterTabs = (selectedIds: string[]) => [
  {
    className: 'exporttotelly',
    icon: IMAGES.exportIcon,
    alt: 'Export to Tally',
    label: 'Export to Tally',
    disabled: false,
  },
  {
    className: 'downloadjson',
    icon: IMAGES.downloadIcon,
    alt: 'Download JSON',
    label: 'Download JSON',
    disabled: false,
  },
  {
    className: 'deletebtntop',
    icon: IMAGES.deleteIcon,
    alt: 'Delete',
    label: 'Delete',
    disabled: !selectedIds.length,
  },
];
