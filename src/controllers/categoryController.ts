import type { Request, Response } from 'express';
import Category, { type CategoryData } from '../models/categoryModel.js';

type IdParams = { id: string };

function validateCategory(body: unknown): CategoryData | null {
  if (!body || typeof body !== 'object') return null;

  const { name, description, active } = body as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) return null;
  if (description !== undefined && typeof description !== 'string') return null;
  if (active !== undefined && typeof active !== 'boolean') return null;

  return {
    name: name.trim(),
    description: description as string | undefined,
    active: active as boolean | undefined,
  };
}

function isDatabaseError(error: unknown, code: string) {
  return typeof error === 'object' && error !== null && 'code' in error
    && (error as { code?: string }).code === code;
}

async function getAll(_request: Request, response: Response) {
  try {
    const categories = await Category.findAll();
    return response.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return response.status(500).json({ message: 'Erro ao buscar categorias.' });
  }
}

async function getById(request: Request<IdParams>, response: Response) {
  const { id } = request.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    return response.status(200).json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return response.status(500).json({ message: 'Erro ao buscar categoria.' });
  }
}

async function create(request: Request, response: Response) {
  const categoryData = validateCategory(request.body);

  if (!categoryData) {
    return response.status(400).json({
      message: 'Informe name, description e active com valores válidos.',
    });
  }

  try {
    const category = await Category.create(categoryData);
    return response.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);

    if (isDatabaseError(error, '23505')) {
      return response.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
    }

    return response.status(500).json({ message: 'Erro ao criar categoria.' });
  }
}

async function update(request: Request<IdParams>, response: Response) {
  const { id } = request.params;
  const categoryData = validateCategory(request.body);

  if (!categoryData) {
    return response.status(400).json({
      message: 'Informe name, description e active com valores válidos.',
    });
  }

  try {
    const category = await Category.update(id, categoryData);

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    return response.status(200).json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);

    if (isDatabaseError(error, '23505')) {
      return response.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
    }

    return response.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
}

async function remove(request: Request<IdParams>, response: Response) {
  const { id } = request.params;

  try {
    const category = await Category.remove(id);

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    return response.status(200).json({ message: 'Categoria removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover categoria:', error);

    if (isDatabaseError(error, '23503')) {
      return response.status(409).json({
        message: 'Não é possível excluir uma categoria que possui serviços.',
      });
    }

    return response.status(500).json({ message: 'Erro ao remover categoria.' });
  }
}

export default { getAll, getById, create, update, remove };
