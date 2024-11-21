'use client';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [onHoverSidebarCollapsed, setOnHoverSidebarCollapsed] = useState(false);
  const [onHoverOpenDropdown, setOnHoverOpenDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} onHoverSidebarCollapsed={onHoverSidebarCollapsed} setOnHoverSidebarCollapsed={setOnHoverSidebarCollapsed} onHoverOpenDropdown={onHoverOpenDropdown} setOnHoverOpenDropdown={setOnHoverOpenDropdown} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />

      <div className={`${isSidebarCollapsed ? 'xl:ml-[98px]' : 'xl:ml-[274px]'} w-full transition-margin duration-300`}>
        <div className="flex flex-col justify-between w-full min-h-svh">
          <Header isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} onHoverOpenDropdown={onHoverOpenDropdown} setOpenDropdown={setOpenDropdown} isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />
          <main className="flex-1 sm:my-6 my-3 overflow-y-auto sm:px-6 px-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
