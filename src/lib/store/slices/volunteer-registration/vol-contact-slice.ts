import type { StateCreator } from 'zustand';

type ContactInfo = {
  birthdate: string;
  gender: string;
  registerCode: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  firstLetter: string;
  secondLetter: string;
  registerNumber: string | undefined;
  birthDate: Date | undefined;
};

type ContactInfoSlice = {
  contactInfo: ContactInfo;
  setContactInfo: (data: ContactInfo) => void;
};

const initialState = {
  birthdate: '',
  birthDay: '1',
  birthMonth: '1',
  birthYear: '2013',
  gender: '',
  registerCode: '',
  firstLetter: 'А',
  secondLetter: 'А',
  registerNumber: undefined,
  birthDate: undefined,
};

const VolContactSlice: StateCreator<ContactInfoSlice> = set => ({
  contactInfo: initialState,
  setContactInfo: data =>
    set(state => ({ contactInfo: { ...state.contactInfo, ...data } })),
});

export default VolContactSlice;
export type { ContactInfo, ContactInfoSlice };
