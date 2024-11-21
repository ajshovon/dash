'use client';

import ThemeButton from '@/components/theme-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/authContext';
import auth3Dark from '@/public/images/auth3-dark.png';
import auth3Light from '@/public/images/auth3-light.png';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Login() {
  const { loginUser } = useAuth();
  const [getResponse, setGetResponse] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordType, setPasswordType] = useState('password');
  const togglePasswordType = () => {
    if (passwordType === 'text') {
      setPasswordType('password');
    } else if (passwordType === 'password') {
      setPasswordType('text');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }
    if (username.length < 2 || password.length < 4) {
      toast.error('Invalid Credentials');
      return;
    }
    const credentials = { username, password };
    setGetResponse(true);
    try {
      await loginUser(credentials);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials') {
          toast.error('Invalid credentials');
        } else {
          toast.error('Something went wrong');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
    setGetResponse(false);
  };
  return (
    <div className="min-h-svh flex justify-center items-center relative overflow-hidden">
      <Image src={auth3Dark} alt="background image" className="absolute top-0 left-0 w-full h-full light:hidden" />
      <Image src={auth3Light} alt="background image" className="absolute top-0 left-0 w-full h-full dark:hidden" />
      <div className="w-full bg-card py-5 max-w-xl rounded-xl relative z-10 2xl:p-16 xl:p-12 sm:p-10 p-5 m-4">
        <div className="w-full">
          <div className="flex justify-between items-center gap-5">
            <Link href="/" className="inline-block">
              <svg className="h-8 w-full" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="150" rx="20" className="fill-black dark:fill-white" />
                <path
                  d="M40.096 121V31.656H71.328C78.8373 31.656 85.408 32.8507 91.04 35.24C96.7573 37.544 101.493 40.744 105.248 44.84C109.003 48.936 111.819 53.672 113.696 59.048C115.659 64.3387 116.64 70.0133 116.64 76.072C116.64 82.216 115.659 88.0187 113.696 93.48C111.819 98.856 109.003 103.635 105.248 107.816C101.493 111.912 96.7573 115.155 91.04 117.544C85.408 119.848 78.8373 121 71.328 121H40.096ZM69.408 97.448H71.456C74.016 97.448 76.448 96.68 78.752 95.144C81.056 93.608 82.9333 91.2613 84.384 88.104C85.92 84.9467 86.688 80.936 86.688 76.072C86.688 71.208 85.92 67.24 84.384 64.168C82.9333 61.096 81.056 58.8347 78.752 57.384C76.448 55.9333 74.016 55.208 71.456 55.208H69.408V97.448Z"
                  className="dark:fill-black fill-white"
                />
                <rect x="55" y="42" width="40" height="10" className="dark:fill-black fill-white" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M65.3096 51C64.4492 51 63.6723 51.5146 63.3366 52.3068L53.6937 75.064L53.6847 75.0857C53.4179 75.735 53.3147 76.4398 53.3842 77.1383C53.4536 77.8368 53.6936 78.5076 54.083 79.0916C54.4723 79.6756 54.9992 80.1551 55.6172 80.4879C56.2353 80.8206 56.9256 80.9965 57.6275 81L57.6382 81H66.7545L58.9635 108.268C58.6982 109.197 59.0868 110.188 59.9125 110.689C60.7382 111.19 61.7969 111.077 62.4979 110.412L99.3123 75.5268L99.3251 75.5145C99.9367 74.9252 100.359 74.1674 100.54 73.3374C100.72 72.5073 100.649 71.6425 100.337 70.8527C100.025 70.0629 99.4846 69.3836 98.7856 68.9011C98.0866 68.4187 97.2599 68.1549 96.4109 68.1431L96.3813 68.1429H83.7769L90.7979 54.1012C91.13 53.4369 91.0944 52.648 90.704 52.0163C90.3136 51.3845 89.6237 51 88.8811 51H65.3096Z"
                  className="fill-black dark:fill-white"
                />
              </svg>
            </Link>
            <ThemeButton />
          </div>

          <div className="mt-5 2xl:text-3xl text-2xl font-bold text-accent-900">Hey, Hello 👋</div>
          <div className="2xl:text-lg text-base text-accent-600 mt-2 leading-6">Enter your DASH credentials here...</div>
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="2xl:my-7 my-8 space-y-4">
              <div>
                <Label>Username</Label>
                <Input type="text" name="username" placeholder="Write here.." required autoFocus ref={usernameRef} className="mt-2" />
              </div>
              <div>
                <Label>Password</Label>
                <div className="flex items-center mt-2 border border-default rounded-lg">
                  <Input type={passwordType === 'password' ? 'password' : 'text'} name="password" placeholder="Write here.." required ref={passwordRef} className="border-none" />
                  <button type="button" className="h-10 px-3" onClick={togglePasswordType}>
                    {passwordType === 'password' ? <EyeOff className="size-4 text-accent-850" /> : <Eye className="size-4 text-accent-850" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button type="submit" disabled={getResponse} className="w-full rounded-md bg-primary px-4 py-2 text-white font-medium active:scale-95 duration-300 transition-all flex items-center justify-center gap-2">
                {getResponse && <Loader2 className="size-4 animate-spin" />}
                {getResponse ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
