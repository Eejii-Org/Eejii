import { api } from '@/utils/api';
import { List, NavLink, Skeleton, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';

export function MediaSidebar() {
  const router = useRouter();
  const category = router.query.category ?? '';

  const { data: categories, isLoading } =
    api.category.getMediaCategories.useQuery();

  if (isLoading) {
    return (
      <Stack>
        <Skeleton h={20} w={'100%'} />
        <Skeleton h={20} w={'100%'} />
        <Skeleton h={20} w={'100%'} />
      </Stack>
    );
  }

  return (
    <>
      <Title mb={5}>Medee</Title>
      <List>
        {categories && categories.length > 0
          ? categories.map((c, i) => (
              <NavLink
                key={i}
                href="#required-for-focus"
                px={2}
                mb={2}
                style={{
                  borderBottom: '1px solid var(--mantine-color-gray-3)',
                }}
                active={c.id === category}
                label={c.Category?.name}
                onClick={() => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      category: c.id,
                      categoryName: c.Category?.name,
                    },
                  });
                }}
              />
            ))
          : 'No category'}
      </List>
    </>
  );
}
