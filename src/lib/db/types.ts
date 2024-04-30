import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  PartnerType,
  Role,
  UserType,
  ProjectType,
  EventType,
  RequestStatus,
  ProjectStatus,
  PaymentStatus,
  PermitType,
} from './enums';

export type Address = {
  id: Generated<string>;
  country: string;
  countryCode: string | null;
  city: string;
  provinceName: string;
  district: string | null;
  street: string | null;
  additional: string | null;
  userId: string | null;
};
export type Banner = {
  id: Generated<string>;
  path: string | null;
  mobilePath: string | null;
  title: string | null;
  description: string | null;
  link: string | null;
  bannerPositionId: string | null;
};
export type BannerPosition = {
  id: Generated<string>;
  code: string;
  label: string;
  type: string | null;
  thumbnail: string | null;
};
export type Category = {
  id: Generated<string>;
  code: string;
  name: string;
  type: string | null;
};
export type CategoryEvent = {
  id: Generated<string>;
  eventId: string | null;
  categoryId: string | null;
};
export type CategoryMedia = {
  id: Generated<string>;
  mediaId: string | null;
  categoryId: string | null;
};
export type CategoryProject = {
  id: Generated<string>;
  projectId: string | null;
  categoryId: string | null;
};
export type Certificate = {
  id: Generated<string>;
  number: string;
  grade: number;
  createdAt: Generated<Timestamp>;
  volunteerName: string;
  organizationName: string;
  volunteerId: string | null;
  eventId: string | null;
  certificateTemplateId: string | null;
};
export type CertificateTemplate = {
  id: Generated<string>;
  description: string;
  shortDescription: string | null;
  organizationName: string;
  logoPath: string | null;
  userId: string | null;
  eventId: string | null;
};
export type City = {
  id: Generated<string>;
  name: string;
  countryCode: string;
  stateCode: string;
};
export type Country = {
  id: Generated<string>;
  name: string;
  code: string;
  region: string | null;
  phoneCode: string | null;
  volunteers: Generated<number | null>;
};
export type Donation = {
  id: Generated<string>;
  amount: number;
  userId: string | null;
  isPublicAmount: Generated<boolean>;
  projectId: string | null;
  createdAt: Generated<Timestamp>;
  status: Generated<PaymentStatus>;
};
export type Event = {
  id: Generated<string>;
  slug: string;
  type: Generated<EventType>;
  title: string;
  description: string;
  location: string;
  status: ProjectStatus | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  enabled: boolean;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  contact: unknown | null;
  featured: boolean;
  volunteeringHours: Generated<number | null>;
  maxVolunteers: Generated<number | null>;
  maxPoint: number | null;
  ownerId: string | null;
};
export type EventCollaborator = {
  id: Generated<string>;
  userId: string | null;
  eventId: string | null;
  status: RequestStatus | null;
  type: string | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Timestamp | null;
};
export type EventImage = {
  id: Generated<string>;
  ownerId: string;
  path: string;
  type: string | null;
};
export type EventParticipator = {
  id: Generated<string>;
  userId: string | null;
  eventId: string | null;
  status: RequestStatus | null;
  hasCertificate: Generated<boolean>;
  type: string | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Timestamp | null;
  volunteeringPoint: number | null;
  eventRoleId: string | null;
};
export type EventRole = {
  id: Generated<string>;
  name: string;
  slots: number;
  accepted: Generated<number>;
  eventId: string;
};
export type Media = {
  id: Generated<string>;
  slug: string;
  title: string;
  body: string;
  ownerId: string;
  createdAt: Generated<Timestamp>;
  projectId: string | null;
};
export type MediaImage = {
  id: Generated<string>;
  ownerId: string;
  path: string;
  type: string | null;
};
export type Notification = {
  id: Generated<string>;
  receiverId: string;
  senderId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  status: string | null;
  link: string | null;
  title: string;
  body: string | null;
  type: string;
};
export type PartnerBanner = {
  id: Generated<string>;
  bannerId: string;
  userId: string | null;
  active: boolean;
  startDate: Timestamp;
  endDate: Timestamp;
};
export type Payment = {
  id: Generated<string>;
  amount: number;
  invoiceId: string | null;
  status: Generated<PaymentStatus>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  details: unknown | null;
  paymentMethodId: string | null;
  userId: string | null;
  donationId: string | null;
  permitId: string | null;
};
export type PaymentMethod = {
  id: Generated<string>;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  position: number;
};
export type Permit = {
  id: Generated<string>;
  name: string;
  description: string;
  code: string;
  price: number;
  originalPrice: number;
  quantity: number;
  type: PermitType;
  enabled: Generated<boolean>;
  bannerPositionId: string | null;
  subscriptionId: string | null;
};
export type Project = {
  id: Generated<string>;
  slug: string;
  type: Generated<ProjectType>;
  title: string;
  description: string;
  contact: unknown | null;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  enabled: boolean;
  status: ProjectStatus | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  featured: boolean;
  link: string | null;
  goalAmount: number | null;
  currentAmount: number | null;
  ownerId: string | null;
};
export type ProjectCollaborator = {
  id: Generated<string>;
  userId: string | null;
  projectId: string | null;
  status: RequestStatus | null;
  type: string | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Timestamp | null;
};
export type ProjectImage = {
  id: Generated<string>;
  ownerId: string;
  path: string;
  type: string | null;
};
export type Skill = {
  id: Generated<string>;
  name: string;
};
export type State = {
  id: Generated<string>;
  name: string;
  code: string | null;
  countryCode: string;
};
export type Subscription = {
  id: Generated<string>;
  name: string;
  code: PartnerType;
  description: string;
  maxProjects: number;
  maxEvents: number;
  maxMedia: number;
};
export type User = {
  id: Generated<string>;
  email: string;
  phoneNumber: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  role: Generated<Role>;
  type: Generated<UserType>;
  requestSend: Generated<boolean>;
  username: string | null;
  password: string | null;
  requestStatus: RequestStatus | null;
  firstName: string | null;
  lastName: string | null;
  certificationId: string | null;
  gender: string | null;
  bio: string | null;
  birthDate: Timestamp | null;
  registerCode: string | null;
  level: number | null;
  xp: number | null;
  organizationName: string | null;
  organizationType: string | null;
  introduction: string | null;
  contact: unknown | null;
  eventPermit: Generated<number>;
  projectPermit: Generated<number>;
  mediaPermit: Generated<number>;
  subscriptionId: string | null;
  subscriptionEndsAt: Timestamp | null;
};
export type UserEmailVerification = {
  id: Generated<string>;
  email: string;
  token: string;
  createdAt: Generated<Timestamp>;
  expiresAt: Timestamp | null;
  verifiedAt: Timestamp | null;
  isVerified: Generated<boolean>;
};
export type UserImage = {
  id: Generated<string>;
  ownerId: string;
  path: string;
  type: string | null;
};
export type UserSkill = {
  id: Generated<string>;
  userId: string | null;
  skillId: string | null;
};
export type DB = {
  Address: Address;
  Banner: Banner;
  BannerPosition: BannerPosition;
  Category: Category;
  CategoryEvent: CategoryEvent;
  CategoryMedia: CategoryMedia;
  CategoryProject: CategoryProject;
  Certificate: Certificate;
  CertificateTemplate: CertificateTemplate;
  City: City;
  Country: Country;
  Donation: Donation;
  Event: Event;
  EventCollaborator: EventCollaborator;
  EventImage: EventImage;
  EventParticipator: EventParticipator;
  EventRole: EventRole;
  Media: Media;
  MediaImage: MediaImage;
  Notification: Notification;
  PartnerBanner: PartnerBanner;
  Payment: Payment;
  PaymentMethod: PaymentMethod;
  Permit: Permit;
  Project: Project;
  ProjectCollaborator: ProjectCollaborator;
  ProjectImage: ProjectImage;
  Skill: Skill;
  State: State;
  Subscription: Subscription;
  User: User;
  UserEmailVerification: UserEmailVerification;
  UserImage: UserImage;
  UserSkill: UserSkill;
};
