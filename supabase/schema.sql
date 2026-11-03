-- Execute no SQL Editor do projeto TeleLista, uma vez. Pode ser executado novamente.
create table if not exists public.user_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('favorite', 'consumed')),
  item_id bigint not null check (item_id > 0),
  payload jsonb not null check (
    jsonb_typeof(payload) = 'object'
    and payload ? 'id' and payload ? 'name'
    and payload ->> 'id' = item_id::text
    and jsonb_typeof(payload -> 'name') = 'string'
    and (kind <> 'consumed' or (
      payload ? 'rating'
      and jsonb_typeof(payload -> 'rating') = 'number'
      and (payload ->> 'rating')::numeric between 1 and 5
      and (payload ->> 'rating')::numeric = trunc((payload ->> 'rating')::numeric)
    ))
  ),
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);

alter table public.user_items enable row level security;
revoke all on table public.user_items from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.user_items to authenticated;

drop policy if exists "Conta acessa apenas seus itens" on public.user_items;
create policy "Conta acessa apenas seus itens"
on public.user_items for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
