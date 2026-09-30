import supabase from '../config/supabase.js';

export type CategoryData = {
  name: string;
  description?: string;
  active?: boolean;
};

async function findAll() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;

  return data;
}

async function findById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function create(categoryData: CategoryData) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryData.name,
      description: categoryData.description ?? null,
      active: categoryData.active ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function update(id: string, categoryData: CategoryData) {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: categoryData.name,
      description: categoryData.description ?? null,
      active: categoryData.active ?? true,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function remove(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;

  return data;
}

export default {
  findAll,
  findById,
  create,
  update,
  remove,
};
