ALTER TABLE public.contests
ADD COLUMN IF NOT EXISTS pricing_type text;

UPDATE public.contests
SET pricing_type = 'free'
WHERE pricing_type IS NULL;

ALTER TABLE public.contests
ALTER COLUMN pricing_type SET DEFAULT 'free',
ALTER COLUMN pricing_type SET NOT NULL;

ALTER TABLE public.contests
DROP CONSTRAINT IF EXISTS contests_pricing_type_check;

ALTER TABLE public.contests
ADD CONSTRAINT contests_pricing_type_check
CHECK (pricing_type IN ('free', 'paid'));
