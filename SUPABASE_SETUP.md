## 2) Create required tables and policies

Open `SQL Editor` and run the complete script in [supabase/schema.sql](supabase/schema.sql). It creates the tables, enables RLS, creates the public `couple-media` bucket with a 25 MB limit, and adds policies that restrict uploads and deletes to the signed-in user's couple folder.
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

````

## 3) Enable Realtime on tables

In `Database > Replication`, enable Realtime for:
- `public.couple_nodes`
- `public.presence_status`

## 4) Verify storage

The schema script creates `couple-media` as a **Public** bucket because this frontend stores public image URLs. If the bucket already exists, the script updates its 25 MB size limit and allowed MIME types. Do not add a broad delete policy manually; the checked-in policy scopes deletes to the signed-in user's couple folder.

## 5) Configure Auth providers

### Email/password
Enable in `Authentication > Providers > Email`.

## 6) Vercel environment variables

Set these in Vercel project settings:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_COUPLE_ID=couple-farjana-nasif
VITE_SUPABASE_BUCKET=couple-media
````

Then trigger a new deployment.

## 7) Domain settings for email links

In Supabase:

- `Authentication > URL Configuration`
  - `Site URL`: your production URL (for example `https://your-app.vercel.app`)
  - `Redirect URLs`: add
    - `https://your-app.vercel.app`
    - `http://localhost:5173`

## 8) Verify

1. Sign up/sign in.
2. Upload an image memory.
3. Confirm:
   - `public.couple_nodes` has `node_path = 'memories'`
   - `Storage > couple-media > couples/...` contains uploaded file
