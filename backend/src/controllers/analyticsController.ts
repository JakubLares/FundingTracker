import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId!;

    const challenges = await prisma.challenge.findMany({
      where: { userId },
      include: {
        payouts: true,
      },
    });

    const payouts = await prisma.payout.findMany({
      where: { userId },
    });

    const totalChallenges = challenges.length;
    const passedChallenges = challenges.filter((c) => c.status === 'passed').length;
    const failedChallenges = challenges.filter((c) => c.status === 'failed').length;
    const inProgressChallenges = challenges.filter((c) => c.status === 'in_progress').length;

    const totalCosts = challenges.reduce(
      (sum, challenge) => sum + Number(challenge.purchasePrice),
      0
    );

    const totalEarnings = payouts.reduce(
      (sum, payout) => sum + Number(payout.amount),
      0
    );

    const profitLoss = totalEarnings - totalCosts;
    const roi = totalCosts > 0 ? ((profitLoss / totalCosts) * 100).toFixed(2) : '0.00';
    const successRate = totalChallenges > 0 ? ((passedChallenges / totalChallenges) * 100).toFixed(2) : '0.00';

    const monthlyCosts = challenges.reduce((acc, challenge) => {
      const month = challenge.startDate
        ? new Date(challenge.startDate).toISOString().slice(0, 7)
        : 'Unknown';
      acc[month] = (acc[month] || 0) + Number(challenge.purchasePrice);
      return acc;
    }, {} as Record<string, number>);

    const monthlyEarnings = payouts.reduce((acc, payout) => {
      const month = new Date(payout.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + Number(payout.amount);
      return acc;
    }, {} as Record<string, number>);

    const allMonths = new Set([
      ...Object.keys(monthlyCosts),
      ...Object.keys(monthlyEarnings),
    ]);

    const monthlyData = Array.from(allMonths)
      .sort()
      .map((month) => ({
        month,
        costs: monthlyCosts[month] || 0,
        earnings: monthlyEarnings[month] || 0,
        profitLoss: (monthlyEarnings[month] || 0) - (monthlyCosts[month] || 0),
      }));

    res.json({
      summary: {
        totalChallenges,
        passedChallenges,
        failedChallenges,
        inProgressChallenges,
        totalCosts,
        totalEarnings,
        profitLoss,
        roi: parseFloat(roi),
        successRate: parseFloat(successRate),
      },
      monthlyData,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
