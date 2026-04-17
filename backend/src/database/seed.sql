-- =========================================
-- Seed data for demo / development
-- =========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Очистка
TRUNCATE TABLE unit_owners RESTART IDENTITY CASCADE;
TRUNCATE TABLE units       RESTART IDENTITY CASCADE;
TRUNCATE TABLE buildings   RESTART IDENTITY CASCADE;
TRUNCATE TABLE owners      RESTART IDENTITY CASCADE;
TRUNCATE TABLE properties  RESTART IDENTITY CASCADE;
TRUNCATE TABLE users       RESTART IDENTITY CASCADE;

-- -----------------------------------------
-- 1. USERS
-- -----------------------------------------
INSERT INTO users (id, email, password_hash, role, first_name, last_name, created_at, updated_at)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'manager1@buena.de',   '$2b$10$placeholder_hash_1', 'MANAGER',    'Hans',  'Mueller', NOW(), NOW()),
  ('11111111-0000-0000-0000-000000000002', 'manager2@buena.de',   '$2b$10$placeholder_hash_2', 'MANAGER',    'Anna',  'Schmidt', NOW(), NOW()),
  ('11111111-0000-0000-0000-000000000003', 'accountant@buena.de', '$2b$10$placeholder_hash_3', 'ACCOUNTANT', 'Klaus', 'Weber',   NOW(), NOW()),
  ('11111111-0000-0000-0000-000000000004', 'admin@buena.de',      '$2b$10$placeholder_hash_4', 'ADMIN',      'Peter', 'Admin',   NOW(), NOW());

-- -----------------------------------------
-- 2. PROPERTIES + BUILDINGS + UNITS (CTE)
-- -----------------------------------------
WITH inserted_properties AS (
  INSERT INTO properties (
    id, unique_number, name, management_type, purpose,
    manager_id, accountant_id, created_at, updated_at
  )
  VALUES
    (
      '22222222-0000-0000-0000-000000000001',
      'P-001', 'Main Street 12', 'WEG', 'Residential building',
      '11111111-0000-0000-0000-000000000001',
      '11111111-0000-0000-0000-000000000003',
      NOW(), NOW()
    ),
    (
      '22222222-0000-0000-0000-000000000002',
      'P-002', 'Lindenhof', 'MV', 'Mixed use property',
      '11111111-0000-0000-0000-000000000002',
      NULL,
      NOW(), NOW()
    ),
    (
      '22222222-0000-0000-0000-000000000003',
      'P-003', 'Berliner Allee Komplex', 'WEG', 'Residential',
      '11111111-0000-0000-0000-000000000002',
      '11111111-0000-0000-0000-000000000003',
      NOW(), NOW()
    )
  RETURNING id, name
),



inserted_buildings AS (
  INSERT INTO buildings (
    id, property_id, street, house_number,
    postal_code, city, construction_year, order_index,
    created_at, updated_at
  )
  SELECT
    gen_random_uuid(),
    p.id,
    v.street,
    v.house_number,
    v.postal_code,
    v.city,
    v.construction_year,
    v.order_index,
    NOW(), NOW()
  FROM inserted_properties p
  JOIN (
    VALUES
      ('Main Street 12',        'Main Street',    '12', '10115', 'Berlin',  1998, 1),
      ('Main Street 12',        'Main Street',    '14', '10115', 'Berlin',  2002, 2),
      ('Lindenhof',             'Lindenstraße',   '5',  '20099', 'Hamburg', 1975, 1),
      ('Berliner Allee Komplex','Berliner Allee', '55', '13088', 'Berlin',  2005, 1)
  ) AS v(prop_name, street, house_number, postal_code, city, construction_year, order_index)
    ON p.name = v.prop_name
  RETURNING id, property_id, street, house_number, order_index
)

INSERT INTO units (
  building_id, number, type, floor, entrance,
  size_sqm, co_ownership_share, construction_year, rooms,
  created_at, updated_at
)
SELECT
  b.id,
  u.number,
  u.unit_type::"UnitType",
  u.floor,
  u.entrance,
  u.size_sqm,
  u.co_ownership_share,
  u.construction_year,
  u.rooms,
  NOW(), NOW()
