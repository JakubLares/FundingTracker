import { Request, Response } from 'express';
import prisma from '../config/database';
import { CreatePropFirmDTO } from '../types';

export const getPropFirms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const propFirms = await prisma.propFirm.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(propFirms);
  } catch (error) {
    console.error('Get prop firms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPropFirm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name }: CreatePropFirmDTO = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const existingPropFirm = await prisma.propFirm.findUnique({
      where: { name },
    });

    if (existingPropFirm) {
      res.status(400).json({ error: 'Prop firm already exists' });
      return;
    }

    const propFirm = await prisma.propFirm.create({
      data: { name },
    });

    res.status(201).json(propFirm);
  } catch (error) {
    console.error('Create prop firm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
