import supabase from '../config/supabase.js';

export type ServiceData = {
  category_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  active?: boolean;
};

async function findAll() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');

  if (error) throw error;

  return data;
}

async function findById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function create(serviceData: ServiceData) {
  const { data, error } = await supabase
    .from('services')
    .insert({
      ...serviceData,
      description: serviceData.description ?? null,
      active: serviceData.active ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function update(id: string, serviceData: ServiceData) {
  const { data, error } = await supabase
    .from('services')
    .update({
      ...serviceData,
      description: serviceData.description ?? null,
      active: serviceData.active ?? true,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function remove(id: string) {
  const { data, error } = await supabase
    .from('services')
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
