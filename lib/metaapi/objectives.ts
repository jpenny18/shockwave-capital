/**
 * Shared, framework-agnostic trading-objective logic for MetaApi-backed
 * prop-firm metrics. This is the single source of truth for challenge targets,
 * unit normalization and pass/fail evaluation. It is intentionally pure (no
 * MetaApi SDK / Firebase imports) so it can be safely used from API routes,
 * server code and client components alike.
 */

export type ChallengeType = 'standard' | 'instant' | '1-step' | 'gauntlet';

export interface ObjectiveResult {
  target: number;
  current: number;
  passed: boolean;
  recentBreach?: boolean;
  /** flag used by the instant challenge (trailing max loss) */
  isTrailing?: boolean;
  /** funded-only: true when daily drawdown exceeded the 2% risk limit */
  fundedRiskViolation?: boolean;
}

export interface TradingObjectivesResult {
  minTradingDays: ObjectiveResult;
  maxDrawdown: ObjectiveResult;
  maxDailyDrawdown?: ObjectiveResult;
  profitTarget: ObjectiveResult;
  fundedStatus?: boolean;
  tradingDaysWithGain?: number;
  fundedPayoutEligible?: boolean;
}

export interface RecentBreaches {
  maxDrawdown: boolean;
  dailyDrawdown: boolean;
  fundedRiskViolation: boolean;
}

export interface ObjectiveInput {
  challengeType: ChallengeType;
  accountStartBalance: number;
  step?: number;
  /** overall max drawdown, already expressed as a percent (e.g. 12.5 === 12.5%) */
  maxDrawdownPercent: number;
  /** worst daily drawdown achieved, already expressed as a percent */
  dailyDrawdownPercent: number;
  /** number of qualifying trading days (or, for funded accounts, days with required gain) */
  tradingDays: number;
  /** profit relative to starting balance, expressed as a percent */
  profitPercent: number;
  recentBreaches?: Partial<RecentBreaches>;
}

/**
 * Challenge target definitions. Drawdown values are percentages.
 * `maxDailyDrawdown: null` means the challenge has no daily drawdown rule.
 */
export const CHALLENGE_TARGETS = {
  standard: {
    minTradingDays: 5,
    maxDrawdown: 15,
    maxDailyDrawdown: 8 as number | null,
    profitTargetStep1: 10,
    profitTargetStep2: 5
  },
  instant: {
    minTradingDays: 5,
    maxDrawdown: 4, // 4% trailing max loss
    maxDailyDrawdown: null as number | null, // no daily drawdown limit
    profitTargetStep1: 12,
    profitTargetStep2: 0
  },
  '1-step': {
    minTradingDays: 5,
    maxDrawdown: 8,
    maxDailyDrawdown: 4 as number | null,
    profitTargetStep1: 10,
    profitTargetStep2: 0
  },
  gauntlet: {
    minTradingDays: 0,
    maxDrawdown: 15,
    maxDailyDrawdown: 8 as number | null,
    profitTargetStep1: 10,
    profitTargetStep2: 0
  },
  funded: {
    minTradingDays: 5, // 5 days with >=0.5% gain required for payout eligibility
    maxDrawdown: 15,
    maxDailyDrawdown: 8 as number | null,
    profitTarget: 0, // no profit target for funded accounts
    maxRiskLimit: 2, // violation if daily drawdown > 2%
    minDailyGain: 0.5 // % gain required for a day to count toward payout eligibility
  }
} as const;

/** Convert a fraction-of-1 (e.g. 0.05) into a percent (5). Safely handles nullish input. */
export function toPercent(fraction: number | null | undefined): number {
  if (fraction === null || fraction === undefined || Number.isNaN(fraction)) return 0;
  return fraction * 100;
}

/** Returns true when the account is in the funded phase (step 3). */
export function isFundedAccount(step?: number): boolean {
  return step === 3;
}

/**
 * Resolve the profit-target percentage for a given challenge type and step.
 */
export function getProfitTarget(challengeType: ChallengeType, step: number = 1): number {
  const target = CHALLENGE_TARGETS[challengeType] || CHALLENGE_TARGETS.standard;
  if (step === 2 && 'profitTargetStep2' in target) {
    return target.profitTargetStep2;
  }
  return 'profitTargetStep1' in target ? target.profitTargetStep1 : 0;
}

/**
 * Pure evaluation of trading objectives. All numeric inputs are expected to be
 * already-normalized (percentages where relevant) by the caller.
 */
