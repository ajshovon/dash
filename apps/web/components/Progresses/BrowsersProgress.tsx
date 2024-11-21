import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chrome, Compass, Globe, MousePointerClick } from 'lucide-react';
import { RiOperaLine } from 'react-icons/ri';
import { TbBrandEdge, TbBrandFirefox } from 'react-icons/tb';
interface Browser {
  id: number;
  browser: string;
  visits: number;
}

interface BrowsersProgressProps {
  browsers: Browser[];
}

const BrowsersProgress = ({ browsers }: BrowsersProgressProps) => {
  return (
    <div className="bg-card border border-default rounded-lg">
      <Tabs defaultValue="Browsers">
        <div className="flex items-center justify-between px-4 pt-3 border-b border-default">
          <TabsList>
            <TabsTrigger value="Browsers">Browsers</TabsTrigger>
          </TabsList>
          <h3 className="text-accent-850 text-sm flex items-center gap-1">
            <MousePointerClick className="size-4" /> Clicks
          </h3>
        </div>
        <TabsContent value="Browsers" className="space-y-2">
          {browsers.map((browser: Browser, index: number) => (
            <div className="hover:bg-gray-50 dark:hover:bg-[#19191C] px-3 rounded-md" key={index}>
              <div className="flex items-center justify-between gap-5 text-sm text-accent-850 border-b border-default">
                <div className="flex items-center gap-3 py-2">
                  {browser.browser === 'Chrome' && <Chrome className="size-4" />}
                  {browser.browser === 'Firefox' && <TbBrandFirefox className="size-4" />}
                  {browser.browser === 'Safari' && <Compass className="size-4" />}
                  {browser.browser === 'Edge' && <TbBrandEdge className="size-4" />}
                  {browser.browser === 'Opera' && <RiOperaLine className="size-4" />}
                  {browser.browser === 'Other' && <Globe className="size-4" />}
                  {browser.browser}
                </div>
                <span>{browser.visits}</span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowsersProgress;
