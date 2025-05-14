
import { useToast, toast } from "@/hooks/use-toast";
export { useToast, toast };

// Enable realtime for the feedback table
import { supabase } from "@/integrations/supabase/client";

// This is to enable realtime for the feedback table
// It will run once when this file is imported
(async () => {
  try {
    // Enable realtime for the feedback table
    await supabase.rpc('supabase_realtime', { 
      table: 'feedback',
      action: 'subscribe'
    });
    
    console.log('Realtime enabled for feedback table');
  } catch (error) {
    console.error('Failed to enable realtime for feedback table:', error);
  }
})();
