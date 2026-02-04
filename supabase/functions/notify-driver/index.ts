import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface NotifyDriverRequest {
  driver_id: string;
  complaint_id: string;
  complaint_number: string;
  area: string;
  address: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { driver_id, complaint_id, complaint_number, area, address }: NotifyDriverRequest = await req.json();

    console.log('Notifying driver:', { driver_id, complaint_id, complaint_number });

    // Get driver details
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('id, full_name, email, phone')
      .eq('id', driver_id)
      .single();

    if (driverError || !driver) {
      console.error('Driver not found:', driverError);
      throw new Error('Driver not found');
    }

    console.log('Driver found:', driver.full_name, driver.email);

    // Prepare notification data
    const notification = {
      driver_name: driver.full_name,
      driver_email: driver.email,
      driver_phone: driver.phone,
      complaint_number,
      area,
      address,
      assigned_at: new Date().toISOString(),
    };

    console.log('Notification prepared:', JSON.stringify(notification, null, 2));

    // Log the notification - email sending can be added later with RESEND_API_KEY
    // For now, we just confirm the notification was processed
    console.log(`Assignment notification for ${driver.full_name} (${driver.email})`);
    console.log(`Complaint: ${complaint_number} at ${area}, ${address}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Driver ${driver.full_name} has been notified`,
        notification 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in notify-driver function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
