export const TEXT_KEYS = {
  common: {
    appName: 'common:app.name',
    appTagline: 'common:app.tagline',
  },
  checkout: {
    eyebrow: 'checkout:eyebrow',
    title: 'checkout:title',
    description: 'checkout:description',
    sections: {
      customer: 'checkout:sections.customer',
      payment: 'checkout:sections.payment',
      billing: 'checkout:sections.billing',
      security: 'checkout:sections.security',
    },
  },
  dashboard: {
    eyebrow: 'dashboard:eyebrow',
    title: 'dashboard:title',
    description: 'dashboard:description',
    summary: {
      totalTransactions: 'dashboard:summary.totalTransactions',
      successVolume: 'dashboard:summary.successVolume',
      successCount: 'dashboard:summary.successCount',
      failedCount: 'dashboard:summary.failedCount',
    },
    charts: {
      statusBreakdown: 'dashboard:charts.statusBreakdown',
      volumeOverTime: 'dashboard:charts.volumeOverTime',
      currencyDistribution: 'dashboard:charts.currencyDistribution',
    },
    table: {
      title: 'dashboard:table.title',
    },
  },
} as const;

