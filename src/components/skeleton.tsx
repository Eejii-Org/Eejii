import type { HTMLProps } from 'react';

type SkeletonPropsType = {
  className: HTMLProps<HTMLElement>['className'];
};
export const Skeleton = ({ className = '' }: SkeletonPropsType) => {
  return <div className={`${className} bg-gray-200 animate-pulse`}></div>;
};
