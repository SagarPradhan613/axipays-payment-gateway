import { Badge } from '@components/ui/Badge';
import { CreditCardPreview } from '@pages/Checkout/components/CreditCardPreview';
import type { CheckoutStatusSidebarProps } from '@pages/Checkout/checkout.types';

export const CheckoutStatusSidebar = ({
  cardHolderName,
  cardNumber,
  cardType,
  cvv,
  expiryMonth,
  expiryYear,
  focusedField,
  paymentStatus,
  t,
}: CheckoutStatusSidebarProps) => (
  <div className="space-y-5 xl:sticky xl:top-28">
    <CreditCardPreview
      cardType={cardType}
      cardNumber={cardNumber}
      cardHolderName={cardHolderName}
      expiryMonth={expiryMonth}
      expiryYear={expiryYear}
      cvv={cvv}
      isFlipped={focusedField === 'cvv'}
      t={t}
    />
    <div className="w-full rounded-[22px] border border-white/6 bg-white/[0.02] px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          {t('checkout:statusPanel.title')}
        </p>
        <Badge
          status={paymentStatus ?? 'pending'}
          className="min-w-[148px] justify-center border border-current px-5 py-2 text-sm font-medium tracking-[0.14em]"
        >
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-current opacity-90" />
          {t(`common:statuses.${paymentStatus ?? 'pending'}`)}
        </Badge>
      </div>
    </div>
  </div>
);

