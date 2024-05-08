import type { Media } from '@/lib/types';
import { api } from '@/utils/api';
import { Card } from '../card/card';

export const RelatedMedias = () =>
  // { id }: { id: string }

  {
    //Доорх query ажлиллахгүй байсан тул filter-гүйгээр list авлаа.

    // const { data: medias, isLoading } = api.media.findRelated.useQuery({
    //   limit: 3,
    //   excludeId: id,
    // });
    const { data: medias } = api.media.findAll.useQuery({
      limit: 3,
    });

    if (medias && 0 < medias.length) {
      return (
        <div className="w-full">
          <h4 className="font-semibold text-3xl text-center mb-8">
            Холбоотой мэдээллүүд
          </h4>
          <div className="grid md:grid-cols-3 gap-8">
            {medias.map(media => (
              <Card
                key={media.title}
                cardData={media as unknown as Media}
                cardType="media"
              />
            ))}
          </div>
        </div>
      );
    } else return <></>;
  };
