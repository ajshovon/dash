import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import getAPIUrl from '@/lib/env';
import { Link, MousePointerClick } from 'lucide-react';

interface Link {
  id: string;
  slug: string;
  clicks: number;
}

const LinksProgress = ({ links }: { links: Link[] }) => {
  return (
    <div className="bg-card border border-default rounded-lg">
      <Tabs defaultValue="shortLinks" className="">
        <div className="flex items-center justify-between px-4 pt-3 border-b border-default">
          <TabsList>
            <TabsTrigger value="shortLinks">Short Links</TabsTrigger>
            {/* <TabsTrigger value="destinationURLs">Destination URLs</TabsTrigger> */}
          </TabsList>
          <h3 className="text-accent-850 text-sm flex items-center gap-1">
            <MousePointerClick className="size-4" /> Clicks
          </h3>
        </div>
        <TabsContent value="shortLinks" className="space-y-2">
          {links?.map((link: Link) => {
            return (
              <div className="hover:bg-gray-50 dark:hover:bg-[#19191C] px-3 rounded-md" key={link?.id}>
                <div className="flex items-center justify-between gap-5 text-sm text-accent-850 border-b border-default">
                  <div className="flex items-center gap-3 py-2">
                    <Link className="size-4" /> {`${getAPIUrl()}/${link?.slug}`}
                  </div>
                  <span>{link?.clicks}</span>
                </div>
              </div>
            );
          })}
        </TabsContent>
        {/* <TabsContent value="destinationURLs" className="space-y-2">
          <div className="hover:bg-gray-50 dark:hover:bg-[#19191C] px-3 rounded-md">
            <div className="flex items-center justify-between gap-5 text-sm text-accent-850 border-b border-default">
              <div className="flex items-center gap-3 py-2">
                <Link className="size-4" /> example.com
              </div>
              <span>5</span>
            </div>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default LinksProgress;
