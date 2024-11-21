'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
// import { Input } from "@/components/ui/input"
import { BarChart, Cloud, Code, ExternalLink, Github, Lock, Menu, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SiteLogo from '../SiteLogo';
import ThemeButton from '../theme-button';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-svh bg-background">
      {/* Navigation */}
      <nav className="mx-4 sticky top-5">
        <div className="shadow-md bg-background/95 mx-auto dark:bg-[#141414] backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40  max-w-7xl rounded-xl">
          <div className="px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary">
                  <SiteLogo />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link href="#features" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium">
                    Features
                  </Link>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium">
                    How It Works
                  </Link>
                  <Link href="#deployment" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium">
                    Deployment
                  </Link>
                  <Link href="https://github.com/ajshovon/dash" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium">
                    GitHub
                  </Link>
                  <ThemeButton />
                </div>
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu className="h-6 w-6" />
                </Button>
                <ThemeButton />
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="#features" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-lg text-base font-medium">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-lg text-base font-medium">
                  How It Works
                </Link>
                <Link href="#deployment" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-lg text-base font-medium">
                  Deployment
                </Link>
                <Link href="https://github.com/ajshovon/dash" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-lg text-base font-medium">
                  GitHub
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto">
        <div className="py-20 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
              <span className="text-primary">DASH</span>
            </h1>
            <h2 className="text-xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-6">Distributed Address Shortening Hub</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Deploy your own lightning-fast link shortener on Cloudflare Workers. Built with Next.js and Hono.js for ultimate performance and control.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" asChild>
                <Link href="#deployment">
                  <Cloud className="mr-2 h-5 w-5" />
                  Deploy on Cloudflare
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/ajshovon/dash">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center">
            <Image src="/preview.png" alt="DASH Dashboard" width={1000} height={400} className="rounded-lg shadow-2xl" />
          </div>
        </div>
        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/30  max-w-5xl mx-auto">
          <div className=" px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="w-12 h-12 text-primary" />, title: 'Lightning Fast', description: 'Powered by Cloudflare Workers for minimal latency worldwide' },
                { icon: <Lock className="w-12 h-12 text-primary" />, title: 'Secure & Private', description: 'Your data stays on your Cloudflare account, ensuring privacy and security' },
                { icon: <Code className="w-12 h-12 text-primary" />, title: 'Fully Customizable', description: 'Open-source codebase allows for complete customization to fit your needs' },
                { icon: <Cloud className="w-12 h-12 text-primary" />, title: 'Easy Deployment', description: 'Simple deployment process to get your link shortener up and running quickly' },
                { icon: <BarChart className="w-12 h-12 text-primary" />, title: 'Analytics Ready', description: 'Built-in support for tracking link clicks and gathering insights' },
                { icon: <ExternalLink className="w-12 h-12 text-primary" />, title: 'Custom Domain', description: 'Use your own domain for branded short links' },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 dark:bg-[#0b0b0b] rounded-lg shadow-lg transition-transform hover:scale-105">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20  max-w-2xl mx-auto">
          <div className="sm:px-4 px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid gap-12 items-center justify-center">
              <div>
                <ol className="list-decimal list-inside space-y-4">
                  <li className="text-lg">DASH leverages Cloudflare Workers to run serverless functions at the edge, ensuring low latency and high performance.</li>
                  <li className="text-lg">The core API for creating, retrieving, and managing short links is implemented using Cloudflare Workers, providing a scalable and efficient backend.</li>
                  <li className="text-lg">The frontend of DASH is deployed on Cloudflare Pages, which serves the static assets of the web application.</li>
                  <li className="text-lg">Cloudflare KV is used to store cached short links, providing fast and globally distributed data access.</li>
                  <li className="text-lg">NeonDB serves as the primary relational database for DASH, storing user data, link information, and analytics.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        {/* Deployment Section */}
        <section id="deployment" className="py-20 bg-secondary/30">
          <div className="sm:px-4 px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Deploy Your Own DASH</h2>
            <div className="max-w-2xl mx-auto">
              Automate your deployment process using GitHub Actions, a powerful CI/CD tool integrated directly into GitHub. By setting up a GitHub Actions workflow, you can streamline the deployment of your DASH instance to Cloudflare with every push to your repository. This ensures that your
              application is always up-to-date and reduces the manual effort required for deployment.
              <div className="mt-8 text-center">
                <Button size="lg" asChild>
                  <Link href="https://github.com/ajshovon/dash#deploy" target="_blank">
                    View Full Deployment Guide
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto border-t border-zinc-400/50 border-border/40 px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">DASH</h3>
            <h3 className="text-l mb-4">Distributed Address Shortening Hub</h3>
            <p className="text-sm text-muted-foreground">Open-source, self-hosted link shortener powered by Cloudflare Workers.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#deployment" className="text-sm text-muted-foreground hover:text-primary">
                  Deployment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/ajshovon/dash" target="_blank" className="text-sm text-muted-foreground hover:text-primary">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ajshovon/dash/issues" target="_blank" className="text-sm text-muted-foreground hover:text-primary">
                  Issue Tracker
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ajshovon/dash#readme" target="_blank" className="text-sm text-muted-foreground hover:text-primary">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://re.shovon.me/github" target="_blank" className="text-sm text-muted-foreground hover:text-primary">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DASH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
