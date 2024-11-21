'use client';

import Alert from '@/components/Alert';
import LinkItem from '@/components/LinkItem';
import Loading from '@/components/loading';
import Pagination from '@/components/Pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { Loader2, Plus, Search } from 'lucide-react';
import { customAlphabet } from 'nanoid';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

type RowData = {
  id: number;
  slug: string;
  dest: string;
  clicks: number;
  createdAt: string;
};

type FormDataType = {
  destinationUrl: string;
  shortLink?: string;
};

const LinksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [getResponse, setGetResponse] = useState(false);
  const fetcher = (url: string) => api.get(url).then((r) => r.data);
  const { data, error, isLoading, mutate } = useSWR(`${getAPIUrl()}/api/admin/links`, fetcher);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as FormDataType;
    setGetResponse(true);

    const res = await api.post(`/api/admin/new`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 201 || res.status === 200) {
      toast.success('Created successfully!');
      mutate();
      setIsCreateDialogOpen(false);
      (event.target as HTMLFormElement).reset();
    } else {
      toast.error('Something went wrong!', { style: { color: 'orange' } });
    }
    setGetResponse(false);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    const res = await api.delete(`${getAPIUrl()}/api/admin/link/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 200) {
      toast.success('Deleted successfully!');
      mutate();
      setShowAlert(false);
    } else {
      toast.error('Something went wrong!', { style: { color: 'orange' } });
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setShowAlert(true);
    setDeleteId(id);
  };
  const confirmDelete = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(data?.data?.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data?.data?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const filteredData = currentItems?.filter((item: RowData) => item.slug.toLowerCase().includes(searchTerm.toLowerCase()) || item.dest.toLowerCase().includes(searchTerm.toLowerCase()) || item.clicks.toString().includes(searchTerm.toLowerCase()));

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const nanoid = customAlphabet(alphabet, 5);
  return (
    <div className="bg-card rounded-lg border border-default">
      {/* Toolbar */}
      <div className="sm:p-6 p-4 flex items-center justify-end flex-wrap gap-3">
        {/* <Select defaultValue="date_descending">
          <SelectTrigger className="sm:w-[248px] w-full border border-default">
            <SelectValue placeholder="Select a Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-default">
            <SelectGroup>
              <SelectItem value="date_ascending">Date (Ascending)</SelectItem>
              <SelectItem value="date_descending">Date (Descending)</SelectItem>
              <SelectItem value="clicks_ascending">Clicks (Ascending)</SelectItem>
              <SelectItem value="clicks_descending">Clicks (Descending)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <div className="flex items-center gap-3 flex-wrap sm:w-auto w-full">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0B0B0C] border border-default rounded-lg px-3 sm:w-[248px] w-full">
            <label htmlFor="Search">
              <Search className="size-4 text-accent-500" />
            </label>
            <input type="text" id="Search" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none outline-none py-2 text-sm text-accent-500" />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-1 rounded-lg bg-primary text-white py-2 text-sm px-4 active:scale-95 transition-all duration-300">
                <Plus className="size-5" />
                Create
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-5">New link</DialogTitle>
                <DialogDescription>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <Label>Destination URL</Label>
                      <Input type="text" name="destination" placeholder="https://google.com/" className="mt-2" required />
                    </div>
                    <div>
                      <Label>Short Link</Label>
                      <Input type="text" name="shortLink" placeholder="Short link.." className="mt-2" defaultValue={nanoid()} />
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-4">
                      <button type="submit" disabled={getResponse} className="rounded-md bg-primary px-4 py-2 text-white font-medium flex items-center gap-2 active:scale-95 duration-300 transition-all">
                        {getResponse && <Loader2 className="size-4 animate-spin" />}
                        {getResponse ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Table */}
      <div className="sm:p-6 p-4">
        <div className="mx-auto w-full grid gap-y-2">
          {filteredData && filteredData.length > 0 ? (
            <ul className="w-full flex flex-col transition-[gap,opacity] min-w-0 gap-4">
              {filteredData.map((singleItem: RowData) => (
                <div key={singleItem.id}>
                  <LinkItem item={singleItem} handleDeleteConfirmation={handleDeleteConfirmation} mutate={mutate} />
                </div>
              ))}
            </ul>
          ) : (
            <div className="text-lg text-center text-accent-850">No data found.</div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      {showAlert && <Alert onConfirm={confirmDelete} showAlert={showAlert} setShowAlert={setShowAlert} />}
    </div>
  );
};

export default LinksPage;
