import type { Request, Response } from 'express';
import Appointment, { type AppointmentData } from '../models/appointmentModel.js';
import Service from '../models/serviceModel.js';

type IdParams = { id: string };
type AppointmentStatus = 'agendado' | 'concluido' | 'cancelado';

function validateAppointment(body: unknown): AppointmentData | null {
  if (!body || typeof body !== 'object') return null;

  const { service_id, client_name, client_phone, scheduled_at, status, notes } = body as Record<string, unknown>;
  const validStatuses: AppointmentStatus[] = ['agendado', 'concluido', 'cancelado'];
  const appointmentStatus = status ?? 'agendado';

  if (typeof service_id !== 'string' || !service_id) return null;
  if (typeof client_name !== 'string' || !client_name.trim()) return null;
  if (typeof client_phone !== 'string' || !client_phone.trim()) return null;
  if (typeof scheduled_at !== 'string' || Number.isNaN(Date.parse(scheduled_at))) return null;
  if (typeof appointmentStatus !== 'string' || !validStatuses.includes(appointmentStatus as AppointmentStatus)) return null;
  if (notes !== undefined && typeof notes !== 'string') return null;

  return {
    service_id,
    client_name: client_name.trim(),
    client_phone: client_phone.trim(),
    scheduled_at,
    status: appointmentStatus as AppointmentStatus,
    notes: notes as string | undefined,
  };
}

function isDatabaseError(error: unknown, code: string) {
  return typeof error === 'object' && error !== null && 'code' in error
    && (error as { code?: string }).code === code;
}

async function hasScheduleConflict(
  appointmentData: AppointmentData,
  durationMinutes: number,
  appointmentIdToIgnore?: string,
) {
  if (appointmentData.status === 'cancelado') return false;

  const appointments = await Appointment.findActiveByServiceId(
    appointmentData.service_id,
    appointmentIdToIgnore,
  );
  const requestedStart = new Date(appointmentData.scheduled_at).getTime();
  const requestedEnd = requestedStart + durationMinutes * 60_000;

  return appointments.some((appointment) => {
    const existingStart = new Date(appointment.scheduled_at).getTime();
    const existingEnd = existingStart + durationMinutes * 60_000;

    return requestedStart < existingEnd && existingStart < requestedEnd;
  });
}

async function getAll(_request: Request, response: Response) {
  try {
    const appointments = await Appointment.findAll();
    return response.status(200).json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return response.status(500).json({ message: 'Erro ao buscar agendamentos.' });
  }
}

async function getById(request: Request<IdParams>, response: Response) {
  try {
    const appointment = await Appointment.findById(request.params.id);

    if (!appointment) {
      return response.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    return response.status(200).json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return response.status(500).json({ message: 'Erro ao buscar agendamento.' });
  }
}

async function create(request: Request, response: Response) {
  const appointmentData = validateAppointment(request.body);

  if (!appointmentData) {
    return response.status(400).json({ message: 'Informe dados válidos para o agendamento.' });
  }

  try {
    const service = await Service.findById(appointmentData.service_id);

    if (!service) {
      return response.status(404).json({ message: 'Serviço não encontrado.' });
    }

    if (!service.active) {
      return response.status(400).json({ message: 'O serviço informado está inativo.' });
    }

    if (await hasScheduleConflict(appointmentData, service.duration_minutes)) {
      return response.status(409).json({
        message: 'Já existe um agendamento que ocupa este horário para o serviço informado.',
      });
    }

    const appointment = await Appointment.create(appointmentData);
    return response.status(201).json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);

    if (isDatabaseError(error, '23505')) {
      return response.status(409).json({
        message: 'Já existe um agendamento para este serviço neste horário.',
      });
    }

    return response.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
}

async function update(request: Request<IdParams>, response: Response) {
  const appointmentData = validateAppointment(request.body);

  if (!appointmentData) {
    return response.status(400).json({ message: 'Informe dados válidos para o agendamento.' });
  }

  try {
    const service = await Service.findById(appointmentData.service_id);

    if (!service) {
      return response.status(404).json({ message: 'Serviço não encontrado.' });
    }

    if (await hasScheduleConflict(appointmentData, service.duration_minutes, request.params.id)) {
      return response.status(409).json({
        message: 'Já existe um agendamento que ocupa este horário para o serviço informado.',
      });
    }

    const appointment = await Appointment.update(request.params.id, appointmentData);

    if (!appointment) {
      return response.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    return response.status(200).json(appointment);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);

    if (isDatabaseError(error, '23505')) {
      return response.status(409).json({
        message: 'Já existe um agendamento para este serviço neste horário.',
      });
    }

    return response.status(500).json({ message: 'Erro ao atualizar agendamento.' });
  }
}

async function remove(request: Request<IdParams>, response: Response) {
  try {
    const appointment = await Appointment.remove(request.params.id);

    if (!appointment) {
      return response.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    return response.status(200).json({ message: 'Agendamento removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return response.status(500).json({ message: 'Erro ao remover agendamento.' });
  }
}

export default { getAll, getById, create, update, remove };
