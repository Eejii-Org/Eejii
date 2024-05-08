import type { Media } from '@/lib/types';

import { Card } from '../card/card';

export const MediaList = ({
  medias,
  isLoading,
}: {
  medias: Media[];
  isLoading: boolean;
}) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Card cardType="media" loading={isLoading} />
            <Card cardType="media" loading={isLoading} />
            <Card cardType="media" loading={isLoading} />
          </>
        ) : (
          medias.map((media, i) => (
            <Card
              cardData={media}
              key={i}
              cardType="media"
              loading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};
