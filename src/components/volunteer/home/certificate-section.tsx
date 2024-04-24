import { Paper, Text, Button, Flex } from '@mantine/core';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportLetter } from '@/components/pdf/report-letter';
import dynamic from 'next/dynamic';
import { CertificatesSlider } from './certificates-slider';
import { api } from '@/utils/api';
import type { EventParticipator } from '@/lib/types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(el => el.PDFDownloadLink),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export const CertificateSection = ({
  qrCode,
  userId,
}: {
  qrCode: string;
  userId: string | undefined;
}) => {
  const { data: participations, isLoading } =
    api.eventUser.findAllEventParticipator.useQuery(
      { userId: userId },
      { enabled: !!userId }
    );

  return (
    <Paper bg={'white'} p={20} shadow="xs">
      <Flex align={'center'} justify={'space-between'}>
        <Text fz="20" fw={500}>
          Сэртификат
        </Text>
        <Button
          radius="lg"
          variant={'outline'}
          color="primary"
          component="div"
          loading={isLoading && !participations}
          disabled={participations === undefined || participations.length === 0}
        >
          <PDFDownloadLink
            document={
              <ReportLetter
                qrCode={qrCode}
                participations={
                  participations as unknown as EventParticipator[]
                }
              />
            }
            fileName="report-letter.pdf"
          >
            {({ loading }) =>
              loading ? 'Loading document...' : 'Тодорхойлолт авах'
            }
          </PDFDownloadLink>
        </Button>
      </Flex>
      <CertificatesSlider qrCode={qrCode} />
    </Paper>
  );
};
