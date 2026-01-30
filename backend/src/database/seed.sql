-- =========================================
-- Seed data for demo / development
-- =========================================

-- Ensure uuid generator exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------
-- 1. PROPERTIES
-- -----------------------------------------
WITH inserted_properties AS (
  INSERT INTO properties (
    id,
    unique_number,
    name,
    management_type,
    purpose,
    status,
    created_at,
    updated_at
  )
  VALUES
    (
      gen_random_uuid(),
      'P-001',
      'Main Street 12',
      'WEG',
      'Residential building',
      'active',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ),
    (
      gen_random_uuid(),
      'P-002',
      'Lindenhof',
      'MV',
      'Mixed use property',
      'draft',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
  RETURNING id, name
)
-- -----------------------------------------
-- 2. BUILDINGS
-- -----------------------------------------
, inserted_buildings AS (
  INSERT INTO buildings (
    id,
    property_id,
    street,
    house_number,
    postal_code,
    city,
    construction_year,
    order_index,
    created_at,
    updated_at
  )
  SELECT
    gen_random_uuid(),
    p.id,
    'Main Street',
    '12',
    '10115',
    'Berlin',
    1998,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  FROM inserted_properties p
  WHERE p.name = 'Main Street 12'
  RETURNING id, property_id
)

-- -----------------------------------------
-- 3. UNITS
-- -----------------------------------------
INSERT INTO units (
  building_id,
  number,
  type,
  floor,
  entrance,
  size_sqm,
  co_ownership_share,
  construction_year,
  rooms,
  created_at,
  updated_at
)
SELECT
  b.id,
  u.number,
  u.type::"UnitType",
  u.floor,
  u.entrance,
  u.size_sqm,
  u.co_ownership_share,
  u.construction_year,
  u.rooms,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM inserted_buildings b
CROSS JOIN (
  VALUES
    ('1A', 'APARTMENT', 1, 'A', 54.00, 0.0520, 1998, 2),
    ('1B', 'APARTMENT', 1, 'A', 62.50, 0.0610, 1998, 3),
    ('P1', 'PARKING',   NULL, NULL, NULL, 0.0100, NULL, NULL)
) AS u(
  number,
  type,
  floor,
  entrance,
  size_sqm,
  co_ownership_share,
  construction_year,
  rooms
);
