
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentSettings {
  id: string;
  bkash_enabled: boolean;
  ssl_enabled: boolean;
  cod_enabled: boolean;
  bkash_live_mode: boolean;
  ssl_live_mode: boolean;
  cod_min_order: number;
  cod_max_order: number;
  created_at: string;
  updated_at: string;
}

export const usePaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      console.log('Fetching payment settings...');
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      console.log('Fetched settings:', data);
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching payment settings:', err);
      setError('Failed to load payment settings');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Set up real-time subscription for payment settings changes
    const channel = supabase
      .channel('payment_settings_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_settings'
        },
        (payload) => {
          console.log('Real-time payment settings change:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            console.log('Updating settings state with new data:', payload.new);
            setSettings(payload.new as PaymentSettings);
          } else if (payload.eventType === 'INSERT' && payload.new) {
            console.log('New settings inserted:', payload.new);
            setSettings(payload.new as PaymentSettings);
          } else {
            console.log('Refetching settings due to unknown change type');
            fetchSettings();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, error, refetch: fetchSettings };
};

export const useUpdatePaymentSettings = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateSettings = async (updates: Partial<PaymentSettings>) => {
    try {
      console.log('Starting payment settings update with:', updates);
      setUpdating(true);
      
      const { data, error } = await supabase
        .from('payment_settings')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Payment settings update successful:', data);
      
      toast({
        title: "Settings updated",
        description: "Payment settings have been saved successfully.",
      });

      return { success: true, data };
    } catch (err) {
      console.error('Payment settings update failed:', err);
      toast({
        title: "Error",
        description: "Failed to update payment settings.",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setUpdating(false);
    }
  };

  return { updateSettings, updating };
};
