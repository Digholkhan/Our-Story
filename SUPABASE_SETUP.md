# Supabase setup guide

This project is now wired to Supabase for auth, database sync, realtime, and media uploads.

## 1) Create Supabase project

1. Create a new project at https://supabase.com.
2. In `Settings > API`, copy:
   - `Project URL`
   - `anon public key`

## 2) Create required tables and policies

Open `SQL Editor` and run this script:

```sql
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

-- app_users: each user can read/write own profile
create policy if not exists app_users_select_own
on public.app_users for select
to authenticated
using (auth.uid() = id);

create policy if not exists app_users_upsert_own
on public.app_users for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- couple_nodes: only members of the same couple can read/write
create policy if not exists couple_nodes_read_member
on public.couple_nodes for select
to authenticated
using (
  exists (
    select 1 from public.app_users u
    where u.id = auth.uid() and u.couple_id = couple_nodes.couple_id
  )
);

create policy if not exists couple_nodes_write_member
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

-- presence_status: user updates own row, same-couple users can read
create policy if not exists presence_select_member
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

create policy if not exists presence_upsert_self
on public.presence_status for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3) Enable Realtime on tables

In `Database > Replication`, enable Realtime for:
- `public.couple_nodes`
- `public.presence_status`

## 4) Create storage bucket

1. Open `Storage` and create bucket `couple-media`.
2. Set bucket to **Public** (needed for public image URLs in this frontend).
3. Add storage policy for authenticated uploads:

```sql
create policy if not exists storage_read_public
on storage.objects for select
to public
using (bucket_id = 'couple-media');

create policy if not exists storage_upload_auth
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'couple-media'
  and (storage.foldername(name))[1] = 'couples'
);

create policy if not exists storage_delete_own_couple
on storage.objects for delete
to authenticated
using (bucket_id = 'couple-media');
```

## 5) Configure Auth providers

### Email/password
Enable in `Authentication > Providers > Email`.

### Google login
Enable in `Authentication > Providers > Google` and set OAuth credentials.

## 6) Vercel environment variables

Set these in Vercel project settings:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_COUPLE_ID=couple-farjana-nasif
VITE_SUPABASE_BUCKET=couple-media
```

Then trigger a new deployment.

## 7) Domain settings for OAuth and email links

In Supabase:
- `Authentication > URL Configuration`
  - `Site URL`: your production URL (for example `https://your-app.vercel.app`)
  - `Redirect URLs`: add
    - `https://your-app.vercel.app`
    - `http://localhost:5173`

In Google Cloud OAuth client, add authorized redirect URI from Supabase provider page.

## 8) Verify

1. Sign up/sign in.
2. Upload an image memory.
3. Confirm:
   - `public.couple_nodes` has `node_path = 'memories'`
   - `Storage > couple-media > couples/...` contains uploaded file
