CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  amount INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue (
  month VARCHAR(4) NOT NULL UNIQUE,
  revenue INT NOT NULL
);
-- required to use the aggregate functions; see https://supabase.com/blog/postgrest-aggregate-functions
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';