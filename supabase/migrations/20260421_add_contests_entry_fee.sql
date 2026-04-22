ALTER TABLE public.contests
ADD COLUMN IF NOT EXISTS entry_fee integer;

UPDATE public.contests
SET entry_fee = CASE
  WHEN pricing_type = 'paid' THEN 1000
  ELSE 0
END
WHERE entry_fee IS NULL;

ALTER TABLE public.contests
ALTER COLUMN entry_fee SET DEFAULT 0,
ALTER COLUMN entry_fee SET NOT NULL;

ALTER TABLE public.contests
DROP CONSTRAINT IF EXISTS contests_entry_fee_check;

ALTER TABLE public.contests
ADD CONSTRAINT contests_entry_fee_check CHECK (
  (pricing_type = 'free' AND entry_fee = 0)
  OR (pricing_type = 'paid' AND entry_fee > 0)
);
