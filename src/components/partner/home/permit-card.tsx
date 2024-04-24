import {
  Button,
  Paper,
  Box,
  Text,
  Flex,
  Modal,
  ThemeIcon,
  Stack,
  Center,
  Skeleton,
} from '@mantine/core';
import { FallbackImage } from '@/components/common/fallback-image';
import { priceFormat } from '@/lib/utils/price';
import type { Payment, Permit } from '@/lib/db/types';
import { PermitType } from '@/lib/db/enums';
import { IconCalendar, IconHeartHandshake } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import {
  useCreatePermitInvoice,
  useVerifyPermitInvoice,
} from '@/lib/hooks/permit-payment';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import type { PaymentDetails } from '@/lib/types';

export const PermitCard = ({ permit }: { permit: Permit }) => {
  const { data: userData } = useSession();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [createPermitInvoice, { loading: createPermitInvoiceLoading }] =
    useCreatePermitInvoice();
  const [verifyPermitInvoice, { loading: verifyPermitInvoiceLoading }] =
    useVerifyPermitInvoice();

  function handleOpen() {
    createPermitInvoice(permit.id, userData?.user.id).then(res => {
      setPayment(res as Payment);
      open();
    });
  }

  if (createPermitInvoiceLoading) return <Skeleton height={300} width={380} />;

  return (
    <div>
      <Paper
        bg={'white'}
        p={'md'}
        w={'99%'}
        component="button"
        onClick={handleOpen}
      >
        <Stack gap={'xs'}>
          <Center>
            {permit.type === PermitType.BANNER && (
              <FallbackImage src="" alt="" width={100} height={150} fullWidth />
            )}
            {permit.type === PermitType.PROJECT && (
              <ThemeIcon size={70} p="md" radius={'50%'} variant="light">
                <IconHeartHandshake size={50} />
              </ThemeIcon>
            )}
            {permit.type === PermitType.EVENT && (
              <ThemeIcon size={70} p="md" radius={'50%'} variant="light">
                <IconCalendar size={50} />
              </ThemeIcon>
            )}
          </Center>
          <Flex direction={'column'} align={'start'}>
            <Text size="lg" fw="600">
              {permit.name}
            </Text>
            <Text c="dimmed" size="sm">
              {permit.description}
            </Text>
          </Flex>
          <Flex justify={'end'}>
            <Box pos="relative" pt={'md'} pr="md">
              <Text c="primary" size="lg" fw="500">
                {priceFormat(permit.price, 'MNT')}
              </Text>
              <Text
                c="dimmed"
                size="sm"
                pos="absolute"
                top="0"
                right={0}
                td="line-through"
              >
                {priceFormat(permit.originalPrice, 'MNT')}
              </Text>
            </Box>
          </Flex>
        </Stack>
      </Paper>
      <Modal
        onClose={close}
        opened={opened}
        title={`${permit.name}`}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Stack>
          <FallbackImage
            fullWidth
            fullHeight
            style={{ aspectRatio: '1/1' }}
            width={300}
            height={300}
            alt="qr"
            src={`data:image/png;base64,${(payment?.details as PaymentDetails)?.qr_image}`}
          />
          <Button
            fullWidth
            type="button"
            variant="outline"
            radius="xl"
            onClick={() =>
              verifyPermitInvoice(payment?.id).then(res => {
                const response = res as { code: string; data: any };
                if (response.code === 'PAID') {
                  close();
                  notifications.show({
                    title: 'Paid',
                    message: 'Successfully paid',
                    color: 'green',
                  });
                } else {
                  notifications.show({
                    title: 'Not paid',
                    message: 'Not yet paid',
                  });
                }
              })
            }
            loading={verifyPermitInvoiceLoading}
          >
            Шалгах
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};
