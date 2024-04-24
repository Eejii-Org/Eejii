import type { StateCreator } from 'zustand';

type BioInfo = {
  bio: string;
};

type BioInfoSlice = {
  bioInfo: BioInfo;
  setBioInfo: (data: BioInfo) => void;
};

const initialState = {
  bio: '',
};

const VolLocationSlice: StateCreator<BioInfoSlice> = set => ({
  bioInfo: initialState,
  setBioInfo: data =>
    set(state => ({ bioInfo: { ...state.bioInfo, ...data } })),
});

export default VolLocationSlice;
export type { BioInfo, BioInfoSlice };
