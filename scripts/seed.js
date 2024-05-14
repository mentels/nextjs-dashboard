// make sure to execute the init.sql in the Supabase SQL Editor in the dashboard 
// before running the `npm run seed`
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await client.from('users').upsert(
          { id: user.id, name: user.name, email: user.email, password: hashedPassword },
          { onConflict: ['id'], ignoreDuplicates: true }
        )
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    const { data, error } = await client.from('invoices').upsert(invoices, {
      onConflict: ['id'],
      ignoreDuplicates: true,
    }).select();

    if (error) {
      throw new Error('Error seeding invoices');
    }

    console.log(`Seeded ${data.length} invoices`);

    return {
      invoices: data,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.from('customers').upsert(
          { id: customer.id, name: customer.name, email: customer.email, image_url: customer.image_url },
          { onConflict: ['id'], ignoreDuplicates: true }
        ),
      ));

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.from('revenue').upsert(
        { month: rev.month, revenue: rev.revenue },
        { onConflict: ['month'], ignoreDuplicates: true }
      ),
    ));

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = createClient(supabaseUrl, supabaseKey)

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
