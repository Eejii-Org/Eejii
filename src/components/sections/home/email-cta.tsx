export default function EmailCta() {
  return (
    <div className="bg-[#d5e4e5] py-9">
      <div className="container flex flex-col items-center justify-center gap-6">
        <div className="text-[#0C1B1C] text-2xl md:text-3xl font-semibold max-md:text-center">
          Тогтмол мэдээлэл авах
        </div>
        <div className="font-medium text-lg text-[#0C1B1C] text-center w-full md:w-3/5">
          Та санд нэмэгдэж буй шинэ төсөл хөтөлбөрүүд, хамрагдах боломжтой
          сургалт, арга хэмжээ зэрэг сүүлийн үеийн мэдээ, мэдээллүүдийг цаг
          алдалгүй, тогтмол авахыг хүсвэл дараах хэсэгт мэйл хаягаа бүртгүүлэхэд
          хангалттай.
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="Email address"
            className="rounded-full px-6 max-md:py-3 w-80 outline-none "
          />
          <button className="py-4 px-10 rounded-full bg-primary text-white font-semibold">
            Мэдээлэл авах
          </button>
        </div>
      </div>
    </div>
  );
}
