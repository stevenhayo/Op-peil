-- Op Peil: database-opzet. Plak dit in Supabase → SQL Editor → Run.

-- Profielen: één rij per gebruiker. Bevat politieke opvattingen (bijzondere persoonsgegevens, art. 9 AVG),
-- daarom alleen opgeslagen met uitdrukkelijke toestemming en alleen leesbaar voor de gebruiker zelf.
create table if not exists public.profielen (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  toestemming_op timestamptz not null,
  bijgewerkt_op timestamptz not null default now()
);

alter table public.profielen enable row level security;

drop policy if exists "eigen profiel lezen" on public.profielen;
create policy "eigen profiel lezen" on public.profielen
  for select using (auth.uid() = user_id);

drop policy if exists "eigen profiel aanmaken" on public.profielen;
create policy "eigen profiel aanmaken" on public.profielen
  for insert with check (auth.uid() = user_id);

drop policy if exists "eigen profiel wijzigen" on public.profielen;
create policy "eigen profiel wijzigen" on public.profielen
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "eigen profiel verwijderen" on public.profielen;
create policy "eigen profiel verwijderen" on public.profielen
  for delete using (auth.uid() = user_id);
