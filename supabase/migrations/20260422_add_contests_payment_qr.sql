ALTER TABLE public.contests
ADD COLUMN IF NOT EXISTS payment_qr_url text;

ALTER TABLE public.contests
DROP CONSTRAINT IF EXISTS contests_payment_qr_check;

ALTER TABLE public.contests
ADD CONSTRAINT contests_payment_qr_check CHECK (
  (pricing_type = 'free' AND payment_qr_url IS NULL)
  OR (pricing_type = 'paid' AND payment_qr_url IS NOT NULL)
);
