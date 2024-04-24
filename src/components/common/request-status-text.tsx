import type { RequestStatus } from '@/lib/types';
import { Text } from '@mantine/core';

export const RequestStatusText = ({ status }: { status: RequestStatus }) => {
  return (
    <div>
      {status === 'REQUEST_PENDING' ? (
        <Text fw={500} c={'yellow'}>
          Pending
        </Text>
      ) : status === 'REQUEST_APPROVED' ? (
        <Text fw={500} c={'green'}>
          Approved
        </Text>
      ) : status === 'REQUEST_DENIED' ? (
        <Text fw={500} c={'red'}>
          Denied
        </Text>
      ) : (
        'NONE'
      )}
    </div>
  );
};
