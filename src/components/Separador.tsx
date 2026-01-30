export function AnioNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex items-center w-[1500px] pointer-events-none">
      <h2 className="text-5xl font-black text-white/30 uppercase tracking-tighter select-none">
        {data.label}
      </h2>
      <div className="ml-8 flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
    </div>
  );
}
