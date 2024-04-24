import PartnerLayout from '@/components/layout/partner-layout';
import { BasicHome } from '@/components/partner/home/basic-index';
// import { StandartHome } from '@/components/partner/home/standart-index';
import { Container } from '@mantine/core';

export default function index() {
  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <BasicHome />
        {/* <StandartHome /> */}
      </Container>
    </PartnerLayout>
  );
}
