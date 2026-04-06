'use client';

import Sidebar from '@/components/layout/Sidebar';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // TODO: Remplacer par le hook useUser() plus tard
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="pl-64 transition-all duration-300">

                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm">

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="h-10 w-64 md:w-80 rounded-full bg-slate-100 pl-10 pr-4 text-sm text-slate-800 outline-none ring-2 ring-transparent focus:bg-white focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <User size={16} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Mon Entreprise</span>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 border-b border-slate-50">
                                        <p className="text-sm font-medium text-slate-900">John Doe</p>
                                        <p className="text-xs text-slate-500 truncate">john@entreprise.com</p>
                                    </div>
                                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Mon Profil</Link>
                                    <Link href="/dashboard/abonnement" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Abonnement</Link>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                        <LogOut size={14} /> Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
