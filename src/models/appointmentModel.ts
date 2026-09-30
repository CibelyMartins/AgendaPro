import supabase from '../config/supabase.js';

export type AppointmentData = {
  service_id: string;
  client_name: string;
  client_phone: string;
  scheduled_at: string;
  status?: 'agendado' | 'concluido' | 'cancelado';
  notes?: string;
};

async function findAll() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('scheduled_at');

  if (error) throw error;

  return data;
}

async function findById(id: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function create(appointmentData: AppointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...appointmentData,
      status: appointmentData.status ?? 'agendado',
      notes: appointmentData.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function update(
  id: string,
  appointmentData: AppointmentData,
) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      ...appointmentData,
      status: appointmentData.status ?? 'agendado',
      notes: appointmentData.notes ?? null,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function remove(id: string) {
  const { data, error } = await supabase
    .from('appointments')
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
