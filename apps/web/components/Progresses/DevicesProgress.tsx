import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, MousePointerClick, Smartphone } from 'lucide-react';

interface Device {
  id: number;
  device: string;
  visits: number;
}

interface DevicesProgressProps {
  devices: Device[];
}

const DevicesProgress = ({ devices }: DevicesProgressProps) => {
  return (
    <div className="bg-card border border-default rounded-lg">
      <Tabs defaultValue="Devices">
        <div className="flex items-center justify-between px-4 pt-3 border-b border-default">
          <TabsList>
            <TabsTrigger value="Devices">Devices</TabsTrigger>
          </TabsList>
          <h3 className="text-accent-850 text-sm flex items-center gap-1">
            <MousePointerClick className="size-4" /> Clicks
          </h3>
        </div>
        <TabsContent value="Devices" className="space-y-2">
          {devices?.map((device: Device, index: number) => (
            <div className="hover:bg-gray-50 dark:hover:bg-[#19191C] px-3 rounded-md" key={index}>
              <div className="flex items-center justify-between gap-5 text-sm text-accent-850 border-b border-default">
                <div className="flex items-center gap-3 py-2">
                  {device.device === 'Mobile' ? <Smartphone className="size-4" /> : <Monitor className="size-4" />} {device.device}
                </div>
                <span>{device.visits}</span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevicesProgress;
