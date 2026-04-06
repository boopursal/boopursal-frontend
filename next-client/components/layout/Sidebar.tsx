'use client';

import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Package,
    FileText,
    CreditCard,
    MessageSquare,
    Building2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminSidebarItems } from '@/config/adminSidebar';

// Items par défaut (Fournisseur)
const defaultSidebarItems = [
    {
        group: "Principal",
        items: [
            { name: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
            { name: 'Mes Consultations', icon: MessageSquare, href: '/dashboard/consultations' },
        ]
    },
    {
        group: "Commerce",
        items: [
            { name: 'Mes Produits', icon: Package, href: '/dashboard/produits' },
            { name: 'Demandes de Devis', icon: FileText, href: '/dashboard/devis' },
            { name: 'Appels d\'offres', icon: ShoppingBag, href: '/dashboard/appels-offres' },
        ]
    },
    {
        group: "Gestion",
        items: [
            { name: 'Mon Abonnement', icon: CreditCard, href: '/dashboard/abonnement' },
            { name: 'Mon Équipe', icon: Users, href: '/dashboard/equipe' },
            { name: 'Profil', icon: Building2, href: '/dashboard/profil' },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // TODO: Remplacer par la vraie détection de rôle depuis le Token JWT
    // Pour la démo, on regarde si l'URL commence par /admin
    const isAdmin = pathname.startsWith('/admin');
    const sidebarItems = isAdmin ? adminSidebarItems : defaultSidebarItems;

    return (
        <aside
            className={`
        fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r border-slate-200 bg-white
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
        >
            <div className={`flex h-16 items-center justify-center border-b border-slate-100 ${isAdmin ? 'bg-slate-900 border-slate-800' : ''}`}>
                {!isCollapsed ? (
                    <span className={`text-xl font-bold ${isAdmin ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                        BOOPURSAL <span className="text-xs font-normal text-slate-400 block -mt-1 text-center font-mono">{isAdmin ? 'ADMIN' : ''}</span>
                    </span>
                ) : (
                    <span className="text-xl font-bold text-blue-500">B</span>
                )}
            </div>

            <div className="h-[calc(100vh-64px)] overflow-y-auto py-6 px-3 custom-scrollbar">
                {sidebarItems.map((group, index) => (
                    <div key={index} className="mb-6">
                        {!isCollapsed && (
                            <h3 className="mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {group.group}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item: any) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative group
                        ${isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                                        >
                                            <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'} />

                                            {!isCollapsed && (
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span>{item.name}</span>
                                                    {item.badge && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.alert ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {isActive && !isCollapsed && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600"
                                                />
                                            )}

                                            {/* Tooltip for collapsed mode */}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                    {item.name}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}

                {/* Switch Démo (Temporaire) */}
                {!isCollapsed && (
                    <div className="mt-8 px-4 py-4 border-t border-slate-100">
                        <Link href={isAdmin ? "/dashboard" : "/admin/dashboard"} className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-2">
                            <Settings size={12} />
                            <span>Basculer vue {isAdmin ? 'Fournisseur' : 'Admin'}</span>
                        </Link>
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1.5 text-slate-500 hover:text-slate-900 shadow-sm"
            >
                <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
        </aside>
    );
}
