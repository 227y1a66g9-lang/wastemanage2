 import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 }
 
 Deno.serve(async (req) => {
   // Handle CORS preflight
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders })
   }
 
   try {
     const supabaseUrl = Deno.env.get('SUPABASE_URL')!
     const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
     
     // Create admin client with service role key
     const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
       auth: {
         autoRefreshToken: false,
         persistSession: false
       }
     })
     
     // Verify the requesting user is an admin
     const authHeader = req.headers.get('Authorization')
     if (!authHeader) {
       return new Response(
         JSON.stringify({ error: 'No authorization header' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     const token = authHeader.replace('Bearer ', '')
     const { data: { user: requestingUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
     
     if (authError || !requestingUser) {
       return new Response(
         JSON.stringify({ error: 'Invalid token' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     // Check if requesting user is an admin
     const { data: roleData, error: roleError } = await supabaseAdmin
       .from('user_roles')
       .select('role')
       .eq('user_id', requestingUser.id)
       .eq('role', 'admin')
       .maybeSingle()
     
     if (roleError || !roleData) {
       return new Response(
         JSON.stringify({ error: 'Only admins can create drivers' }),
         { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     // Parse request body
     const { email, password, full_name, phone, license_number, vehicle_number } = await req.json()
     
     if (!email || !password || !full_name || !phone) {
       return new Response(
         JSON.stringify({ error: 'Missing required fields: email, password, full_name, phone' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     // Create user using Admin API (doesn't affect current session)
     const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
       email,
       password,
       email_confirm: true, // Auto-confirm since admin is creating
       user_metadata: {
         full_name,
       }
     })
     
     if (createError) {
       console.error('Error creating user:', createError)
       return new Response(
         JSON.stringify({ error: createError.message }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     // Insert driver record
     const { data: driverData, error: driverError } = await supabaseAdmin
       .from('drivers')
       .insert([{
         full_name,
         phone,
         email,
         license_number: license_number || null,
         vehicle_number: vehicle_number ? vehicle_number.toUpperCase().replace(/[\s-]/g, '') : null,
         user_id: newUser.user.id,
         status: 'active'
       }])
       .select()
       .single()
     
     if (driverError) {
       console.error('Error inserting driver:', driverError)
       // Rollback: delete the created user
       await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
       return new Response(
         JSON.stringify({ error: driverError.message }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
     
     // Add driver role
     const { error: roleInsertError } = await supabaseAdmin
       .from('user_roles')
       .insert([{
         user_id: newUser.user.id,
         role: 'driver'
       }])
     
     if (roleInsertError) {
       console.error('Error adding driver role:', roleInsertError)
       // Non-critical, continue anyway
     }
     
     console.log('Driver created successfully:', driverData)
     
     return new Response(
       JSON.stringify({ success: true, driver: driverData }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     )
     
   } catch (error) {
     console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
     return new Response(
      JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     )
   }
 })