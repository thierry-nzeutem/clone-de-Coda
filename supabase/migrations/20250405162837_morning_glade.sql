/*
  # Add urgent flag to prescriptions

  1. Changes
    - Add `is_urgent` boolean column to commission_prescriptions
    - Add `is_urgent` boolean column to accessibility_commission_prescriptions
    - Set default value to false
    - Make column nullable: false

  2. Data Migration
    - Set existing records to false
*/

-- Add is_urgent column to commission_prescriptions
ALTER TABLE commission_prescriptions 
ADD COLUMN is_urgent boolean NOT NULL DEFAULT false;

-- Add is_urgent column to accessibility_commission_prescriptions
ALTER TABLE accessibility_commission_prescriptions 
ADD COLUMN is_urgent boolean NOT NULL DEFAULT false;