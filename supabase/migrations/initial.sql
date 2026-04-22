CREATE TABLE profiles (id uuid PRIMARY KEY, role text);

CREATE TABLE contests (
  id uuid PRIMARY KEY,
  title text,
  status text,
  pricing_type text NOT NULL DEFAULT 'free',
  CONSTRAINT contests_pricing_type_check CHECK (pricing_type IN ('free', 'paid'))
);

CREATE TABLE news (id uuid PRIMARY KEY, title text);
