'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { useAuth } from '@/providers/authContext';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PiPowerDuotone, PiUserCircleDashedDuotone, PiUserCircleDuotone } from 'react-icons/pi';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';

type FormDataType = {
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export default function ProfileInfo() {
  const { logoutUser } = useAuth();
  const token = getCookie('token') as string | undefined;
  const jwtData = token ? jwtDecode(token) : null;
  const [getResponse, setGetResponse] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [newPassword, confirmNewPassword]);

  useEffect(() => {
    setNewPassword('');
    setConfirmNewPassword('');
    setShowConfirmNewPass(false);
    setShowCurrentPass(false);
    setShowNewPass(false);
  }, [isDialogOpen]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as FormDataType;
    const { currentPassword, confirmNewPassword } = data;

    const dataJSON = { oldPassword: currentPassword, confirmNewPassword };
    try {
      const res = await api.patch(`${getAPIUrl()}/api/admin/change-password`, dataJSON);
      if (res.status === 200) {
        toast.success('Password changed successfully!');
        setGetResponse(true);
        setIsDialogOpen(false);
      } else {
        toast.error('Something went wrong!');
        setGetResponse(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (axios.isAxiosError(error) && error?.response?.status === 401) {
        toast.error('Current password is incorrect.');
      } else toast.error('An error occurred while changing password. Please try again later.');
    }
    setGetResponse(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center justify-center  md:size-9 size-8 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] hover:text-primary text-accent-500 dark:text-accent-800 rounded-full">
          <PiUserCircleDuotone className="md:!size-6 !size-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          <div>
            <div className="text-sm font-medium text-accent-800">{jwtData?.sub}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 text-sm font-medium text-accent-600 capitalize  py-1.5 px-3 rounded-md hover:!bg-[#F4F4F5] dark:hover:!bg-[#19191C] hover:text-accent-800 cursor-pointer w-full">
                <PiUserCircleDashedDuotone />
                Change Password
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-5">Change Password</DialogTitle>
                <DialogDescription>
                  <form action="" onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <div className="text-start">
                      <Label>Current Password</Label>
                      <div className="flex items-center mt-2 border border-default rounded-lg">
                        <Input type={showCurrentPass ? 'text' : 'password'} name="currentPassword" placeholder="Write here.." className="border-none" required autoComplete="off" />
                        <button type="button" className="h-10 px-3" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                          {showCurrentPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-start">
                      <Label>New Password</Label>
                      <div className="flex items-center mt-2 border border-default rounded-lg">
                        <Input type={showNewPass ? 'text' : 'password'} name="newPassword" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Write here.." className="border-none" autoComplete="off" />
                        <button type="button" className="h-10 px-3" onClick={() => setShowNewPass(!showNewPass)}>
                          {showNewPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-start">
                      <Label>Confirm New Password</Label>
                      <div className="flex items-center mt-2 border border-default rounded-lg">
                        <Input type={showConfirmNewPass ? 'text' : 'password'} name="confirmNewPassword" onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} placeholder="Write here.." className="border-none" autoComplete="off" />
                        <button type="button" className="h-10 px-3" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>
                          {showConfirmNewPass ? <Eye className="size-4 text-accent-850" /> : <EyeOff className="size-4 text-accent-850" />}
                        </button>
                      </div>
                      {newPassword && confirmNewPassword ? (
                        <>
                          {passwordError && (
                            <span className="text-red-500 text-sm flex items-center gap-2">
                              <X className="size-5" />
                              Confirm password does not match new password.
                            </span>
                          )}
                        </>
                      ) : (
                        ''
                      )}
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mb-0 dark:bg-[#ffffff26]" />
        <DropdownMenuItem onClick={logoutUser} className="flex items-center gap-2 text-sm font-medium text-accent-600 capitalize my-1 px-3 hover:!bg-[#F4F4F5] dark:hover:!bg-[#19191C] cursor-pointer">
          <PiPowerDuotone />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
