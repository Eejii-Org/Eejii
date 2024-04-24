import NextAuth from 'next-auth';

import { nextAuthOptions } from '@/lib/auth';

export default NextAuth(nextAuthOptions);

// export default NextAuth({
//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//   },
//   providers: [
//     // OAuth authentication providers...

//     // FacebookProvider({
//     //   clientId: process.env.FACEBOOK_ID as string,
//     //   clientSecret: process.env.FACEBOOK_SECRET as string,
//     // }),
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_ID as string,
//     //   clientSecret: process.env.GOOGLE_SECRET as string,
//     // }),

//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       id: 'Credentials',
//       name: 'Credentials',
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         username: { label: 'Username', type: 'text', placeholder: 'x' },
//         password: { label: 'Password', type: 'password', placeholder: '1' },
//       },
//       async authorize(credentials) {
//         // You need to provide your own logic here that takes the credentials
//         // submitted and returns either a object representing a user or value
//         // that is false/null if the credentials are invalid.
//         // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
//         // You can also use the `req` object to obtain additional parameters
//         // (i.e., the request IP address)

//         const user = {
//           id: '42',
//           name: 'x',
//           password: '1',
//           role: 'ROLE_USER',
//         };

//         if (
//           credentials?.username === user.name &&
//           credentials?.password === user.password
//         ) {
//           return user;
//         }

//         // save user here
//         // const res = await fetch('/your/endpoint', {
//         //   method: 'POST',
//         //   body: JSON.stringify(credentials),
//         //   headers: { 'Content-Type': 'application/json' },
//         // });
//         // const user = await res.json();

//         // // If no error and we have user data, return it
//         // if (res.ok && user) {
//         //   return user;
//         // }
//         // // Return null if user data could not be retrieved
//         // return null;
//       },
//     }),
//   ],

//   callbacks: {
//     // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
//     async jwt({ token, user }) {
//       if (user) token.role = user.role;
//       // if(token.email)
//       // const dbUser = await db
//       //   .selectFrom('User')
//       //   .where('email', '=', token.email)
//       //   .selectAll()
//       //   .executeTakeFirst();

//       // if (!dbUser) {
//       //   if (user) {
//       //     token.id = user?.id;
//       //   }
//       //   return token;
//       // }

//       return token;
//     },
//     // If you want to use the role in client components
//     async session({ session, token }) {
//       if (session?.user) session.user.role = token.role;
//       // if (session?.user)
//       // if (token.name && token.email) {
//       //   // session.user.id = token.id,
//       //   session.user.name = token.name,
//       //   session.user.email = token.email,
//       //   // session.user.image = token.picture
//       //   session.user.role = token.role
//       // }

//       return session;
//     },
//   },
// });
