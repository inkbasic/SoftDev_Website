export default function Card({ children }) {
  return (
    <>
      <div className="bg-white flex flex-col gap-3 w-full px-5 py-4 rounded-[12px] border border-neutral-300">{children}</div>
    </>
  );
}