import { motion } from 'framer-motion';
import { CHECKOUT_CARD_LOGO_COLORS } from '@constants';
import type { CardType } from '@types';
import { maskCVV, maskCardNumber } from '@utils';
import type { CreditCardPreviewProps } from '@pages/Checkout/checkout.types';

interface CardTypeLogoProps {
  cardType: CardType;
}

/**
 * Renders a small SVG badge for the detected card network.
 */
export const CardTypeLogo = ({ cardType }: CardTypeLogoProps) => {
  if (cardType === 'visa') {
    return (
      <svg viewBox="0 0 64 24" className="h-6 w-16" aria-hidden="true">
        <rect width="64" height="24" rx="12" fill={CHECKOUT_CARD_LOGO_COLORS.visa} />
        <text x="15" y="16" fill="white" fontSize="11" fontWeight="700" letterSpacing="1.4">
          VISA
        </text>
      </svg>
    );
  }

  if (cardType === 'mastercard') {
    return (
      <svg viewBox="0 0 64 24" className="h-6 w-16" aria-hidden="true">
        <rect width="64" height="24" rx="12" fill={CHECKOUT_CARD_LOGO_COLORS.mastercardBackground} />
        <circle cx="27" cy="12" r="7" fill={CHECKOUT_CARD_LOGO_COLORS.mastercardRed} />
        <circle cx="37" cy="12" r="7" fill={CHECKOUT_CARD_LOGO_COLORS.mastercardYellow} fillOpacity="0.9" />
      </svg>
    );
  }

  if (cardType === 'amex') {
    return (
      <svg viewBox="0 0 64 24" className="h-6 w-16" aria-hidden="true">
        <rect width="64" height="24" rx="12" fill={CHECKOUT_CARD_LOGO_COLORS.amex} />
        <text x="11" y="11" fill="white" fontSize="8" fontWeight="700">
          AMERICAN
        </text>
        <text x="16" y="18" fill="white" fontSize="8" fontWeight="700">
          EXPRESS
        </text>
      </svg>
    );
  }

  return null;
};

/**
 * Displays a live, animated payment card preview that flips on CVV focus.
 */
export const CreditCardPreview = ({
  cardType,
  cardNumber,
  cardHolderName,
  expiryMonth,
  expiryYear,
  cvv,
  isFlipped,
  t,
}: CreditCardPreviewProps) => {
  const safeNumber = cardNumber ? maskCardNumber(cardNumber) : t('checkout:preview.cardNumberPlaceholder');
  const safeName = cardHolderName || t('checkout:preview.namePlaceholder');
  const safeExpiry =
    expiryMonth && expiryYear
      ? `${expiryMonth}/${expiryYear.slice(-2)}`
      : t('checkout:preview.expiryPlaceholder');
  const cardNumberLines = safeNumber.split(' ').reduce<string[]>((lines, chunk, index) => {
    if (index < 3) {
      lines[0] = `${lines[0] ?? ''} ${chunk}`.trim();
    } else {
      lines[1] = `${lines[1] ?? ''} ${chunk}`.trim();
    }

    return lines;
  }, []);

  return (
    <div className="perspective-[1200px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto min-h-[250px] w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#1a1a1a_0%,#121212_55%,#7c3aed_100%)] p-5 text-white sm:p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="flex items-start justify-between">
            <div className="relative z-10 rounded-xl bg-[#2f291c] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <div className="h-7 w-8 rounded-md bg-[#f2c75b]" />
            </div>
            <div className="relative z-10 flex flex-col items-end gap-3">
              <p className="font-display text-[1.35rem] font-semibold italic text-white/55">Axipays Elite</p>
              <CardTypeLogo cardType={cardType} />
            </div>
          </div>

          <div className="relative z-10 mt-3 space-y-1.5">
            {cardNumberLines.map((line) => (
              <p
                key={line}
                className="font-mono text-[1.18rem] font-semibold tracking-[0.18em] text-white sm:text-[1.45rem]"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#c8baff]">
                {safeName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">
                {t('checkout:preview.expiry')}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tracking-[0.08em]">{safeExpiry}</p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#171717_0%,#121212_54%,#7c3aed_100%)] p-6 text-white shadow-[0_28px_60px_rgba(15,15,15,0.22)]"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className="mt-4 h-12 rounded-lg bg-white/85" />
          <div className="mt-8 rounded-[14px] bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.32em] text-white/55">
                {t('checkout:preview.securityCode')}
              </span>
              <span className="rounded-xl bg-white px-4 py-2 font-mono text-lg font-semibold tracking-[0.3em] text-slate-900">
                {cvv ? maskCVV() : t('checkout:preview.cvvPlaceholder')}
              </span>
            </div>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/72">
            {t('checkout:preview.backNote')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
