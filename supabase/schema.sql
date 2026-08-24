create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  photo_url text,
  provider text,
  email_verified boolean default false,
  role text check (role in ('partner1', 'partner2')),
  couple_id text not null,
  updated_at timestamptz default now()
);

create table if not exists public.couple_nodes (
  couple_id text not null,
  node_path text not null,
  payload jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now(),
  primary key (couple_id, node_path)
);

create table if not exists public.presence_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  couple_id text not null,
  state text not null check (state in ('online', 'offline')),
  last_changed timestamptz default now()
);

alter table public.app_users enable row level security;
alter table public.couple_nodes enable row level security;
alter table public.presence_status enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-media',
  'couple-media',
  true,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists app_users_select_own on public.app_users;
create policy app_users_select_own
on public.app_users for select
to authenticated
using (auth.uid() = id);

drop policy if exists app_users_upsert_own on public.app_users;
create policy app_users_upsert_own
on public.app_users for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists couple_nodes_read_member on public.couple_nodes;
create policy couple_nodes_read_member
on public.couple_nodes for select
to authenticated
using (
  exists (
    select 1 from public.app_users u
    where u.id = auth.uid() and u.couple_id = couple_nodes.couple_id
  )
);

drop policy if exists couple_nodes_read_public on public.couple_nodes;
create policy couple_nodes_read_public
on public.couple_nodes for select
to public
using (
  node_path in ('profile', 'memories', 'timeline', 'guestMessages', 'interaction_counts')
);

drop policy if exists couple_nodes_write_member on public.couple_nodes;
create policy couple_nodes_write_member
on public.couple_nodes for all
to authenticated
using (
  exists (
    select 1 from public.app_users u
    where u.id = auth.uid() and u.couple_id = couple_nodes.couple_id
  )
)
with check (
  exists (
    select 1 from public.app_users u
    where u.id = auth.uid() and u.couple_id = couple_nodes.couple_id
  )
);

drop policy if exists couple_nodes_write_public on public.couple_nodes;
create policy couple_nodes_write_public
on public.couple_nodes for all
to public
using (
  node_path in ('guestMessages', 'interaction_counts')
)
with check (
  node_path in ('guestMessages', 'interaction_counts')
);

drop policy if exists presence_select_member on public.presence_status;
create policy presence_select_member
on public.presence_status for select
to authenticated
using (
  exists (
    select 1
    from public.app_users me
    join public.app_users other on other.id = presence_status.user_id
    where me.id = auth.uid() and me.couple_id = other.couple_id
  )
);

drop policy if exists presence_upsert_self on public.presence_status;
create policy presence_upsert_self
on public.presence_status for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists storage_read_public on storage.objects;
create policy storage_read_public
on storage.objects for select
to public
using (bucket_id = 'couple-media');

drop policy if exists storage_upload_auth on storage.objects;
create policy storage_upload_auth
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'couple-media'
  and (storage.foldername(name))[1] = 'couples'
  and (storage.foldername(name))[2] = (
    select couple_id from public.app_users where id = auth.uid()
  )
);

drop policy if exists storage_delete_own_couple on storage.objects;
create policy storage_delete_own_couple
on storage.objects for delete
to authenticated
using (
  bucket_id = 'couple-media'
  and (storage.foldername(name))[1] = 'couples'
  and (storage.foldername(name))[2] = (
    select couple_id from public.app_users where id = auth.uid()
  )
);
