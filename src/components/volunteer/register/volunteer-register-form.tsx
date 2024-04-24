import { SelectCityField } from '@/components/form/fields/select-city-field';
import { SelectCountryField } from '@/components/form/fields/select-country-field';
import { SelectStateField } from '@/components/form/fields/select-state-field';
import { api } from '@/utils/api';
import {
  Button,
  Flex,
  Group,
  InputLabel,
  PasswordInput,
  Radio,
  Select,
  Stack,
  Stepper,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const mongolianLetters = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ё',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'Ө',
  'П',
  'Р',
  'С',
  'Т',
  'У',
  'Ү',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'Ъ',
  'Ы',
  'Ь',
  'Э',
  'Ю',
  'Я',
];

export default function VolunteerRegisterForm() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('MN');
  const [selectedState, setSelectedState] = useState<string>('047');

  function isValidDate(dateString: string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const { mutateAsync: registerVolunteer, isLoading: isPending } =
    api.volunteer.register.useMutation();

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      facebook: '',
      email: '',
      gender: '',
      birthDate: '',
      letter1: '',
      letter2: '',
      registerNumber: '',
      registerCode: '',
      bio: '',
      address: {
        countryCode: '',
        provinceName: '',
        city: '',
        district: '',
        street: '',
      },
    },
    validateInputOnChange: true,
    validate:
      // zodResolver(volunteerSchema),
      //TODO validation iig saijruulah
      //TODO User email oruulahd shuud db ees burtguulsen bol door ni burtguulsen gj aldaa ogoh

      values => {
        if (active === 0) {
          return {
            firstName:
              values.firstName.trim().length < 2
                ? 'Username must include at least 2 characters'
                : null,
            lastName:
              values.lastName.trim().length < 2
                ? 'Username must include at least 2 characters'
                : null,

            phoneNumber:
              values.phoneNumber.trim().length != 8
                ? 'Phone number is invalid'
                : null,
            email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',

            password:
              values.password.length < 6
                ? 'Password must include at least 6 characters'
                : values.password == values.confirmPassword
                  ? null
                  : 'Password is not same',
            confirmPassword:
              values.password.length < 6
                ? 'confirmPassword must include at least 6 characters'
                : values.password == values.confirmPassword
                  ? null
                  : 'Password is not same',
          };
        }

        if (active === 1) {
          return {
            birthDate: isValidDate(values.birthDate) ? null : 'Invalid date',
            gender:
              values.gender.trim().length < 2 ? 'Gender must be checked' : null,
            letter1:
              values.letter1.trim().length < 1
                ? 'First letter must be selected'
                : null,
            letter2:
              values.letter2.trim().length < 1
                ? 'Second letter must be selected'
                : null,
            registerNumber:
              /^[0-9]*$/.test(values.registerNumber) &&
              values.registerNumber.length === 8
                ? null
                : 'Register number is invalid',
          };
        }
        if (active === 2) {
          return {
            //address
            city:
              values.address.city.trim().length < 2
                ? 'Please fill in city'
                : null,
            provinceName:
              values.address.provinceName.trim().length < 2
                ? 'Please choose province'
                : null,
            countryCode:
              values.address.countryCode.trim().length < 2
                ? 'Please choose country'
                : null,
            bio:
              values.bio.trim().length < 10
                ? 'Bio must include at least 10 characters'
                : null,
            // registerCode:
            //   values.registerCode.trim().length < 2
            //     ? 'registerCode is null'
            //     : null,
          };
        }

        return {};
      },
  });

  const nextStep = () =>
    setActive(current => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 2 ? current + 1 : current;
    });

  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current));

  const data = mongolianLetters.map(letter => ({
    value: letter,
    label: letter,
  }));

  async function handleSubmit(values: typeof form.values) {
    const registerCode = `${values.letter1}${values.letter2}${values.registerNumber}`;
    //TODO Error handler bichij feedback haruulah toaster etc
    const res = await registerVolunteer({
      ...values,
      registerCode,
      birthDate: new Date(values.birthDate),
    });

    if (res.status == 201) {
      notifications.show({
        title: 'Success',
        message: 'Successfully created volunteer account',
      });
      console.log(res.result);
      const { password, email } = res.result;
      //TODO Redirect zasah
      await signIn('Credentials', { email, password, redirect: false });

      router.push(`/v`);
    }
  }

  //TODO UI iig design system iin daguu tsarailag bolgoh

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stepper active={active}>
          <Stepper.Step label="Холбоо барих">
            <h1 className="text-[#616161]">
              Доор шаардагдах мэдээллийг та үнэн зөв оруулна уу!
            </h1>
            <TextInput
              mt="md"
              radius="lg"
              label="Овог:"
              placeholder="lastName"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('lastName')}
            />
            <TextInput
              mt="md"
              radius="lg"
              label="Нэр:"
              placeholder="firstName"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              mt="md"
              radius="lg"
              label="Утасны дугаар:"
              placeholder="phoneNumber"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('phoneNumber')}
            />

            <TextInput
              mt="md"
              radius="lg"
              label="И-мэйл:"
              placeholder="email"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mt="md"
              radius="lg"
              label="Нууц үг:"
              placeholder="Password"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              mt="md"
              radius="lg"
              label="Нууц үг дахин давтах:"
              placeholder="confirmPassword"
              className="border-[#3c888d] text-start"
              {...form.getInputProps('confirmPassword')}
            />
          </Stepper.Step>

          <Stepper.Step label="Хувийн мэдээлэл">
            <InputLabel className="text-start">Төрсөн өдөр</InputLabel>
            <DateInput
              {...form.getInputProps('birthDate')}
              valueFormat="YYYY-M-DD"
              placeholder="Pick birth date"
              w={'100%'}
              radius="lg"
              className="text-start"
            />
            <Radio.Group
              name="Gender"
              mt="md"
              {...form.getInputProps('gender')}
            >
              <Group mt="xs">
                <Radio label="Эрэгтэй" value={'male'} />
                <Radio label="Эмэгтэй" value={'female'} />
              </Group>
            </Radio.Group>
            <Stack w={'100%'} mt="md">
              <InputLabel className="text-start">Регистрийн дугаар</InputLabel>
              <Flex gap={20}>
                <Select
                  data={data}
                  {...form.getInputProps('letter1')}
                  placeholder="Select a letter"
                  radius="xl"
                />
                <Select
                  data={data}
                  {...form.getInputProps('letter2')}
                  placeholder="Select a letter"
                  radius="xl"
                />
                <TextInput
                  {...form.getInputProps('registerNumber')}
                  placeholder="Enter a number"
                  w="100%"
                  radius="xl"
                />
              </Flex>
            </Stack>
          </Stepper.Step>

          {/* <Stepper.Step label="Гэрийн хаяг" description="Social media">
          <TextInput
            label="Website"
            placeholder="Website"
            {...form.getInputProps('website')}
          />
          <TextInput
            mt="md"
            label="GitHub"
            placeholder="GitHub"
            {...form.getInputProps('github')}
          />
        </Stepper.Step> */}
          <Stepper.Step label="Танилцуулга">
            <Flex mt="md" gap={'md'} align={'center'}>
              <SelectCountryField
                defaultValue={form.getInputProps('address.countryCode').value}
                handleChange={v => {
                  form.getInputProps('address.countryCode').onChange(v);
                  setSelectedCountry(v);
                }}
              />
              <SelectStateField
                country={selectedCountry}
                defaultValue={form.getInputProps('address.provinceName').value}
                handleChange={v => {
                  form.getInputProps('address.provinceName').onChange(v);
                  setSelectedState(v);
                }}
              />
              <SelectCityField
                country={selectedCountry}
                state={selectedState}
                defaultValue={form.getInputProps('address.city').value}
                handleChange={form.getInputProps('address.city').onChange}
              />
            </Flex>
            <Flex mt="md" gap={'md'} align={'center'}>
              <TextInput
                mt={'md'}
                {...form.getInputProps('address.district')}
                label="Дүүрэг, сум"
                w={'100%'}
                radius={'xl'}
                placeholder="Дүүрэг, сум"
              />
              <TextInput
                mt={'md'}
                w={'100%'}
                {...form.getInputProps('address.street')}
                label="Гудамж (optional)"
                radius={'xl'}
                placeholder="Гудамж"
              />
            </Flex>
            <Textarea
              placeholder="bio"
              label="bio"
              autosize
              minRows={4}
              {...form.getInputProps('bio')}
            />
          </Stepper.Step>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep} radius="xl">
              Back
            </Button>
          )}
          {active !== 2 ? (
            <Button onClick={nextStep} bg="#3c888d" radius="xl">
              Next step
            </Button>
          ) : (
            <Button type="submit" loading={isPending} bg="#3c888d" radius="xl">
              Register
            </Button>
          )}
        </Group>
      </form>
    </div>
  );
}
