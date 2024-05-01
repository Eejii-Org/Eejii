import type {
  Role as RoleConst,
  RequestStatus as RequestStatusConst,
  UserType as UserTypeConst,
} from './db/enums';
import type {
  Address,
  Banner as BannerDB,
  BannerPosition,
  Category,
  CategoryEvent,
  CategoryMedia,
  CategoryProject,
  Donation as DonationDB,
  Event as EventDB,
  EventImage,
  EventParticipator as EventParticipatorDB,
  Media as MediaDB,
  MediaImage as MediaImageDB,
  Project as ProjectDB,
  ProjectImage,
  ProjectCollaborator as ProjectCollaboratorDB,
  User as UserDB,
  UserImage,
  EventCollaborator as EventCollaboratorDB,
  Skill,
  EventRole,
  CertificateTemplate,
  Certificate as CertificateDB,
  Subscription,
} from './db/types';

export type Role = (typeof RoleConst)[keyof typeof RoleConst];
export type UserType = (typeof UserTypeConst)[keyof typeof UserTypeConst];
export type RequestStatus =
  (typeof RequestStatusConst)[keyof typeof RequestStatusConst];

export type VolunteerTableProps = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthday: Date;
  createdAt: Date;
  requestStatus: string;
  id: string;
};

export interface Event extends EventDB {
  Owner: UserDB & {
    Images?: UserImage[];
    Addresses?: Address[];
  };
  Categories?: {
    id: string;
    name: string;
    type: string;
    eventId: string;
    categoryId: string;
  }[];
  Images?: EventImage[];
  Collaborators?: EventCollaborator[];
  Participators?: EventParticipator[];
  Roles?: EventRole[];
}

export type EventRoleFormType = {
  name: string;
  slots: number;
}[];

export type EventList = EventDB & {
  Owner: UserDB & {
    Images: UserImage[];
  };
  Categories: {
    id: string;
    name: string;
    type: string;
    eventId: string;
    categoryId: string;
  }[];
  Images: EventImage[];
};

export type ProjectList = ProjectDB & {
  Owner: UserDB & {
    Images: UserImage[];
  };
  Images: ProjectImage[];
  Categories: {
    id: string;
    name: string;
    type: string;
    eventId: string;
    categoryId: string;
  }[];
};

export type Project = ProjectDB & {
  Owner: UserDB & {
    Images: UserImage[];
  };
  Images: ProjectImage[];
  Donations: DonationDB[];
  Categories: {
    id: string;
    name: string;
    type: string;
    eventId: string;
    categoryId: string;
  }[];
  Collaborators: ProjectCollaborator[];
};

export type EventParticipator = EventParticipatorDB & {
  User?: User;
  Event?: Event;
};

export type EventCollaborator = EventCollaboratorDB & {
  User: User;
};

export type ProjectCollaborator = ProjectCollaboratorDB & {
  User: User;
};

export type S3ParamType = {
  'Content-Type': string;
  Key: string;
  Policy: string;
  'X-Amz-Algorithm': string;
  'X-Amz-Credential': string;
  'X-Amz-Date': string;
  'X-Amz-Signature': string;
  bucket: string;
};

export type Contact = {
  phone?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

export type PaymentDetails = {
  qr_image: string;
};

export type Tab = {
  title: string;
  href: string;
};

export type ListResponse<TData> = {
  items: TData[];
  pagination: Pagination;
};

export type Pagination = {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  totalCount: number;
};

export type MyVolunteer = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  bio: string;
  phoneNumber: string;
  Address: Address;
  EventParticipator: EventParticipatorDB;
  Roles: EventRole[];
  level: number | undefined;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
};

export type MyDonation = DonationDB & {
  Project: Project;
};

export type User = UserDB & {
  Images: UserImage[];
  UserSkills?: {
    Skill: Skill;
    id: string;
    skillId: string;
    userId: string;
  }[];
  Addresses: Address[];
  Subscription?: Subscription;
};

export type Media = MediaDB & {
  Images: MediaImageDB[];
  Categories: {
    name: string;
    type: string;
    path: string;
    categoryId: string;
    mediaId: string;
  }[];
  Owner: UserDB;
};

export type MediaCategory = CategoryMedia & {
  Category: Category;
};
export type EventCategory = CategoryEvent & {
  Category: Category;
};
export type ProjectCategory = CategoryProject & {
  Category: Category;
};

export type Banner = BannerDB & {
  Position: BannerPosition;
};

export const RequestType = {
  INVITATION: 'INVITATION',
  REQUEST: 'REQUEST',
} as const;

export type Certificate = CertificateDB & {
  Template: CertificateTemplate;
  Event: Event;
};
