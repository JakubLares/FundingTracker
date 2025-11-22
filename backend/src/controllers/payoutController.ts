import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreatePayoutDTO, UpdatePayoutDTO } from '../types';

export const getPayouts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { challengeId, propFirmId, sortBy = 'date', order = 'desc' } = req.query;

    const where: any = { userId };

    if (challengeId) {
      where.challengeId = challengeId;
    }

    if (propFirmId) {
      where.propFirmId = propFirmId;
    }

    const payouts = await prisma.payout.findMany({
      where,
      include: {
        challenge: {
          include: {
            propFirm: true,
          },
        },
        propFirm: true,
      },
      orderBy: {
        [sortBy as string]: order,
      },
    });

    res.json(payouts);
  } catch (error) {
    console.error('Get payouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPayoutById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const payout = await prisma.payout.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        challenge: {
          include: {
            propFirm: true,
          },
        },
        propFirm: true,
      },
    });

    if (!payout) {
      res.status(404).json({ error: 'Payout not found' });
      return;
    }

    res.json(payout);
  } catch (error) {
    console.error('Get payout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPayout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const data: CreatePayoutDTO = req.body;

    if (!data.amount || !data.date) {
      res.status(400).json({ error: 'Amount and date are required' });
      return;
    }

    if (!data.challengeId && !data.propFirmId) {
      res.status(400).json({ error: 'Either challengeId or propFirmId is required' });
      return;
    }

    const payout = await prisma.payout.create({
      data: {
        userId,
        challengeId: data.challengeId || null,
        propFirmId: data.propFirmId || null,
        amount: data.amount,
        date: new Date(data.date),
        notes: data.notes,
      },
      include: {
        challenge: {
          include: {
            propFirm: true,
          },
        },
        propFirm: true,
      },
    });

    res.status(201).json(payout);
  } catch (error) {
    console.error('Create payout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePayout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data: UpdatePayoutDTO = req.body;

    const existingPayout = await prisma.payout.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPayout) {
      res.status(404).json({ error: 'Payout not found' });
      return;
    }

    const updateData: any = {};

    if (data.challengeId !== undefined) updateData.challengeId = data.challengeId || null;
    if (data.propFirmId !== undefined) updateData.propFirmId = data.propFirmId || null;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;

    const payout = await prisma.payout.update({
      where: { id },
      data: updateData,
      include: {
        challenge: {
          include: {
            propFirm: true,
          },
        },
        propFirm: true,
      },
    });

    res.json(payout);
  } catch (error) {
    console.error('Update payout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePayout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existingPayout = await prisma.payout.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPayout) {
      res.status(404).json({ error: 'Payout not found' });
      return;
    }

    await prisma.payout.delete({
      where: { id },
    });

    res.json({ message: 'Payout deleted successfully' });
  } catch (error) {
    console.error('Delete payout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
