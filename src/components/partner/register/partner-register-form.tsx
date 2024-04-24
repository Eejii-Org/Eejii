import { SelectCityField } from '@/components/form/fields/select-city-field';
import { SelectCountryField } from '@/components/form/fields/select-country-field';
import { SelectStateField } from '@/components/form/fields/select-state-field';
import { api } from '@/utils/api';
import {
  Button,
  Flex,
  Group,
  PasswordInput,
  Select,
  Stepper,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const orgTypes = [
  { value: 'governmentOrganization', label: 'Төрийн байгууллага' },
  { value: 'nonGovernmentOrganization', label: 'Төрийн бус байгууллага' },
  { value: 'internationalOrganization', label: 'Олон улсын байгууллага' },
  { value: 'educationOrganization', label: 'Боловсролын байгууллага' },
  { value: 'healthOrganization', label: 'Эрүүл мэндийн байгууллага' },
  { value: 'otherOrganization', label: 'Бусад' },
];

export default function PartnerRegisterForm() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('MN');
  const [selectedState, setSelectedState] = useState<string>('047');

  const { mutateAsync: registerPartner, isLoading: isPending } =
    api.partner.register.useMutation();

  const form = useForm({
    initialValues: {
      organizationType: '',
      organizationName: '',
      email: '',
      password: '',
      confirmPassword: '',
      contact: {
        phoneNumber1: '',
        phoneNumber2: '',
      },
      address: {
        countryCode: '',
        provinceName: '',
        city: '',
        district: '',
        street: '',
      },
      bio: '',
      introduction: '',
    },
    validateInputOnChange: true,
    validate: values => {
      if (active === 0) {
        return {
          organizationType:
            values.organizationType.trim().length < 1
              ? 'Must Select Organization Type'
              : null,
        };
      }
      if (active === 1) {
        return {
          organizationName:
            values.organizationName.trim().length < 2
              ? 'organizationName must include at least 2 characters'
              : null,
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
          //address
          street:
            values.address.street.trim().length < 2
              ? 'Please provide address info'
              : null,
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
          // contact
          phoneNumber1:
            values.contact.phoneNumber1.trim().length < 6
              ? 'Phone number is invalid'
              : null,
          phoneNumber2:
            values.contact.phoneNumber2.trim().length < 6
              ? 'Phone number is invalid'
              : null,
        };
      }
      if (active == 2) {
        return {
          bio:
            values.bio.trim().length < 10
              ? 'bio must include at least 10 characters'
              : null,
        };
      }
      if (active == 3) {
        return {
          introduction:
            values.introduction.trim().length < 10
              ? 'introduction must include at least 10 characters'
              : null,
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
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current));

  async function handleSubmit(values: typeof form.values) {
    const res = await registerPartner(values);
    if (res.status == 201) {
      notifications.show({
        title: 'Success',
        message: 'Successfully created partner account',
      });
      const { password, email } = res.result;
      //TODO Redirect zasah
      await signIn('Credentials', { email, password, redirect: false });

      router.push(`/p`);
    }
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stepper active={active}>
          <Stepper.Step label="Байгууллагын төрөл">
            <h1 className="mb-3 text-[#616161]">
              Доор шаардагдах мэдээллийг та үнэн зөв оруулна уу!
            </h1>
            <Select
              label=""
              placeholder="Таны Байгууллагын төрөл"
              data={orgTypes}
              defaultValue="React"
              radius="xl"
              mt="4"
              {...form.getInputProps('organizationType')}
              clearable
            />
          </Stepper.Step>

          <Stepper.Step label="Байгууллагын мэдээлэл">
            <TextInput
              label="Байгууллагын нэр:"
              placeholder="organizationName"
              className="text-start"
              radius="lg"
              {...form.getInputProps('organizationName')}
            />
            <TextInput
              mt="md"
              label="И-мэйл:"
              placeholder="Email"
              className="text-start"
              radius="lg"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mt="md"
              label="Нууц үг:"
              placeholder="Password"
              className="text-start"
              radius="lg"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              mt="md"
              label="Нууц үг дахин давтах:"
              placeholder="confirmPassword"
              className="text-start"
              radius="lg"
              {...form.getInputProps('confirmPassword')}
            />
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
                radius={'xl'}
                placeholder="Дүүрэг, сум"
              />
              <TextInput
                mt={'md'}
                {...form.getInputProps('address.street')}
                label="Гудамж (optional)"
                radius={'xl'}
                placeholder="Гудамж"
              />
            </Flex>

            <TextInput
              mt="md"
              label="Утасны дугаар 1:"
              placeholder="phoneNumber1"
              className="text-start"
              radius="lg"
              {...form.getInputProps('contact.phoneNumber1')}
            />
            <TextInput
              mt="md"
              label="Утасны дугаар 2:"
              placeholder="phoneNumber2"
              className="text-start"
              radius="lg"
              {...form.getInputProps('contact.phoneNumber2')}
            />
          </Stepper.Step>

          <Stepper.Step label="Байгууллагын мэдээлэл">
            <Textarea
              placeholder="bio"
              label="Био"
              autosize
              minRows={4}
              className="text-start"
              {...form.getInputProps('bio')}
            />
          </Stepper.Step>
          <Stepper.Step label="Танилцуулга">
            <Textarea
              placeholder="introduction"
              label="Танилцуулга"
              autosize
              minRows={4}
              className="text-start"
              {...form.getInputProps('introduction')}
            />
          </Stepper.Step>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep} radius="xl">
              Back
            </Button>
          )}
          {active !== 3 ? (
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
