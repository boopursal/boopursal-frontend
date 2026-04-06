'use client';

import {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    Users,
    UserCheck,
    Settings,
    CreditCard,
    MessageSquare,
    Globe,
    Database,
    BarChart3,
    List,
    Tags,
    MapPin,
    HelpCircle,
    Briefcase
} from 'lucide-react';

export const adminSidebarItems = [
    {
        group: "Principal",
        items: [
            { name: 'Tableau de bord', icon: LayoutDashboard, href: '/admin/dashboard' },
            { name: 'Gestion des RFQs', icon: FileText, href: '/admin/rfqs', badge: '4' },
            { name: 'Demandes de devis', icon: ShoppingCart, href: '/admin/devis' },
        ]
    },
    {
        group: "Utilisateurs",
        items: [
            { name: 'Acheteurs', icon: Users, href: '/admin/acheteurs' },
            { name: 'Fournisseurs', icon: Briefcase, href: '/admin/fournisseurs', badge: '2', alert: true },
            { name: 'Fournisseurs provisoire', icon: UserCheck, href: '/admin/fournisseurs-provisoire', badge: '1', alert: true },
            { name: 'Gestion des utilisateurs', icon: Settings, href: '/admin/utilisateurs' },
        ]
    },
    {
        group: "Abonnements & Revenus",
        items: [
            { name: 'Commandes abonn.', icon: CreditCard, href: '/admin/commandes-abonnement', badge: '1', alert: true },
            { name: 'Abonnements', icon: Database, href: '/admin/abonnements' },
            { name: 'Commandes jetons', icon: Tags, href: '/admin/commandes-jetons', badge: '5', alert: true },
        ]
    },
    {
        group: "Configurer & Contenu",
        items: [
            { name: 'Actualités', icon: Globe, href: '/admin/news' },
            { name: 'Focus produits', icon: List, href: '/admin/focus-produits' },
            { name: 'Paramètres', icon: Settings, href: '/admin/parametres' },
            { name: 'Secteurs / Pays / Villes', icon: MapPin, href: '/admin/referenciel' },
            { name: 'FAQ', icon: HelpCircle, href: '/admin/faq' },
        ]
    }
];
