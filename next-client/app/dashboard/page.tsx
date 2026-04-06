'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Eye, FileText } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`rounded-xl p-3 ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center gap-1">
                <TrendingUp size={14} />
                {subtext}
            </span>
            <span className="ml-2 text-slate-400">depuis le mois dernier</span>
        </div>
    </motion.div>
);

export default function DashboardPage() {
    const { loading, widgets, error } = useDashboardData();

    // Données de secours (Mock) pour la démonstration visuelle
    const displayData = widgets || {
        widget1: { title: "Chiffre d'affaires", value: "142,300 MAD" },
        widget2: { title: "Commandes gagnées", value: "24" },
        widget3: { title: "Taux de conversion", value: "18%" },
        widget4: { title: "Visites profil", value: "1,204" }
    };

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold">Bonjour, Ravie de vous revoir ! 👋</h1>
                    <p className="mt-2 text-blue-100 max-w-2xl">
                        Voici ce qui se passe sur votre espace aujourd'hui. Vos statistiques montrent une progression de 12% par rapport à la semaine dernière.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 blur-3xl transform skew-x-12" />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Chiffre d'Affaires"
                    value={displayData.widget1?.value || "0 MAD"}
                    subtext="+12%"
                    icon={DollarSign}
                    color="bg-green-500"
                    delay={0.1}
                />
                <StatCard
                    title="Commandes/Devis"
                    value={displayData.widget2?.value || "0"}
                    subtext="+5"
                    icon={ShoppingCart}
                    color="bg-blue-500"
                    delay={0.2}
                />
                <StatCard
                    title="Taux de réponse"
                    value={displayData.widget3?.value || "0%"}
                    subtext="+2.4%"
                    icon={Activity}
                    color="bg-purple-500"
                    delay={0.3}
                />
                <StatCard
                    title="Vues Profil"
                    value={displayData.widget4?.value || "0"}
                    subtext="+140"
                    icon={Eye}
                    color="bg-orange-500"
                    delay={0.4}
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Graphique (Placeholder) */}
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Performance Commerciale</h3>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none">
                            <option>Cette année</option>
                            <option>Cette semaine</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                        Graphique des ventes (Chart.js ou Recharts) à intégrer ici
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Dernières Activités</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Nouvelle demande de devis</p>
                                    <p className="text-xs text-slate-500">Il y a 2 heures par Société XYZ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        Voir toute l'activité
                    </button>
                </div>

            </div>
        </div>
    );
}
