import type { StateCreator } from 'zustand';

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type PersonalInfoSlice = {
  personalInfo: PersonalInfo;
  setPersonalInfo: (data: PersonalInfo) => void;
};

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const VolPersonalInfoSlice: StateCreator<PersonalInfoSlice> = set => ({
  personalInfo: initialState,
  setPersonalInfo: data =>
    set(state => ({ personalInfo: { ...state.personalInfo, ...data } })),
});

export default VolPersonalInfoSlice;
export type { PersonalInfo, PersonalInfoSlice };
