import tabsClasses from '@/styles/Tabs.module.css';
import { useRouter } from 'next/router';

import PartnerLayout from '@/components/layout/partner-layout';

import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  Space,
  Tabs,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

const Index = () => {
  // const session = useSession();
  const router = useRouter();
  // const [status, setStatus] = useState('approved');

  // const { data: EventCollaborator, isLoading: isEventLoading } =
  //   api.eventUser.findAll.useQuery({
  //     userId: session.data?.user.id,
  //     status: status,
  //   });
  // const { data: ProjectCollaborator, isLoading: isFundLoading } =
  //   api.projectUser.findAll.useQuery({
  //     userId: session.data?.user.id,
  //     status: status,
  //   });
  // const { data: grantAssociation, isLoading: isGrantLoading } =
  //   api.grantAssociation.findAll.useQuery({
  //     userId: session.data?.user.id,
  //     status: status,
  //   });

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <BackgroundImage
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
          radius="sm"
          h={300}
        >
          <Flex p="md" justify={'space-between'} align={'center'}>
            <Text c="white" fz={'xl'} fw={700}>
              Manage projects
            </Text>
            <Button
              component={Link}
              href={'/p/projects/new'}
              size="lg"
              radius={'xl'}
              c="white"
              fz={'lg'}
              leftSection={<IconPlus />}
            >
              Add project
            </Button>
          </Flex>
        </BackgroundImage>
        <Space h={'md'} />
        <Tabs
          defaultValue="project"
          classNames={{
            list: tabsClasses.list,
            tab: tabsClasses.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="project">Project</Tabs.Tab>
            <Tabs.Tab
              value="grant_project"
              onClick={() => router.push('/p/manage/grant')}
            >
              Grant project
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space h={'lg'} />
      </Container>
    </PartnerLayout>
  );
};

export default Index;
