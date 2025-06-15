
import { supabase } from "@/integrations/supabase/client";

export const initializeDatabase = async () => {
  try {
    // Check and create main categories
    const { data: existingMainCategories } = await supabase
      .from('main_categories')
      .select('name');

    const requiredMainCategories = [
      { name: 'frozen_food', description: 'Frozen food items ready to heat and enjoy', advance_days: 0, order_cutoff_time: '22:00:00' },
      { name: 'School Tiffin', description: 'Daily tiffin service for students', advance_days: 1, order_cutoff_time: '22:00:00' },
      { name: 'Office Food', description: 'Professional catering for offices', advance_days: 1, order_cutoff_time: '22:00:00' }
    ];

    const existingNames = existingMainCategories?.map(cat => cat.name) || [];
    
    for (const category of requiredMainCategories) {
      if (!existingNames.includes(category.name)) {
        await supabase
          .from('main_categories')
          .insert(category);
      }
    }

    // Get main categories for sub-category creation
    const { data: mainCategories } = await supabase
      .from('main_categories')
      .select('*');

    if (!mainCategories) return;

    // Check and create sub-categories
    const { data: existingSubCategories } = await supabase
      .from('sub_categories')
      .select('*');

    const officeFoodCategory = mainCategories.find(cat => cat.name === 'Office Food');
    const schoolTiffinCategory = mainCategories.find(cat => cat.name === 'School Tiffin');

    const requiredSubCategories = [
      ...(officeFoodCategory ? [
        { name: 'Breakfast', main_category_id: officeFoodCategory.id, description: 'Morning meal service' },
        { name: 'Lunch', main_category_id: officeFoodCategory.id, description: 'Midday meal service' }
      ] : []),
      ...(schoolTiffinCategory ? [
        { name: 'Breakfast', main_category_id: schoolTiffinCategory.id, description: 'Morning tiffin for students' }
      ] : [])
    ];

    for (const subCategory of requiredSubCategories) {
      const exists = existingSubCategories?.find(
        sub => sub.name === subCategory.name && sub.main_category_id === subCategory.main_category_id
      );
      
      if (!exists) {
        await supabase
          .from('sub_categories')
          .insert(subCategory);
      }
    }

    // Check and create meal types
    const { data: existingMealTypes } = await supabase
      .from('meal_types')
      .select('name');

    const requiredMealTypes = [
      { name: 'Regular', description: 'Standard meal option' },
      { name: 'Diet', description: 'Healthy and light meal option' },
      { name: 'Premium', description: 'Premium quality meal option' }
    ];

    const existingMealTypeNames = existingMealTypes?.map(type => type.name) || [];

    for (const mealType of requiredMealTypes) {
      if (!existingMealTypeNames.includes(mealType.name)) {
        await supabase
          .from('meal_types')
          .insert(mealType);
      }
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
