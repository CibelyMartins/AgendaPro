import type { Request, Response } from 'express';
import Category from '../models/categoryModel.js';
import Service, { type ServiceData } from '../models/serviceModel.js';

type IdParams = { id: string };

function validateService(body: unknown): ServiceData | null {
  if (!body || typeof body !== 'object') return null;

  const { category_id, name, description, price, duration_minutes, active } = body as Record<string, unknown>;

  if (typeof category_id !== 'string' || !category_id) return null;
  if (typeof name !== 'string' || !name.trim()) return null;
  if (typeof price !== 'number' || price <= 0) return null;
  if (typeof duration_minutes !== 'number' || duration_minutes <= 0) return null;
  if (description !== undefined && typeof description !== 'string') return null;
  if (active !== undefined && typeof active !== 'boolean') return null;

  return {
    category_id,
    name: name.trim(),
    description: description as string | undefined,
    price,
    duration_minutes,
    active: active as boolean | undefined,
  };
}

async function getAll(_request: Request, response: Response) {
  try {
    const services = await Service.findAll();
    return response.status(200).json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return response.status(500).json({ message: 'Erro ao buscar serviços.' });
  }
}

async function getById(request: Request<IdParams>, response: Response) {
  try {
    const service = await Service.findById(request.params.id);

    if (!service) {
      return response.status(404).json({ message: 'Serviço não encontrado.' });
    }

    return response.status(200).json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return response.status(500).json({ message: 'Erro ao buscar serviço.' });
  }
}

async function create(request: Request, response: Response) {
  const serviceData = validateService(request.body);

  if (!serviceData) {
    return response.status(400).json({ message: 'Informe dados válidos para o serviço.' });
  }

  try {
    const category = await Category.findById(serviceData.category_id);

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const service = await Service.create(serviceData);
    return response.status(201).json(service);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return response.status(500).json({ message: 'Erro ao criar serviço.' });
  }
}

async function update(request: Request<IdParams>, response: Response) {
  const serviceData = validateService(request.body);

  if (!serviceData) {
    return response.status(400).json({ message: 'Informe dados válidos para o serviço.' });
  }

  try {
    const category = await Category.findById(serviceData.category_id);

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const service = await Service.update(request.params.id, serviceData);

    if (!service) {
      return response.status(404).json({ message: 'Serviço não encontrado.' });
    }

    return response.status(200).json(service);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return response.status(500).json({ message: 'Erro ao atualizar serviço.' });
  }
}

async function remove(request: Request<IdParams>, response: Response) {
  try {
    const service = await Service.remove(request.params.id);

    if (!service) {
      return response.status(404).json({ message: 'Serviço não encontrado.' });
    }

    return response.status(200).json({ message: 'Serviço removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    return response.status(409).json({
      message: 'Não é possível excluir um serviço que possui agendamentos.',
    });
  }
}

export default { getAll, getById, create, update, remove };
