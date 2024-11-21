import FullScreenToggle from './FullScreenToggle';
import ProfileInfo from './ProfileInfo';
import ThemeButton from './theme-button';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  onHoverOpenDropdown: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isSidebarCollapsed, setIsSidebarCollapsed, onHoverOpenDropdown, setOpenDropdown, isSheetOpen, setIsSheetOpen }: HeaderProps) {
  return (
    <header className="sm:pt-6 pt-3 sm:px-6 px-3 backdrop-blur rounded-b-md w-full sticky top-0 z-50">
      <div className="bg-card w-full py-4 sm:px-6 px-3 rounded-lg border border-default shadow-md">
        <div className="flex justify-between items-center gap-5">
          <div>
            <button
              onClick={() => {
                if (!isSidebarCollapsed) {
                  setOpenDropdown(false);
                } else if (onHoverOpenDropdown) setOpenDropdown(true);
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
              className="xl:block hidden"
            >
              <div className="flex flex-col justify-between w-[20px] h-[16px] transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div className={`bg-accent-800 h-[2px] transform transition-all duration-300 origin-left delay-150 ${isSidebarCollapsed && 'rotate-[42deg] w-[11px]'}`}></div>
                <div className={`bg-accent-800 h-[2px] w-7 rounded transform transition-all duration-300 ${isSidebarCollapsed && 'hidden'}`}></div>
                <div className={`bg-accent-800 h-[2px] transform transition-all duration-300 origin-left delay-150 ${isSidebarCollapsed && '-rotate-[43deg] w-[11px]'}`}></div>
              </div>
            </button>
            <button onClick={() => setIsSheetOpen(true)} className="xl:hidden p-4">
              <div className="flex flex-col justify-between w-[20px] h-[16px] transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div className={`bg-accent-800 h-[2px] transform transition-all duration-300 origin-left delay-150 ${isSheetOpen && 'rotate-[42deg] w-[11px]'}`}></div>
                <div className={`bg-accent-800 h-[2px] w-7 rounded transform transition-all duration-300 ${isSheetOpen && 'hidden'}`}></div>
                <div className={`bg-accent-800 h-[2px] transform transition-all duration-300 origin-left delay-150 ${isSheetOpen && '-rotate-[43deg] w-[11px]'}`}></div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <FullScreenToggle />
            <ThemeButton />
            <ProfileInfo />
          </div>
        </div>
      </div>
    </header>
  );
}
