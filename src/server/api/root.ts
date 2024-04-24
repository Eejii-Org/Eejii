import { createTRPCRouter } from '@/server/api/trpc';

import { bannerRouter } from './routers/banner-router';
import { categoryRouter } from './routers/category-router';
import { eventRouter } from './routers/event-router';
import { eventUserRouter } from './routers/event-user-router';
import { mediaRouter } from './routers/media-router';
import { partnerRouter } from './routers/partner-router';
import { projectRouter } from './routers/project-router';
import { projectUserRouter } from './routers/project-user-router';
import { userRouter } from './routers/user-router';
import { volunteerRouter } from './routers/volunteer-router';
import { dataRouter } from './routers/data-router';
import { permitRouter } from './routers/permit-router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  volunteer: volunteerRouter,
  partner: partnerRouter,
  event: eventRouter,
  eventUser: eventUserRouter,
  project: projectRouter,
  projectUser: projectUserRouter,
  category: categoryRouter,
  user: userRouter,
  media: mediaRouter,
  banner: bannerRouter,
  data: dataRouter,
  permit: permitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
