import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useDashboardData() {
    const [loading, setLoading] = useState(true);
    const [widgets, setWidgets] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // On récupère les widgets statistiques principaux
                // Endpoint identifié dans le code legacy : /api/fournisseur/widgets
                const response = await api.get('/api/fournisseur/widgets');
                setWidgets(response.data);
            } catch (err) {
                console.error("Erreur chargement dashboard", err);
                setError("Impossible de charger les données. Vérifiez votre connexion.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { loading, widgets, error };
}
