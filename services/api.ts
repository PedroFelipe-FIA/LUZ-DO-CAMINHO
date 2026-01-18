import { supabase } from './supabase';



export const toggleFavorite = async (verseRef: string, text: string): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        console.warn("User not logged in, cannot toggle favorite");
        return false;
    }

    // Check if exists
    const { data: existing, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('verse_ref', verseRef)
        .maybeSingle();

    if (error) {
        console.error("Error checking favorite:", error);
        throw error;
    }

    if (existing) {
        // Remove
        const { error: deleteError } = await supabase
            .from('favorites')
            .delete()
            .eq('id', existing.id);

        if (deleteError) throw deleteError;
        return false;
    } else {
        // Add
        const { error: insertError } = await supabase
            .from('favorites')
            .insert({
                user_id: session.user.id,
                verse_ref: verseRef,
                text: text
            });

        if (insertError) throw insertError;
        return true;
    }
};

export const checkFavorite = async (verseRef: string): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('verse_ref', verseRef)
        .maybeSingle();

    return !!data;
};
