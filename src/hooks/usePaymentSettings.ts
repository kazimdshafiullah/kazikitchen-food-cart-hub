
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
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

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

    // Set up real-time subscription
    const channel = supabase
      .channel('payment_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_settings'
        },
        (payload) => {
          console.log('Payment settings changed:', payload);
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
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
      setUpdating(true);
      
      const { error } = await supabase
        .from('payment_settings')
        .update(updates)
        .eq('id', updates.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Settings updated",
        description: "Payment settings have been saved successfully.",
      });

      return { success: true };
    } catch (err) {
      console.error('Error updating payment settings:', err);
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
