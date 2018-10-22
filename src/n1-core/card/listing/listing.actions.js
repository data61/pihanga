import { navigateToPage } from 'n1-core/app';

//const Domain = 'DATASETS:';
export const ACTION_TYPES = {
};

export function onShowDatasetDetail(id) {
  navigateToPage(`/datasets/${id}`);
}

