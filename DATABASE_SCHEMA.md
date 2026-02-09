# Babado.ai - Master Database Schema

This document outlines the database structure for the Babado.ai platform.

## 👥 Authentication & Profiles

Powered by Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📖 Stories

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  rewritten_content TEXT,
  category TEXT, -- 'real', 'fictional'
  emotional_tone TEXT,
  viral_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_anonymous BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔗 Social Media (Phase 2)

```sql
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_user_id TEXT,
  username TEXT,
  access_token TEXT,
  is_connected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  platforms TEXT[] DEFAULT '{}',
  caption TEXT,
  video_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📊 Trends (Phase 2)

```sql
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  platform TEXT NOT NULL,
  popularity_score INTEGER,
  growth_rate INTEGER,
  sentiment TEXT,
  suggested_hooks TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## 📂 Storage Buckets

- `avatars`: User profile pictures.
- `audio`: Generated AI voice narrations (.mp3).
- `videos`: Exported content videos (.mp4).
