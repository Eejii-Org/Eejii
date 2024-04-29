export const ServerSettings = {
  NOTIFICATION: {
    USER_PARTNER: {
      APPROVED_TITLE: 'Your request to join has been approved',
      APPROVED_BODY:
        'Now you can perform actions such as creating projects and particpate in one',
    },
    USER_SUPPORTER: {
      APPROVED_TITLE: 'Your request to join has been approved',
      APPROVED_BODY:
        'Now you can perform actions such as creating projects and particpate in one',
    },
    USER_VOLUNTEER: {
      APPROVED_TITLE: 'Your request to join has been approved',
      APPROVED_BODY:
        'Now you can perform actions such as creating projects and particpate in one',
    },
  },
  EMAIL: {
    VERIFICATION_EMAIL: (token: string) => {
      return {
        GREETINGS: `Hello`,
        BODY: `EEJII.org, Use below code to verify your email to continue registering.`,
        NOTE: null,
        LABEL: token,
        SUBJECT: `EEJII.org, Verify your email to continue registering.`,
      };
    },
    APPROVE_USER: (isPartner: boolean, username: string) => {
      return {
        GREETINGS: `Congratulations ${username}`,
        BODY: `Your request to become ${isPartner ? 'partner' : 'volunteer'} has been approved.`,
        NOTE: null,
        LABEL: null,
        SUBJECT: `Your request to become ${isPartner ? 'partner' : 'volunteer'} has been approved.`,
      };
    },
    DENY_USER: (isPartner: boolean, username: string) => {
      return {
        GREETINGS: `Hey there, ${username}`,
        BODY: `After carefull examination process we are sorry to inform you that your request to be part of EEJII's ${isPartner ? 'partner' : 'volunteer'} has been denied.`,
        NOTE: 'We are happy to wellcome you when you are ready. Goodluck',
        LABEL: '',
        SUBJECT: '',
      };
    },
    MAX_POINT: (title: string, maxPoint: number) => {
      return {
        GREETINGS: 'Hey there',
        BODY: `Thanks for partnering with us on ${title}! As a reminder, our volunteer point system has a pre-calculated maximum point value for each opportunity. This ensures fairness and recognizes the impact of various tasks. The maximum point value for each role in ${title} is`,
        NOTE: 'When assigning points to volunteers after the event, please keep this maximum in mind.',
        LABEL: `${maxPoint}`,
        SUBJECT: `Eejii.org, A max point to assign to your volunteers for ${title} volunteering event was calculated`,
      };
    },
    APPROVE_PROJECT: (isProject: boolean, title: string) => {
      return {
        GREETINGS: 'Congratulations',
        BODY: `I am pleased to inform you that your request to create the "${title}" ${isProject ? 'project' : 'event'} has been approved.  We are excited to collaborate with you on this initiative.`,
        NOTE: '',
        LABEL: '',
        SUBJECT: `Eejii.org. Approval Received: ${title} ${isProject ? 'project' : 'event'} creation`,
      };
    },
    DENY_PROJECT: (isProject: boolean, title: string) => {
      return {
        GREETINGS: 'Congratulations',
        BODY: `Thank you for submitting your request to create the "${title}" ${isProject ? 'project' : 'event'}. We appreciate your interest in collaborating with us.`,
        NOTE: `After careful consideration, we have decided to deny the request due to criteria of Eejii.org.`,
        LABEL: '',
        SUBJECT: `Update on ${title} ${isProject ? 'project' : 'event'} Event Creation Request`,
      };
    },
    INVITE_USER_TO_PROJECT: (
      projectTitle: string,
      ownerName: string,
      username: string
    ) => {
      return {
        GREETINGS: `Hey there ${username},`,
        BODY: `You have invited to participate in ${projectTitle} by ${ownerName}.`,
        NOTE: '', //TODO project card
        LABEL: '',
        SUBJECT: `You have invited to participate in ${projectTitle} by ${ownerName}.`,
      };
    },
    JOIN_REQUEST_TO_PROJECT: (
      isProject: string,
      projectTitle: string,
      ownerName: string,
      username: string
    ) => {
      return {
        GREETINGS: `Hello ${ownerName}`,
        BODY: `${username} has requested to join to your ${projectTitle} ${isProject ? 'project' : 'event'}.`,
        NOTE: 'You can approve or deny the request in your dashboard.',
        LABEL: '',
        SUBJECT: `Eejii.org. You have new request to join to your ${projectTitle} ${isProject ? 'project' : 'event'}.`,
      };
    },
  },
};
