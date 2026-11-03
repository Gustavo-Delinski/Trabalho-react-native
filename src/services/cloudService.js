import { requireSupabase } from './supabase';

export async function readCollection(userId, kind) {
  const { data, error } = await requireSupabase().from('user_items')
    .select('item_id, payload').eq('user_id', userId).eq('kind', kind)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => ({ ...row.payload, id: row.item_id }));
}

export async function writeItem(userId, kind, id, item) {
  const client = requireSupabase();
  const request = item === null
    ? client.from('user_items').delete().eq('user_id', userId).eq('kind', kind).eq('item_id', id)
    : client.from('user_items').upsert({
      user_id: userId, kind, item_id: Number(id), payload: item,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,kind,item_id' });
  const { error } = await request;
  if (error) throw error;
}