FROM inserted_buildings b
JOIN (
  VALUES
    -- Main Street 12 (order_index=1)
    ('Main Street', '12', '1A', 'APARTMENT', 1,    'A', 54.00,  120.5000, 1998, 2),
    ('Main Street', '12', '1B', 'APARTMENT', 1,    'B', 62.50,  143.8000, 1998, 3),
    ('Main Street', '12', '2A', 'APARTMENT', 2,    'A', 54.00,  120.5000, 1998, 2),
    ('Main Street', '12', '2B', 'APARTMENT', 2,    'B', 78.00,  180.0000, 1998, 3),
    ('Main Street', '12', 'P1', 'PARKING',   NULL, NULL, NULL,   25.7000, NULL, NULL),
    -- Main Street 14 (order_index=2)
    ('Main Street', '14', '1A', 'APARTMENT', 1,    'A', 70.00,  161.8000, 2002, 3),
    ('Main Street', '14', '1B', 'APARTMENT', 1,    'B', 85.00,  196.5000, 2002, 4),
    ('Main Street', '14', 'G1', 'GARDEN',    0,    NULL, 25.00,  57.8000, NULL, NULL),
    -- Lindenhof
    ('Lindenstraße', '5', 'B1', 'OFFICE',    0,    NULL, 120.00, 350.0000, 1975, NULL),
    ('Lindenstraße', '5', 'B2', 'OFFICE',    1,    NULL, 95.00,  277.5000, 1975, NULL),
    -- Berliner Allee
    ('Berliner Allee', '55', '1A', 'APARTMENT', 1, 'A', 88.00,  200.0000, 2005, 3),
    ('Berliner Allee', '55', '1B', 'APARTMENT', 2, 'A', 102.50, 233.5000, 2005, 4),
    ('Berliner Allee', '55', 'P1', 'PARKING',  -1, NULL, 14.00,  32.0000, NULL, NULL)
) AS u(street, house_number, number, unit_type, floor, entrance, size_sqm, co_ownership_share, construction_year, rooms)
  ON b.street = u.street AND b.house_number = u.house_number;

-- -----------------------------------------
-- 3. OWNERS
-- -----------------------------------------
INSERT INTO owners (id, first_name, last_name, email, phone, created_at)
VALUES
  ('44444444-0000-0000-0000-000000000001', 'Thomas',  'Becker',     'thomas.becker@email.de',    '+49 30 12345678', NOW()),
  ('44444444-0000-0000-0000-000000000002', 'Maria',   'Fischer',    'maria.fischer@email.de',    '+49 30 87654321', NOW()),
  ('44444444-0000-0000-0000-000000000003', 'Stefan',  'Hoffmann',   'stefan.hoffmann@email.de',  '+49 40 11223344', NOW()),
  ('44444444-0000-0000-0000-000000000004', 'Laura',   'Wagner',     'laura.wagner@email.de',     '+49 40 44332211', NOW()),
  ('44444444-0000-0000-0000-000000000005', 'Michael', 'Schulz',     'michael.schulz@email.de',   '+49 30 99887766', NOW()),
  ('44444444-0000-0000-0000-000000000006', 'Petra',   'Zimmermann', 'petra.zimmermann@email.de', NULL,              NOW()),
  ('44444444-0000-0000-0000-000000000007', 'Klaus',   'Richter',    'klaus.richter@email.de',    '+49 89 55443322', NOW()),
  ('44444444-0000-0000-0000-000000000008', 'Sabine',  'Neumann',    'sabine.neumann@email.de',   '+49 89 22334455', NOW());

-- -----------------------------------------
-- 4. UNIT_OWNERS (Many-to-Many)
-- -----------------------------------------
INSERT INTO unit_owners (unit_id, owner_id, share)
SELECT u.id, o.id, v.share
FROM (
  VALUES
    ('1A', 'Main Street',    '12', 'thomas.becker@email.de',    100.00),
    ('1B', 'Main Street',    '12', 'maria.fischer@email.de',     60.00),
    ('1B', 'Main Street',    '12', 'stefan.hoffmann@email.de',   40.00),
    ('2A', 'Main Street',    '12', 'laura.wagner@email.de',     100.00),
    ('2B', 'Main Street',    '12', 'michael.schulz@email.de',   100.00),
    ('P1', 'Main Street',    '12', 'michael.schulz@email.de',   100.00),
    ('1A', 'Main Street',    '14', 'petra.zimmermann@email.de', 100.00),
    ('1B', 'Main Street',    '14', 'petra.zimmermann@email.de', 100.00),
    ('B1', 'Lindenstraße',   '5',  'klaus.richter@email.de',     50.00),
    ('B1', 'Lindenstraße',   '5',  'sabine.neumann@email.de',    50.00),
    ('B2', 'Lindenstraße',   '5',  'thomas.becker@email.de',    100.00),
    ('1A', 'Berliner Allee', '55', 'maria.fischer@email.de',     70.00),
    ('1A', 'Berliner Allee', '55', 'sabine.neumann@email.de',    30.00),
    ('1B', 'Berliner Allee', '55', 'klaus.richter@email.de',    100.00)
) AS v(unit_number, street, house_number, owner_email, share)
JOIN units u ON u.number = v.unit_number
JOIN buildings b ON b.id = u.building_id
  AND b.street = v.street
  AND b.house_number = v.house_number
JOIN owners o ON o.email = v.owner_email;
