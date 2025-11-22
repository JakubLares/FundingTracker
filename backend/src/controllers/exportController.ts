import { Response } from 'express';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import prisma from '../config/database';
import { AuthRequest } from '../types';

interface ChallengeCSVRecord {
  'Prop Firm': string;
  'Challenge ID': string;
  'Account Size': string;
  'Purchase Price': string;
  'Status': string;
  'Start Date': string;
  'End Date': string;
  'Notes': string;
  'Created At': string;
}

interface PayoutCSVRecord {
  'Amount': string;
  'Date': string;
  'Challenge ID': string;
  'Prop Firm': string;
  'Notes': string;
  'Created At': string;
}

export const exportChallenges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const challenges = await prisma.challenge.findMany({
      where: { userId },
      include: {
        propFirm: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const csvData = challenges.map((challenge) => ({
      'Prop Firm': challenge.propFirm?.name || '',
      'Challenge ID': challenge.identifier || '',
      'Account Size': Number(challenge.accountSize),
      'Purchase Price': Number(challenge.purchasePrice),
      'Status': challenge.status,
      'Start Date': challenge.startDate ? new Date(challenge.startDate).toISOString().split('T')[0] : '',
      'End Date': challenge.endDate ? new Date(challenge.endDate).toISOString().split('T')[0] : '',
      'Notes': challenge.notes || '',
      'Created At': new Date(challenge.createdAt).toISOString(),
    }));

    const csv = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=challenges.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export challenges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportPayouts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const payouts = await prisma.payout.findMany({
      where: { userId },
      include: {
        challenge: {
          include: {
            propFirm: true,
          },
        },
        propFirm: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const csvData = payouts.map((payout) => ({
      'Amount': Number(payout.amount),
      'Date': new Date(payout.date).toISOString().split('T')[0],
      'Challenge ID': payout.challenge?.identifier || '',
      'Prop Firm': payout.challenge?.propFirm?.name || payout.propFirm?.name || '',
      'Notes': payout.notes || '',
      'Created At': new Date(payout.createdAt).toISOString(),
    }));

    const csv = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payouts.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export payouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const importChallenges = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const { csvData } = req.body;

    if (!csvData) {
      res.status(400).json({ error: 'CSV data is required' });
      return;
    }

    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as ChallengeCSVRecord[];

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        // Find prop firm by name or skip
        const propFirm = await prisma.propFirm.findFirst({
          where: { name: record['Prop Firm'] },
        });

        if (!propFirm) {
          skipped++;
          errors.push(`Prop firm "${record['Prop Firm']}" not found`);
          continue;
        }

        await prisma.challenge.create({
          data: {
            userId,
            propFirmId: propFirm.id,
            identifier: record['Challenge ID'] || null,
            accountSize: parseFloat(record['Account Size']) || 0,
            purchasePrice: parseFloat(record['Purchase Price']) || 0,
            status: record['Status'] || 'in_progress',
            startDate: record['Start Date'] ? new Date(record['Start Date']) : null,
            endDate: record['End Date'] ? new Date(record['End Date']) : null,
            notes: record['Notes'] || null,
          },
        });

        imported++;
      } catch (err) {
        skipped++;
        errors.push(`Failed to import row: ${JSON.stringify(record)}`);
      }
    }

    res.json({
      message: 'Import completed',
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Import challenges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const importPayouts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const { csvData } = req.body;

    if (!csvData) {
      res.status(400).json({ error: 'CSV data is required' });
      return;
    }

    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as PayoutCSVRecord[];

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        let challengeId = null;
        let propFirmId = null;

        // Try to find challenge by identifier
        if (record['Challenge ID']) {
          const challenge = await prisma.challenge.findFirst({
            where: {
              userId,
              identifier: record['Challenge ID'],
            },
          });
          challengeId = challenge?.id || null;
        }

        // Try to find prop firm by name
        if (record['Prop Firm']) {
          const propFirm = await prisma.propFirm.findFirst({
            where: { name: record['Prop Firm'] },
          });
          propFirmId = propFirm?.id || null;
        }

        if (!challengeId && !propFirmId) {
          skipped++;
          errors.push(`No valid challenge or prop firm found for payout`);
          continue;
        }

        await prisma.payout.create({
          data: {
            userId,
            challengeId,
            propFirmId,
            amount: parseFloat(record['Amount']) || 0,
            date: new Date(record['Date']),
            notes: record['Notes'] || null,
          },
        });

        imported++;
      } catch (err) {
        skipped++;
        errors.push(`Failed to import row: ${JSON.stringify(record)}`);
      }
    }

    res.json({
      message: 'Import completed',
      imported,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Import payouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
