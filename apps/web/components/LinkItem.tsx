'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PiArrowBendDownRightDuotone, PiFeatherDuotone } from 'react-icons/pi';
import { toast } from 'sonner';

type FormDataType = {
  destinationUrl?: string;
  shortLink?: string;
};
type RowData = {
  id: number;
  slug: string;
  dest: string;
  clicks: number;
  createdAt: string;
};

interface LinkItemProps {
  item: RowData;
  handleDeleteConfirmation: (id: number) => void;
  mutate: () => void;
}

function getDomain(url: string) {
  try {
    // Add "https://" if it's missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return new URL(url).hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

const LinkItem: React.FC<LinkItemProps> = ({ item, handleDeleteConfirmation, mutate }) => {
  const [getResponse, setGetResponse] = useState(false);
  const fav = getDomain(item?.dest);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as FormDataType;
    setGetResponse(true);
    try {
      const res = await api.patch(`${getAPIUrl()}/api/admin/link/${item?.id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 201 || res.status === 200) {
        toast.success('Updated successfully!');
        mutate();
        setIsDialogOpen(false);
      } else {
        toast.error('Something went wrong!', { style: { color: 'orange' } });
      }
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('An error occurred while updating. Please try again later.');
    }

    setGetResponse(false);
  };

  return (
    <li className="w-full border border-default rounded-xl transition-[filter]">
      <div className="flex w-full items-center gap-5 text-sm leading-5 px-4 py-2.5 sm:gap-8 md:gap-12 ">
        <div className="min-w-0 grow">
          <div className="flex h-[60px] items-center gap-3 transition-[height] ease-in-out">
            <div className="hidden shrink-0 items-center justify-center sm:flex rounded-full p-[2px] ">
              <div className="transition-[padding] ease-in-out pr-0.5 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Image src={`https://www.google.com/s2/favicons?sz=64&domain_url=${fav}`} className="block align-middle max-w-full h-4 w-4 shrink-0 blur-none transition-[width,height] ease-in-out text-transparent rounded-full sm:h-5 sm:w-5" data-nimg={1} decoding="async" height={20} width={20} loading="lazy" draggable="false" alt={`${fav}`} />
              </div>
            </div>

            <div className="h-11 min-w-0 overflow-hidden transition-[height] ease-in-out">
              <div className="flex items-center gap-2">
                <div className="min-w-0 shrink grow-0 ">
                  <div className="flex items-center gap-2">
                    <div>
                      <a className="overflow-hidden whitespace-nowrap text-ellipsis font-semibold leading-6  transition-colors ease-in-out" title={`${getAPIUrl()}/${item?.slug}`} rel="noopener noreferrer" href={`${getAPIUrl()}/${item?.slug}`} target="_blank">
                        {`${getAPIUrl()}/${item?.slug}`}
                      </a>
                    </div>

                    <CopyToClipboard text={`${getAPIUrl()}/${item?.slug}`} onCopy={() => toast.success('Dash link copied to clipboard!')}>
                      <button type="button" className="text-sm bg-transparent cursor-pointer p-1.5 rounded-full">
                        <span className="sr-only">Copy</span>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
                          <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />
                        </svg>
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="hidden min-w-0 shrink-0 grow basis-0 items-center gap-2.5 whitespace-nowrap text-sm leading-5 opacity-0 sm:min-w-[120px] sm:basis-[120px] [transition:opacity .15s cubic-bezier(0.4,0,0.2,1),display 0s cubic-bezier(0.4,0,0.2,1) 0.15s] HDYmGZ">
                  <div className="flex min-w-0 items-center gap-1">
                    <svg className="mr-1 h-3 w-3 shrink-0 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width={18} height={18}>
                      <g fill="currentColor">
                        <line y2={9} y1={9} x2="2.75" x1="15.25" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" />
                        <polyline strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" points="11 4.75 15.25 9 11 13.25" fill="none" />
                      </g>
                    </svg>
                    <a className="overflow-hidden whitespace-nowrap text-ellipsis text-gray-500 transition-colors ease-in-out" title={`${item?.dest}`} rel="noopener noreferrer" href={`${item?.dest}`}>
                      {item?.dest}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-sm leading-5 opacity-100 md:gap-3 [transition:opacity .15s cubic-bezier(0.4,0,0.2,1),display 0s cubic-bezier(0.4,0,0.2,1) 0.15s]">
                <div className="flex min-w-0 items-center gap-1">
                  <PiArrowBendDownRightDuotone />
                  <a className="overflow-hidden whitespace-nowrap text-ellipsis text-gray-500 transition-colors ease-in-out" title={`${item?.dest}`} rel="noopener noreferrer" href={`${item?.dest}`}>
                    {item?.dest}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-5">
          <div data-state="closed" className="overflow-hidden border border-default bg-gray-50 dark:bg-[#0B0B0C] text-sm leading-5 text-[#1f2937] dark:text-[#a1a1aa] rounded-md">
            <div className="hidden items-center sm:flex">
              <div className="flex items-center gap-1 whitespace-nowrap transition-colors ease-in-out px-1.5 py-0.5">
                <PiFeatherDuotone />

                <span>
                  {item?.clicks}
                  <span className="hidden md:inline-block">&nbsp;clicks</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              {/* Edit */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button onClick={() => setIsDialogOpen(true)} className="text-blue-500 hover:text-blue-700 dark:bg-[#0B0B0C] size-9 rounded-md border border-default flex justify-center items-center active:scale-95 transition-all duration-300" aria-label="Edit" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="size-5" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-5">Update Link</DialogTitle>
                    <DialogDescription>
                      <form action="" onSubmit={handleUpdate} className="flex flex-col gap-4">
                        <div>
                          <Label>Destination URL</Label>
                          <Input type="text" name="destination" placeholder="https://dash.example.com/" defaultValue={item?.dest} className="mt-2" />
                        </div>
                        <div>
                          <Label>Short Link</Label>
                          <Input type="text" name="shortLink" placeholder="Short link.." defaultValue={item?.slug} disabled className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end gap-4 mt-4">
                          <button type="submit" disabled={getResponse} value="submitButton" className="rounded-md bg-primary px-4 py-2 text-white font-medium flex items-center gap-2 active:scale-95 duration-300 transition-all">
                            {getResponse && <Loader2 className="size-4 animate-spin" />}
                            {getResponse ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {/* Delete */}
              <button onClick={() => handleDeleteConfirmation(item?.id)} className="text-red-500 hover:text-red-700 dark:bg-[#0B0B0C] size-9 rounded-md border border-default flex justify-center items-center active:scale-95 transition-all duration-300" aria-label="Delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="size-5" width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.088 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default LinkItem;
