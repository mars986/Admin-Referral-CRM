export function AnnouncementBar() {
  const message = "Complimentary U.S. shipping on orders $150+. Secure, discreet fulfillment with tracking included.";

  return (
    <div className="overflow-hidden border-b border-[rgba(191,199,209,0.42)] bg-[linear-gradient(90deg,#071f45_0%,#0b1b3b_100%)] text-white">
      <div className="flex h-10 items-center">
        <div className="announcement-marquee flex w-max min-w-full items-center gap-10 whitespace-nowrap px-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] sm:px-6 sm:text-xs">
          <span aria-hidden="true">{message}</span>
          <span aria-hidden="true">{message}</span>
        </div>
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}
