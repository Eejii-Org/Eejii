import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UserType } from '@/lib/db/enums';
// import { UserType } from '@/lib/types';
import { Role } from '@/lib/db/enums';
import VolunteerRegisterForm from '@/components/volunteer/register/volunteer-register-form';
import PartnerRegisterForm from '@/components/partner/register/partner-register-form';
import AuthLayout from '@/components/layout/auth-layout';
import Image from 'next/image';

interface Option {
  name: string;
  image: string;
  value: UserType;
}

// // Define a type alias for the setUserType function
// type SetUserType = (value: string) => void;

export default function Signup() {
  const session = useSession();
  const router = useRouter();

  const [selectedUserType, setSelectedUserType] = useState<UserType | ''>('');

  function checkUserType(userTypeProp: UserType, role: Role) {
    if (userTypeProp == UserType.USER_VOLUNTEER && role == Role.ROLE_USER)
      return 'v';
    else if (userTypeProp == UserType.USER_PARTNER && role == Role.ROLE_USER)
      return 'p';
    else if (userTypeProp == UserType.USER_SUPPORTER && role == Role.ROLE_USER)
      return 's';
    else if (role == Role.ROLE_ADMIN) return 'admin';
    return;
  }

  useEffect(() => {
    if (session.data != null) {
      router.push(
        `/${checkUserType(session.data.user.userType, session.data.user.role)}`
      );
    }
  }, [session]);

  const options = [
    {
      name: 'Partner',
      image: '/icons/handshake.svg',
      value: UserType.USER_PARTNER,
    },
    {
      name: 'Volunteer',
      image: '/icons/volunteer.svg',
      value: UserType.USER_VOLUNTEER,
    },
    // {
    //   name: 'Person',
    //   description: 'Become a volunteer and help us with various tasks.',
    //   image: '/images/volunteer.jpg',
    //   value: 'volunteer',
    // },
  ];
  // Define a custom component for the card
  const Card = ({ option }: { option: Option }) => {
    // Destructure the option object
    const { name, image, value } = option;

    // Return the JSX for the card
    return (
      <label
        className={`w-full p-5 border cursor-pointer rounded-2xl ${
          value == selectedUserType ? 'border-primary' : 'border-black/10'
        }  hover:border-primary`}
      >
        <input
          type="radio"
          name="user-type"
          value={value}
          className="hidden"
          // Call the setUserType function with the value when the input is clicked
          onClick={() => setSelectedUserType(value)}
        />
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            {value == selectedUserType ? (
              <Image
                src={'/icons/check-boxes.svg'}
                alt="checked"
                height={24}
                width={24}
              />
            ) : (
              <Image
                src={'/icons/uncheck-boxes.svg'}
                alt="checked"
                height={24}
                width={24}
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Image src={image} alt={name} width={54} height={54} />
            {/* <div className="p-2">
              <span className="text-lg font-bold">{name}</span> */}
            <p className="text-md">{name}</p>
            {/* </div> */}
          </div>
        </div>
      </label>
    );
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full pb-10 ">
        {selectedUserType ? (
          selectedUserType == UserType.USER_VOLUNTEER ? (
            <VolunteerRegisterForm />
          ) : (
            selectedUserType == UserType.USER_PARTNER && <PartnerRegisterForm />
          )
        ) : (
          <div className="flex flex-col gap-4">
            <div className="pb-24 text-2xl text-">
              Та доорх хэрэглэгчдийн төрлөөс сонгон цааш үргэлжлүүлнэ үү.
            </div>
            <div className="flex gap-16">
              {options.map(option => (
                <Card key={option.value} option={option} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
