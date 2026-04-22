CREATE TABLE profiles (id uuid PRIMARY KEY, role text);

CREATE TABLE contests (
  id uuid PRIMARY KEY,
  title text,
  status text,
  pricing_type text NOT NULL DEFAULT 'free',
  entry_fee integer NOT NULL DEFAULT 0,
  payment_qr_url text,
  CONSTRAINT contests_pricing_type_check CHECK (pricing_type IN ('free', 'paid')),
  CONSTRAINT contests_entry_fee_check CHECK (
    (pricing_type = 'free' AND entry_fee = 0)
    OR (pricing_type = 'paid' AND entry_fee > 0)
  ),
  CONSTRAINT contests_payment_qr_check CHECK (
    (pricing_type = 'free' AND payment_qr_url IS NULL)
    OR (pricing_type = 'paid' AND payment_qr_url IS NOT NULL)
  )
);

CREATE TABLE news (id uuid PRIMARY KEY, title text);
