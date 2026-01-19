import { JournalEntry } from '../types';
import { supabase } from './supabase';

const FALLBACK_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        dateDay: '18',
        dateMonth: 'JAN',
        title: 'A Paz que Excede',
        preview: 'Em tempos de ansiedade, a paz de Deus guarda nossos corações e mentes em Cristo Jesus.',
        imageUrl: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=2690&auto=format&fit=crop'
    },
    {
        id: '2',
        dateDay: '17',
        dateMonth: 'JAN',
        title: 'Força na Fraqueza',
        preview: 'Quando nos sentimos fracos, é então que somos fortes, pois o poder de Deus se aperfeiçoa na fraqueza.',
        imageUrl: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2564&auto=format&fit=crop'
    }
];

export const getWeeklyEntries = async (): Promise<JournalEntry[]> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        // Fetch published devotionals
        const { data, error } = await supabase
            .from('devotionals')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(7);

        if (error) {
            console.error("Error fetching devotionals:", error);
            return FALLBACK_ENTRIES;
        }

        if (!data || data.length === 0) {
            return FALLBACK_ENTRIES;
        }

        // Map Supabase data to App Type
        return data.map(d => ({
            id: d.id.toString(),
            dateDay: d.date_day,
            dateMonth: d.date_month,
            title: d.title,
            preview: d.preview,
            imageUrl: d.image_url
        }));

    } catch (err) {
        console.error("Failed to load devotionals service", err);
        return FALLBACK_ENTRIES;
    }
};
