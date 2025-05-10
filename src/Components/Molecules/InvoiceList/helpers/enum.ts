export enum ListingStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  All = 'All',
}

export enum ListingStatusPayload {
  pending = 0,
  approved = 1,
}

export enum ButtonActions {
  ExportToTally = 'ExportToTally',
  ExportToLocal = 'ExportToLocal',
  Delete = 'Delete',
  Edit = 'Edit',
}
