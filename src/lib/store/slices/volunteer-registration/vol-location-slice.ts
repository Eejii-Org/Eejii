import type { StateCreator } from 'zustand';

type LocationInfo = {
  country: string;
  homeAddress: string;
};

type LocationInfoSlice = {
  locationInfo: LocationInfo;
  setLocationInfo: (data: LocationInfo) => void;
};

const initialState = {
  country: '',
  homeAddress: '',
};

const VolLocationSlice: StateCreator<LocationInfoSlice> = set => ({
  locationInfo: initialState,
  setLocationInfo: data =>
    set(state => ({ locationInfo: { ...state.locationInfo, ...data } })),
});

export default VolLocationSlice;
export type { LocationInfo, LocationInfoSlice };
