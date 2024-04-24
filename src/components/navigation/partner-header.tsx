import Image from 'next/image';

const PartnerHeader = () => {
  return (
    <header className="flex w-full flex-row items-center justify-between p-3">
      <div>
        <Image alt="logo" src={'/images/eejii.jpeg'} width={200} height={50} />
      </div>
      <div>
        <span></span>
      </div>
    </header>
  );
};

export default PartnerHeader;
