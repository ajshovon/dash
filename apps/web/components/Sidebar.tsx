import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { PiChartBarDuotone, PiCursorClickDuotone, PiGearDuotone, PiLinkDuotone } from 'react-icons/pi';
import SiteLogo from './SiteLogo';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onHoverSidebarCollapsed: boolean;
  setOnHoverSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openDropdown: boolean;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  onHoverOpenDropdown: boolean;
  setOnHoverOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarCollapsed, setIsSidebarCollapsed, onHoverSidebarCollapsed, setOnHoverSidebarCollapsed, onHoverOpenDropdown, setOnHoverOpenDropdown, openDropdown, setOpenDropdown, isSheetOpen, setIsSheetOpen }: SidebarProps) {
  const currentPath = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (openDropdown && dropdownRef.current) {
      dropdownRef.current.style.maxHeight = `${dropdownRef.current.scrollHeight}px`;
    } else if (dropdownRef.current) {
      dropdownRef.current.style.maxHeight = '0px';
    }
  }, [openDropdown]);

  // Close sheet on route change
  useEffect(() => {
    setIsSheetOpen(false);
  }, [currentPath, setIsSheetOpen]);

  return (
    <>
      {/* Sidebar at XL device */}
      <aside
        className="xl:block hidden fixed top-0 bottom-0 sm:py-6 py-3 sm:pl-6 pl-3"
        onMouseEnter={() => {
          if (isSidebarCollapsed && !onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(false);
            setOnHoverSidebarCollapsed(true);
            if (onHoverOpenDropdown) setOpenDropdown(true);
          }
        }}
        onMouseLeave={() => {
          if (!isSidebarCollapsed && onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(true);
            setOnHoverSidebarCollapsed(false);
            setOpenDropdown(false);
          }
        }}
      >
        <div className={`${isSidebarCollapsed ? 'xl:w-[72px]' : 'xl:w-[248px]'} h-full border border-default rounded-lg overflow-hidden flex flex-col bg-card transition-width duration-300`}>
          {/* Logo */}
          <div className="p-4 border-b border-default">
            <Link href="/" className="inline-block">
              <SiteLogo />
            </Link>
          </div>
          {/* Nav Links */}
          <div className={`h-full flex-1 overflow-y-auto space-y-1 ${isSidebarCollapsed ? 'px-3 my-3' : 'sm:px-4 px-3'}`}>
            {/* label */}
            {!isSidebarCollapsed && <h4 className="text-default-900 font-semibold uppercase mb-3 sm:mt-4 mt-3 text-xs">Menu</h4>}

            {/* Nav links */}
            <Link href="/links" className={`${currentPath.startsWith('/links') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className={`flex-grow-0 ${isSidebarCollapsed && 'w-full flex justify-center'}`}>
                <PiLinkDuotone className="!size-5" />
              </span>
              {!isSidebarCollapsed && <div className="text-box flex-grow">Links</div>}
            </Link>

            <Link href="/analytics" className={`${currentPath.startsWith('/analytics') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className={`flex-grow-0 ${isSidebarCollapsed && 'w-full flex justify-center'}`}>
                <PiChartBarDuotone className="!size-5" />
              </span>
              {!isSidebarCollapsed && <div className="text-box flex-grow">Analytics</div>}
            </Link>

            <Link href="/events" className={`${currentPath.startsWith('/events') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className={`flex-grow-0 ${isSidebarCollapsed && 'w-full flex justify-center'}`}>
                <PiCursorClickDuotone className="!size-5" />
              </span>
              {!isSidebarCollapsed && <div className="text-box flex-grow">Events</div>}
            </Link>

            <Link href="/settings" className={`${currentPath.startsWith('/settings') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className={`flex-grow-0 ${isSidebarCollapsed && 'w-full flex justify-center'}`}>
                <PiGearDuotone className="!size-5" />
              </span>
              {!isSidebarCollapsed && <div className="text-box flex-grow">Settings</div>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Sidebar at LG and Small device */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="border-default">
          <SheetHeader className="hidden">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="py-4 border-b border-default">
            <Image src="/logo.svg" height={60} width={60} alt="DASH" />
          </div>

          {/* Nav Links */}
          <div className="h-full flex-1 overflow-y-auto space-y-1">
            {/* label */}
            <h4 className="text-default-900 font-semibold uppercase mb-3 sm:mt-4 mt-3 text-xs">Menu</h4>

            {/* Nav links */}
            <Link href="/links" className={`${currentPath.startsWith('/links') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className="flex-grow-0">
                <PiLinkDuotone className="!size-5" />
              </span>
              <div className="text-box flex-grow">Links</div>
            </Link>

            <Link href="/analytics" className={`${currentPath.startsWith('/analytics') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className="flex-grow-0">
                <PiChartBarDuotone className="!size-5" />
              </span>
              <div className="text-box flex-grow">Analytics</div>
            </Link>

            <Link href="/events" className={`${currentPath.startsWith('/events') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className="flex-grow-0">
                <PiCursorClickDuotone className="!size-5" />
              </span>
              <div className="text-box flex-grow">Events</div>
            </Link>

            <Link href="/settings" className={`${currentPath.startsWith('/settings') && 'bg-primary text-white'} flex items-center gap-3 text-sm font-medium capitalize px-[10px] py-3 rounded-lg text-[#334155] dark:text-[#cbd5e1] hover:bg-primary hover:text-white`}>
              <span className="flex-grow-0">
                <PiGearDuotone className="!size-5" />
              </span>
              <div className="text-box flex-grow">Settings</div>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
