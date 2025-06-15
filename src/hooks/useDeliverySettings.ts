
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DeliverySettings {
  id: string;
  free_delivery_threshold: number;
  frozen_food_delivery_fee: number;
  weekend_menu_free_delivery: boolean;
  created_at: string;
  updated_at: string;
}

export const useDeliverySettings = () => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      console.log('=== FETCHING DELIVERY SETTINGS ===');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('delivery_settings' as any)
        .select('*')
        .limit(1);

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No delivery settings found, creating default settings...');
        
        const { data: newData, error: insertError } = await supabase
          .from('delivery_settings' as any)
          .insert({
            free_delivery_threshold: 500,
            frozen_food_delivery_fee: 70,
            weekend_menu_free_delivery: true
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }

        console.log('Created default settings:', newData);
        setSettings(newData as unknown as DeliverySettings);
      } else {
        console.log('Found existing settings:', data[0]);
        setSettings(data[0] as unknown as DeliverySettings);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchSettings:', err);
      setError(err.message || 'Failed to load delivery settings');
      setSettings(null);
    } finally {
      setLoading(false);
      console.log('=== FETCH DELIVERY SETTINGS COMPLETE ===');
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('delivery_settings_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_settings'
        },
        (payload) => {
          console.log('Real-time delivery settings change:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            console.log('Updating settings state with new data:', payload.new);
            setSettings(payload.new as unknown as DeliverySettings);
          } else if (payload.eventType === 'INSERT' && payload.new) {
            console.log('New settings inserted:', payload.new);
            setSettings(payload.new as unknown as DeliverySettings);
          } else {
            console.log('Refetching settings due to unknown change type');
            fetchSettings();
          }
        }
      )
      .subscribe((status) => {
        console.log('Delivery settings subscription status:', status);
      });

    return () => {
      console.log('Cleaning up delivery settings subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, error, refetch: fetchSettings };
};

export const useUpdateDeliverySettings = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateSettings = async (updates: Partial<DeliverySettings>) => {
    try {
      console.log('=== UPDATING DELIVERY SETTINGS ===');
      console.log('Updates to apply:', updates);
      setUpdating(true);
      
      const { data, error } = await supabase
        .from('delivery_settings' as any)
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Delivery settings update successful:', data);
      
      toast({
        title: "Settings updated",
        description: "Delivery settings have been saved successfully.",
      });

      return { success: true, data };
    } catch (err: any) {
      console.error('Delivery settings update failed:', err);
      toast({
        title: "Error",
        description: "Failed to update delivery settings.",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setUpdating(false);
      console.log('=== UPDATE DELIVERY SETTINGS COMPLETE ===');
    }
  };

  return { updateSettings, updating };
};
