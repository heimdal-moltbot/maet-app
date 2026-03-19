-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Brugerprofiler / familier
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  family_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Familiemedlemmer
create table if not exists family_members (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  age int,
  created_at timestamptz default now()
);

-- Præferencer og allergier pr. familiemedlem
create table if not exists dietary_preferences (
  id uuid primary key default uuid_generate_v4(),
  family_member_id uuid not null references family_members(id) on delete cascade,
  preference_type text not null, -- "allergy", "preference", "dislike"
  value text not null,
  created_at timestamptz default now()
);

-- Opskrifter
create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  prep_time_minutes int,
  cook_time_minutes int,
  servings int not null default 4,
  difficulty text default 'medium', -- easy, medium, hard
  is_public boolean default false,
  diet_tags text[] default '{}', -- vegetarian, vegan, gluten-free, dairy-free, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ingredienser til opskrifter
create table if not exists recipe_ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null,
  amount decimal,
  unit text,
  sort_order int default 0
);

-- Trin i opskrifter
create table if not exists recipe_steps (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  step_number int not null,
  instruction text not null
);

-- Ugeplaner
create table if not exists meal_plans (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  week_start date not null, -- Monday of the week
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id, week_start)
);

-- Planlagte måltider i ugeplanen
create table if not exists planned_meals (
  id uuid primary key default uuid_generate_v4(),
  meal_plan_id uuid not null references meal_plans(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  day_of_week int not null, -- 0=Monday, 6=Sunday
  meal_type text not null default 'dinner', -- breakfast, lunch, dinner
  servings_override int, -- override recipe default servings
  created_at timestamptz default now()
);

-- Indkøbslister
create table if not exists shopping_lists (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  meal_plan_id uuid references meal_plans(id) on delete set null,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indkøbslisteemner
create table if not exists shopping_items (
  id uuid primary key default uuid_generate_v4(),
  shopping_list_id uuid not null references shopping_lists(id) on delete cascade,
  name text not null,
  amount decimal,
  unit text,
  is_checked boolean default false,
  category text, -- produce, dairy, meat, etc.
  recipe_ingredient_id uuid references recipe_ingredients(id) on delete set null,
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table family_members enable row level security;
alter table dietary_preferences enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table meal_plans enable row level security;
alter table planned_meals enable row level security;
alter table shopping_lists enable row level security;
alter table shopping_items enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Family members: only profile owner
create policy "Users manage own family members" on family_members for all using (profile_id = auth.uid());

-- Dietary preferences: through family members
create policy "Users manage own dietary preferences" on dietary_preferences for all using (
  family_member_id in (select id from family_members where profile_id = auth.uid())
);

-- Recipes: own + public
create policy "Users can view own and public recipes" on recipes for select using (profile_id = auth.uid() or is_public = true);
create policy "Users can manage own recipes" on recipes for insert with check (profile_id = auth.uid());
create policy "Users can update own recipes" on recipes for update using (profile_id = auth.uid());
create policy "Users can delete own recipes" on recipes for delete using (profile_id = auth.uid());

-- Recipe ingredients/steps: through recipe ownership
create policy "Users manage own recipe ingredients" on recipe_ingredients for all using (
  recipe_id in (select id from recipes where profile_id = auth.uid())
);
create policy "Anyone can view public recipe ingredients" on recipe_ingredients for select using (
  recipe_id in (select id from recipes where is_public = true)
);

create policy "Users manage own recipe steps" on recipe_steps for all using (
  recipe_id in (select id from recipes where profile_id = auth.uid())
);
create policy "Anyone can view public recipe steps" on recipe_steps for select using (
  recipe_id in (select id from recipes where is_public = true)
);

-- Meal plans: only owner
create policy "Users manage own meal plans" on meal_plans for all using (profile_id = auth.uid());

-- Planned meals: through meal plan
create policy "Users manage own planned meals" on planned_meals for all using (
  meal_plan_id in (select id from meal_plans where profile_id = auth.uid())
);

-- Shopping lists: only owner
create policy "Users manage own shopping lists" on shopping_lists for all using (profile_id = auth.uid());

-- Shopping items: through shopping list
create policy "Users manage own shopping items" on shopping_items for all using (
  shopping_list_id in (select id from shopping_lists where profile_id = auth.uid())
);

-- Function: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
