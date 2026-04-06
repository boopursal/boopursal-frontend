'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign, CreditCard, Tags, Search, MapPin } from 'lucide-react';

const AdminStatCard = ({ title, value, subtext, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100"
    >
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`rounded-lg p-2 ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: '45%' }}></div>
        </div>
    </motion.div>
);

export default function AdminDashboardPage() {

    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <div className="text-right">
                    <p className="text-sm text-slate-500">mercredi, 20:50:39</p>
                    <p className="text-3xl font-light text-slate-700">21 <span className="text-sm font-normal uppercase">janvier</span></p>
                </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    title="Chiffre d'affaires"
                    value="0,00 MAD"
                    icon={DollarSign}
                    color="bg-blue-500"
                    delay={0.1}
                />
                <AdminStatCard
                    title="CA abonnements"
                    value="0,00 MAD"
                    icon={CreditCard}
                    color="bg-purple-500"
                    delay={0.2}
                />
                <AdminStatCard
                    title="CA jetons"
                    value="0,00 MAD"
                    icon={Tags}
                    color="bg-cyan-500"
                    delay={0.3}
                />
            </div>

            {/* Charts & Lists Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px]">
                        <p className="text-slate-400 text-sm">Abonnements ventes (Graphique)</p>
                    </div>

                    {/* Clients Récents */}
                    <div className="rounded-xl bg-white p-0 shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800 text-sm">Clients récents inscrits</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { name: "DIVERS", date: "21/01/2026 11:30" },
                                { name: "Enim temportibus", date: "20/01/2026 00:57" },
                                { name: "Et voluptatum", date: "16/01/2026 00:55" },
                            ].map((client, i) => (
                                <div key={i} className="px-6 py-3 flex justify-between items-center hover:bg-slate-50">
                                    <span className="text-sm text-blue-600 font-medium">{client.name}</span>
                                    <span className="text-xs text-slate-400">{client.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Column (Large) */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 min-h-[300px]">
                        <h3 className="font-semibold text-slate-800 text-sm mb-4">Jetons vendus & utilisés</h3>
                        <div className="h-48 bg-slate-50 border border-slate-100 border-dashed rounded flex items-center justify-center">
                            <span className="text-slate-400 text-xs">Graphique ici</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 min-h-[300px]">
                        <h3 className="font-semibold text-slate-800 text-sm mb-4">Clients inscrits (2026)</h3>
                        <div className="h-48 bg-slate-50 border border-slate-100 border-dashed rounded flex items-center justify-center">
                            <span className="text-slate-400 text-xs">Graphique des inscriptions</span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Clients par ville */}
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-800 text-sm mb-4">Clients par ville</h3>
                        <div className="space-y-3">
                            {[
                                { city: 'Casablanca', count: 69 },
                                { city: 'Mohammedia', count: 4 },
                                { city: 'Rabat', count: 4 },
                                { city: 'Tanger', count: 4 },
                            ].map((city) => (
                                <div key={city.city} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 flex items-center gap-2"><MapPin size={12} /> {city.city}</span>
                                    <span className="font-bold text-slate-800">{city.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Fournisseurs */}
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-800 text-sm mb-4">Top 10 Fournisseur</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'MADTAG', views: 751 },
                                { name: '3F Industrie', views: 490 },
                                { name: 'NKS Groupe', views: 381 },
                            ].map((f) => (
                                <div key={f.name} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{f.name}</span>
                                    <span className="font-bold text-slate-800 bg-slate-100 px-2 rounded">{f.views} vus</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Table: Commandes */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex gap-6">
                    <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">Commandes abonnements</button>
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-4 -mb-4 transition-colors">Commandes jetons</button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Société</th>
                            <th className="px-6 py-3">Pack</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Etat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { company: 'Enim temporibus', pack: 'Pack Gold', date: '16/01/2026 01:05', status: 'En attente', color: 'bg-orange-100 text-orange-600' },
                            { company: 'wolas99002', pack: 'Pack Business', date: '18/01/2026 11:19', status: 'Traitée', color: 'bg-green-100 text-green-600' },
                            { company: 'faketest', pack: 'Pack Business', date: '16/05/2024 13:41', status: 'Traitée', color: 'bg-green-100 text-green-600' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-blue-600 font-medium">{row.company}</td>
                                <td className="px-6 py-4 text-slate-600">{row.pack}</td>
                                <td className="px-6 py-4 text-slate-500">{row.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Traitée' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