export function calculateTradingObjectives(input: ObjectiveInput): TradingObjectivesResult {
  const {
    challengeType,
    step = 1,
    maxDrawdownPercent,
    dailyDrawdownPercent,
    tradingDays,
    profitPercent
  } = input;

  const recentBreaches: RecentBreaches = {
    maxDrawdown: input.recentBreaches?.maxDrawdown ?? false,
    dailyDrawdown: input.recentBreaches?.dailyDrawdown ?? false,
    fundedRiskViolation: input.recentBreaches?.fundedRiskViolation ?? false
  };

  const funded = isFundedAccount(step);

  // ---- Funded accounts ----
  if (funded) {
    const target = CHALLENGE_TARGETS.funded;
    const dailyTarget = target.maxDailyDrawdown as number;
    return {
      minTradingDays: {
        target: target.minTradingDays,
        current: tradingDays,
        passed: tradingDays >= target.minTradingDays
      },
      maxDrawdown: {
        target: target.maxDrawdown,
        current: maxDrawdownPercent,
        passed: maxDrawdownPercent <= target.maxDrawdown,
        recentBreach: recentBreaches.maxDrawdown
      },
      maxDailyDrawdown: {
        target: dailyTarget,
        current: dailyDrawdownPercent,
        passed: dailyDrawdownPercent <= dailyTarget,
        recentBreach: recentBreaches.dailyDrawdown || recentBreaches.fundedRiskViolation,
        fundedRiskViolation: dailyDrawdownPercent > target.maxRiskLimit
      },
      profitTarget: {
        target: 0,
        current: profitPercent,
        passed: true
      },
      fundedStatus: true,
      tradingDaysWithGain: tradingDays,
      fundedPayoutEligible: tradingDays >= target.minTradingDays
    };
  }

  // ---- Challenge accounts ----
  const target = CHALLENGE_TARGETS[challengeType] || CHALLENGE_TARGETS.standard;
  const profitTarget = getProfitTarget(challengeType, step);

  const objectives: TradingObjectivesResult = {
    minTradingDays: {
      target: target.minTradingDays,
      current: tradingDays,
      passed: tradingDays >= target.minTradingDays
    },
    maxDrawdown: {
      target: target.maxDrawdown,
      current: maxDrawdownPercent,
      passed: maxDrawdownPercent <= target.maxDrawdown,
      recentBreach: recentBreaches.maxDrawdown,
      isTrailing: challengeType === 'instant'
    },
    profitTarget: {
      target: profitTarget,
      current: profitPercent,
      passed: profitPercent >= profitTarget
    }
  };

  if (target.maxDailyDrawdown !== null) {
    const dailyTarget = target.maxDailyDrawdown as number;
    objectives.maxDailyDrawdown = {
      target: dailyTarget,
      current: dailyDrawdownPercent,
      passed: dailyDrawdownPercent <= dailyTarget,
      recentBreach: recentBreaches.dailyDrawdown
    };
  }

  return objectives;
}

/**
 * Compute the worst intraday equity drawdown (in percent) from a series of
 * day-bucketed equity points. Used only as a fallback when risk-management
 * daily statistics are unavailable. Baseline is the day's running peak equity.
 */
export function computeDailyDrawdownFromEquity(
  equityData: Array<{ date?: string; brokerTime?: string; endBrokerTime?: string; equity?: number; balance?: number; lastEquity?: number; minEquity?: number; maxEquity?: number; lastBalance?: number; maxBalance?: number }>
): number {
  if (!equityData || equityData.length === 0) return 0;

  const dailyData: { [key: string]: typeof equityData } = {};
  equityData.forEach(point => {
    const raw = point.brokerTime || point.endBrokerTime || point.date;
    if (!raw) return;
    const dayKey = new Date(raw).toISOString().slice(0, 10);
    if (!dailyData[dayKey]) dailyData[dayKey] = [];
    dailyData[dayKey].push(point);
  });

  let maxDailyDrawdown = 0;
  Object.values(dailyData).forEach(dayPoints => {
    let dayHighEquity = 0;
    let maxDayDrawdown = 0;
    dayPoints.forEach(point => {
      const equity = Number(point.equity ?? point.lastEquity ?? point.maxEquity ?? 0);
      dayHighEquity = Math.max(dayHighEquity, equity);
      const currentEquity = Number(point.lastEquity ?? point.equity ?? point.minEquity ?? 0);
      const drawdownFromHigh = dayHighEquity > 0 ? ((dayHighEquity - currentEquity) / dayHighEquity) * 100 : 0;
      maxDayDrawdown = Math.max(maxDayDrawdown, drawdownFromHigh);
    });
    maxDailyDrawdown = Math.max(maxDailyDrawdown, maxDayDrawdown);
  });

  return maxDailyDrawdown;
}

/**
 * Count trading days (days with at least one trade) from a list of trades.
 */
export function computeTradingDaysFromTrades(
  trades: Array<{ openTime?: string; time?: string; date?: string }>
): number {
  if (!trades || trades.length === 0) return 0;
  const days = new Set<string>();
  trades.forEach(trade => {
    const raw = trade.openTime || trade.time || trade.date;
    if (raw) days.add(new Date(raw).toISOString().slice(0, 10));
  });
  return days.size;
}
