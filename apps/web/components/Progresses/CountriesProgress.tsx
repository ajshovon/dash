import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findFlagUrlByIso2Code } from 'country-flags-svg-v2';
import { MousePointerClick } from 'lucide-react';
import Image from 'next/image';

interface Country {
  id: number;
  country: string;
  visits: number;
}

interface CountriesProgressProps {
  countries: Country[];
}

const CountriesProgress = ({ countries }: CountriesProgressProps) => {
  return (
    <div className="bg-card border border-default rounded-lg">
      <Tabs defaultValue="Countries" className="">
        <div className="flex items-center justify-between px-4 pt-3 border-b border-default">
          <TabsList>
            <TabsTrigger value="Countries">Countries</TabsTrigger>
          </TabsList>
          <h3 className="text-accent-850 text-sm flex items-center gap-1">
            <MousePointerClick className="size-4" /> Clicks
          </h3>
        </div>
        <TabsContent value="Countries" className="space-y-2">
          {countries.map((country: Country, index: number) => (
            <div className="hover:bg-gray-50 dark:hover:bg-[#19191C] px-3 rounded-md" key={index}>
              <div className="flex items-center justify-between gap-5 text-sm text-accent-850 border-b border-default">
                <div className="flex items-center gap-3 py-2">
                  <Image src={findFlagUrlByIso2Code(country.country)} width={20} height={20} alt={`${country.country} flag`} /> {country.country}
                </div>
                <span>{country.visits}</span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountriesProgress;
