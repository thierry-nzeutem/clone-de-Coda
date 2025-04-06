-- Add new columns to establishments table
ALTER TABLE establishments
ADD COLUMN email text,
ADD COLUMN phone text,
ADD COLUMN postal_code text,
ADD COLUMN city text,
ADD COLUMN ge5_displayed boolean,
ADD COLUMN sogs_transmitted boolean;

-- Update existing records to split address into components
UPDATE establishments
SET 
  postal_code = SUBSTRING(address FROM '\d{5}'),
  city = SUBSTRING(address FROM '\d{5}\s+(.*)$'),
  address = REGEXP_REPLACE(address, ',?\s*\d{5}\s+.*$', '');