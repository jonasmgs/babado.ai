const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dgjkdxoltfjyyencuxsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnamtkeG9sdGZqeXllbmN1eHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODc2OTgsImV4cCI6MjA4NjE2MzY5OH0.9AVPBMeKHMKF36LLBhVzp5wIJy4Rsf40sGYpKosJMBY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const email = 'test@babado.ai';
  const password = 'Password123!';
  const username = 'TestUser';

  console.log(`Attempting to create user: ${email}...`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log("User already exists. That's fine!");
      process.exit(0);
    }
    console.error("Error creating user:", error.message);
    process.exit(1);
  }

  console.log("User created in Auth!");

  if (data.user) {
    // Also insert into public.users table as per supabase.ts logic
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      username,
    });

    if (dbError) {
      console.error("Error adding user to DB table:", dbError.message);
    } else {
      console.log("User added to DB table!");
    }
  }
}

createTestUser();
