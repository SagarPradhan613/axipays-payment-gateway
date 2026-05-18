import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Dropdown } from '@components/ui/Dropdown';
import { ExpiryDateFields } from '@components/ui/ExpiryDateFields';
import { Input } from '@components/ui/Input';
import { Modal } from '@components/ui/Modal';
import { Textarea } from '@components/ui/Textarea';
import { SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES } from '@constants';
import { useCardFormatter, usePageTitle, usePayment } from '@hooks';
import { CardTypeLogo } from '@pages/Checkout/components/CreditCardPreview';
import { CheckoutStatusSidebar } from '@pages/Checkout/components/CheckoutStatusSidebar';
import { StatusModalContent } from '@pages/Checkout/components/StatusModalContent';
import { createCheckoutSchema } from '@pages/Checkout/schema/createCheckoutSchema';
import type { CheckoutFormValues, FieldShellProps, SelectOption } from '@pages/Checkout/checkout.types';
import { splitCheckoutHeading } from '@pages/Checkout/utils/splitCheckoutHeading';
import { useCheckoutStore } from '@store';
import type { CheckoutFormData, PaymentStatus } from '@types';
import { cn, validateLuhn } from '@utils';

interface RedirectFrameSectionProps {
  paymentStatus: PaymentStatus | null;
  redirectUrl: string | null;
  t: TFunction;
}

const EMPTY_CHECKOUT_VALUES: CheckoutFormValues = {
  cardHolderName: '',
  email: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  amount: '',
  currency: 'USD',
  country: '',
  address: '',
  phone: '',
};

/**
 * Renders a motion-enhanced field wrapper with shared label, hint, and error styling.
 */
