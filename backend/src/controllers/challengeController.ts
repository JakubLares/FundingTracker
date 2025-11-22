import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreateChallengeDTO, UpdateChallengeDTO } from '../types';

export const getChallenges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { status, propFirmId, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (propFirmId) {
      where.propFirmId = propFirmId;
    }

    const challenges = await prisma.challenge.findMany({
      where,
      include: {
        propFirm: true,
        payouts: true,
      },
      orderBy: {
        [sortBy as string]: order,
      },
    });

    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChallengeById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const challenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        propFirm: true,
        payouts: true,
      },
    });

    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createChallenge = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const data: CreateChallengeDTO = req.body;

    if (!data.propFirmId || !data.accountSize || !data.purchasePrice || !data.status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const challenge = await prisma.challenge.create({
      data: {
        userId,
        propFirmId: data.propFirmId,
        identifier: data.identifier,
        accountSize: data.accountSize,
        purchasePrice: data.purchasePrice,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes,
      },
      include: {
        propFirm: true,
      },
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateChallenge = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data: UpdateChallengeDTO = req.body;

    const existingChallenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingChallenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    const updateData: any = {};

    if (data.propFirmId !== undefined) updateData.propFirmId = data.propFirmId;
    if (data.identifier !== undefined) updateData.identifier = data.identifier;
    if (data.accountSize !== undefined) updateData.accountSize = data.accountSize;
    if (data.purchasePrice !== undefined) updateData.purchasePrice = data.purchasePrice;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData,
      include: {
        propFirm: true,
      },
    });

    res.json(challenge);
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteChallenge = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existingChallenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingChallenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    await prisma.challenge.delete({
      where: { id },
    });

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
