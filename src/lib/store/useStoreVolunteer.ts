import { create } from 'zustand';
import type { PersonalInfoSlice } from './slices/volunteer-registration/vol-personal-info-slice';
import type { ContactInfoSlice } from './slices/volunteer-registration/vol-contact-slice';
import type { BioInfoSlice } from './slices/volunteer-registration/vol-bio-slice';
import type { LocationInfoSlice } from './slices/volunteer-registration/vol-location-slice';

import {
  VolPersonalInfoSlice,
  VolBioSlice,
  VolContactSlice,
  VolLocationSlice,
  createStepSlice,
  createSubmitFormSlice,
} from './slices';
import type { StepSlice } from './slices/createStepSlice';
import type { SubmitFormSlice } from './slices/createSubmitFormSlice';

const useStoreVolunteer = create<
  PersonalInfoSlice &
    ContactInfoSlice &
    BioInfoSlice &
    LocationInfoSlice &
    StepSlice &
    SubmitFormSlice
>()((...a) => ({
  ...VolPersonalInfoSlice(...a),
  ...VolBioSlice(...a),
  ...VolContactSlice(...a),
  ...VolLocationSlice(...a),
  ...createStepSlice(...a),
  ...createSubmitFormSlice(...a),
}));

export default useStoreVolunteer;