const FieldShell = ({ label, error, isFocused, children, action }: FieldShellProps) => (
  <motion.div
    animate={{
      y: isFocused ? -2 : 0,
      scale: isFocused ? 1.01 : 1,
    }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
    className="space-y-2"
  >
    <div className="flex items-center justify-between gap-3">
      <motion.label
        animate={{ y: isFocused ? -2 : 0, scale: isFocused ? 0.98 : 1 }}
        className="origin-left text-[13px] font-medium tracking-[0.01em] text-muted"
      >
        {label}
      </motion.label>
      {action}
    </div>
    {children}
    {error ? <p className="text-xs leading-5 text-danger">{error}</p> : null}
  </motion.div>
);

const RedirectFrameSection = ({ paymentStatus, redirectUrl, t }: RedirectFrameSectionProps) => (
  <AnimatePresence>
    {redirectUrl ? (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
      >
        <Card className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-bold text-ink">
                {t('checkout:iframe.title')}
              </p>
              <p className="text-sm leading-6 text-muted">
                {t('checkout:iframe.description')}
              </p>
            </div>
            <Badge status={paymentStatus ?? 'pending'}>
              {t(`common:statuses.${paymentStatus ?? 'pending'}`)}
            </Badge>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-line bg-surface shadow-soft">
            <iframe
              title={t('checkout:iframe.title')}
              src={redirectUrl}
              className="h-[560px] w-full"
            />
          </div>
        </Card>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

/**
 * Builds the complete Axipays checkout experience with validation, payment initiation,
 * redirect handling, live card preview, and animated status feedback.
 */
export const CheckoutPage = () => {
  const { t, i18n } = useTranslation(['checkout', 'common']);
  const { draft, setDraft, setAmount, setSelectedCurrency, resetCheckout } = useCheckoutStore();
  const { initiatePayment, isLoading, error, redirectUrl, paymentStatus, resetPaymentFlow } = usePayment();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const schema = createCheckoutSchema(t);

  usePageTitle(t('checkout:metaTitle'));

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cardHolderName: draft.cardHolderName ?? '',
      email: draft.email ?? '',
      cardNumber: '',
      expiryMonth: draft.expiryMonth ?? '',
      expiryYear: draft.expiryYear ?? '',
      cvv: '',
      amount: draft.amount ? String(draft.amount) : '',
      currency: draft.currency ?? 'USD',
      country: draft.country ?? '',
      address: draft.address ?? '',
      phone: draft.phone ?? '',
    },
    mode: 'onChange',
  });

  const cardNumberValue = watch('cardNumber');
  const { cardType, formattedValue, maskedDisplayValue, rawValue } = useCardFormatter(cardNumberValue ?? '');
  const cardHolderName = watch('cardHolderName');
  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');
  const cvv = watch('cvv');
  const amount = watch('amount');
  const currency = watch('currency');
  const country = watch('country');
  const address = watch('address');
  const email = watch('email');
  const phone = watch('phone');

  const isCardValid = rawValue.length >= 12 && validateLuhn(rawValue);
  const canShowCardState = rawValue.length >= 12;
  const heading = splitCheckoutHeading(t('checkout:title'));
  const currencyOptions: SelectOption[] = SUPPORTED_CURRENCIES.map((currencyOption) => ({
    value: currencyOption,
    label: currencyOption,
  }));
  const countryOptions: SelectOption[] = SUPPORTED_COUNTRIES.map((countryOption) => ({
    value: countryOption.value,
    label: t(countryOption.labelKey),
    leading: countryOption.flag,
  }));

  useEffect(() => {
    setDraft({
      cardHolderName,
      email,
      expiryMonth,
      expiryYear,
      amount: amount && !Number.isNaN(Number(amount)) ? Number(amount) : undefined,
      currency,
      country,
      address,
      phone,
    });
    setAmount(amount && !Number.isNaN(Number(amount)) ? Number(amount) : null);
    setSelectedCurrency(currency);
  }, [
    address,
    amount,
    cardHolderName,
    country,
    currency,
    email,
    expiryMonth,
    expiryYear,
    phone,
    setAmount,
    setDraft,
    setSelectedCurrency,
  ]);

  useEffect(() => {
    if (paymentStatus) {
      setShowStatusModal(true);
    }
  }, [paymentStatus]);

  /**
   * Tracks the currently focused field to drive motion styling and card flipping.
   */
  const focusField = useCallback((fieldName: string | null) => {
    setFocusedField(fieldName);
  }, []);

  /**
   * Keeps the expiry input and picker in sync while preserving validation behavior.
   */
  const updateExpiryValue = useCallback((nextMonth: string, nextYear: string) => {
    setValue('expiryMonth', nextMonth, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('expiryYear', nextYear, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue]);

  /**
   * Submits the validated checkout data to the payment API and clears sensitive state afterward.
   */
  const onSubmit = useCallback(async (values: CheckoutFormValues) => {
    const payload: CheckoutFormData = {
      ...values,
      amount: Number(values.amount),
      cardNumber: rawValue,
      cvv: values.cvv,
    };

    const response = await initiatePayment(payload);

    setValue('cvv', '', { shouldDirty: false, shouldValidate: false });

    if (response) {
      reset(EMPTY_CHECKOUT_VALUES, { keepErrors: false });
      resetCheckout();
    }
  }, [initiatePayment, rawValue, reset, resetCheckout, setValue]);

  const showInlineSubmitLoading = isLoading || isSubmitting;

  /**
   * Closes the payment status modal and clears the payment flow after success.
   */
  const handleStatusModalClose = useCallback(() => {
    setShowStatusModal(false);
    if (paymentStatus === 'success') {
      reset(EMPTY_CHECKOUT_VALUES, { keepErrors: false });
      resetCheckout();
      resetPaymentFlow();
    }
  }, [paymentStatus, reset, resetCheckout, resetPaymentFlow]);

  return (
    <>
      <section className="space-y-6">
        <div>
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_460px]">
              <div className="space-y-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300">
                    <ShieldCheck className="h-4 w-4" />
                    {t('checkout:eyebrow')}
                  </div>
                  <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-[3.1rem]">
                    <span>{heading.leading} </span>
                    <span className="text-brand-600">{heading.accent}</span>
                  </h1>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <FieldShell
                      label={t('checkout:form.cardHolderName.label')}
                      error={errors.cardHolderName?.message}
                      isFocused={focusedField === 'cardHolderName'}
                    >
                      <Input
                        {...register('cardHolderName')}
                        placeholder={t('checkout:form.cardHolderName.placeholder')}
                        onFocus={() => focusField('cardHolderName')}
                        onBlur={() => focusField(null)}
                        className="uppercase tracking-[0.02em]"
                      />
                    </FieldShell>

                    <FieldShell
                      label={t('checkout:form.email.label')}
                      error={errors.email?.message}
                      isFocused={focusedField === 'email'}
                    >
                      <Input
                        {...register('email')}
                        type="email"
                        autoComplete="email"
                        placeholder={t('checkout:form.email.placeholder')}
                        onFocus={() => focusField('email')}
                        onBlur={() => focusField(null)}
                      />
                    </FieldShell>
                  </div>

                  <div className="grid gap-6">
                    <Controller
                      control={control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FieldShell
                          label={t('checkout:form.cardNumber.label')}
                          error={errors.cardNumber?.message}
                          isFocused={focusedField === 'cardNumber'}
                          action={
                            canShowCardState ? (
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span
                                  className={cn(
                                    'h-2.5 w-2.5 rounded-full',
                                    isCardValid ? 'bg-success' : 'bg-danger',
                                  )}
                                />
                                <span className={isCardValid ? 'text-success' : 'text-danger'}>
                                  {isCardValid
                                    ? t('checkout:form.cardNumber.valid')
                                    : t('checkout:form.cardNumber.invalid')}
                                </span>
                              </div>
                            ) : null
                          }
                        >
                          <div className="relative">
                            <Input
                              ref={field.ref}
                              name={field.name}
                              value={formattedValue}
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder={t('checkout:form.cardNumber.placeholder')}
                              onFocus={() => focusField('cardNumber')}
                              onBlur={() => {
                                field.onBlur();
                                focusField(null);
                                void trigger('cardNumber');
                              }}
                              onChange={(event) => field.onChange(event.target.value.replace(/\D/g, '').slice(0, 19))}
                              className="pr-24 font-mono text-sm tracking-[0.14em] text-transparent caret-ink selection:bg-brand-100 selection:text-transparent"
                            />
                            {maskedDisplayValue ? (
                              <div className="pointer-events-none absolute inset-y-0 left-4 right-24 flex items-center overflow-hidden">
                                <span className="truncate font-mono text-sm tracking-[0.14em] text-ink">
                                  {maskedDisplayValue}
                                </span>
                              </div>
                            ) : null}
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                              <CardTypeLogo cardType={cardType} />
                            </div>
                          </div>
                        </FieldShell>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_108px]">
                      <FieldShell
                        label={t('checkout:preview.expiry')}
                        error={errors.expiryMonth?.message ?? errors.expiryYear?.message}
                        isFocused={focusedField === 'expiryDate'}
                      >
                        <input type="hidden" {...register('expiryMonth')} />
                        <input type="hidden" {...register('expiryYear')} />
                        <ExpiryDateFields
                          month={expiryMonth}
                          year={expiryYear}
                          locale={i18n.language}
                          monthPlaceholder={t('checkout:form.expiryMonth.placeholder')}
                          yearPlaceholder={t('checkout:form.expiryYear.placeholder')}
                          monthError={Boolean(errors.expiryMonth)}
                          yearError={Boolean(errors.expiryYear)}
                          onFocus={() => focusField('expiryDate')}
                          onBlur={() => {
                            focusField(null);
                            void trigger(['expiryMonth', 'expiryYear']);
                          }}
                          onChange={updateExpiryValue}
                          className="font-mono text-sm tracking-[0.12em]"
                        />
                      </FieldShell>

                      <FieldShell
                        label={t('checkout:form.cvv.label')}
                        error={errors.cvv?.message}
                        isFocused={focusedField === 'cvv'}
                      >
                        <Input
                          {...register('cvv')}
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder={t('checkout:form.cvv.placeholder')}
                          maxLength={4}
                          onFocus={() => focusField('cvv')}
                          onBlur={() => focusField(null)}
                          onChange={(event) => {
                            const nextValue = event.target.value.replace(/\D/g, '').slice(0, 4);
                            setValue('cvv', nextValue, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="text-center font-mono text-sm tracking-[0.35em]"
                        />
                      </FieldShell>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FieldShell
                      label={t('checkout:form.amount.label')}
                      error={errors.amount?.message}
                      isFocused={focusedField === 'amount'}
                    >
                      <Input
                        {...register('amount')}
                        inputMode="decimal"
                        placeholder={t('checkout:form.amount.placeholder')}
                        onFocus={() => focusField('amount')}
                        onBlur={() => focusField(null)}
                      />
                    </FieldShell>

                    <Controller
                      control={control}
                      name="currency"
                      render={({ field }) => (
                        <FieldShell
                          label={t('checkout:form.currency.label')}
                          error={errors.currency?.message}
                          isFocused={focusedField === 'currency'}
                        >
                          <Dropdown
                            placeholder={t('checkout:form.currency.label')}
                            options={currencyOptions}
                            value={field.value}
                            error={Boolean(errors.currency?.message)}
                            onChange={field.onChange}
                            onFocus={() => focusField('currency')}
                            onBlur={() => focusField(null)}
                          />
                        </FieldShell>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <FieldShell
                          label={t('checkout:form.country.label')}
                          error={errors.country?.message}
                          isFocused={focusedField === 'country'}
                        >
                          <Dropdown
                            placeholder={t('checkout:form.country.placeholder')}
                            searchPlaceholder={t('checkout:form.country.searchPlaceholder')}
                            emptyLabel={t('checkout:form.country.empty')}
                            options={countryOptions}
                            value={field.value}
                            error={Boolean(errors.country?.message)}
                            searchable
                            onChange={field.onChange}
                            onFocus={() => focusField('country')}
                            onBlur={() => focusField(null)}
                          />
                        </FieldShell>
                      )}
                    />

                    <FieldShell
                      label={t('checkout:form.phone.label')}
                      error={errors.phone?.message}
                      isFocused={focusedField === 'phone'}
                    >
                      <Input
                        {...register('phone')}
                        inputMode="tel"
                        placeholder={t('checkout:form.phone.placeholder')}
                        onFocus={() => focusField('phone')}
                        onBlur={() => focusField(null)}
                      />
                    </FieldShell>
                  </div>

                  <FieldShell
                    label={t('checkout:form.address.label')}
                    error={errors.address?.message}
                    isFocused={focusedField === 'address'}
                  >
                    <Textarea
                      {...register('address')}
                      rows={4}
                      placeholder={t('checkout:form.address.placeholder')}
                      onFocus={() => focusField('address')}
                      onBlur={() => focusField(null)}
                    />
                  </FieldShell>

                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-red-50 px-4 py-3 text-xs text-danger dark:bg-red-900/10"
                    >
                      {error}
                    </motion.div>
                  ) : null}

                  <motion.div whileTap={{ scale: 0.99 }} whileHover={{ y: -1 }}>
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={showInlineSubmitLoading}
                      loadingText={t('checkout:actions.processing')}
                      className="h-14 w-full rounded-xl text-white"
                    >
                      {t('checkout:actions.submit')}
                    </Button>
                  </motion.div>
                </form>
              </div>

              <CheckoutStatusSidebar
                cardHolderName={cardHolderName}
                cardNumber={rawValue}
                cardType={cardType}
                cvv={cvv}
                expiryMonth={expiryMonth}
                expiryYear={expiryYear}
                focusedField={focusedField}
                paymentStatus={paymentStatus}
                t={t}
              />
            </div>
          </div>

        <RedirectFrameSection paymentStatus={paymentStatus} redirectUrl={redirectUrl} t={t} />
      </section>

      <Modal
        open={showStatusModal && Boolean(paymentStatus)}
        title={paymentStatus ? t(`checkout:statusModal.${paymentStatus}.title`) : ''}
        description={paymentStatus ? t(`checkout:statusModal.${paymentStatus}.description`) : ''}
        onClose={handleStatusModalClose}
      >
        {paymentStatus ? <StatusModalContent status={paymentStatus} t={t} /> : null}
      </Modal>
    </>
  );
};
