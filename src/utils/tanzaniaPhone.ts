export interface PhoneValidationResult {
  isValid: boolean;
  formattedE164: string;
  formattedDisplay: string;
  carrier: 'Vodacom' | 'Tigo' | 'Airtel' | 'Halotel' | 'TTCL' | 'Unknown';
  errorSw?: string;
  errorEn?: string;
}

/**
 * Validates and standardizes Tanzanian phone numbers (+255).
 * Valid carriers and prefixes:
 * - Vodacom: 074, 075, 076
 * - Tigo (Yas): 071, 065, 067
 * - Airtel: 078, 068, 069
 * - Halotel: 062, 061
 * - TTCL: 073
 */
export function validateTanzanianPhone(input: string): PhoneValidationResult {
  const cleaned = input.trim().replace(/[\s-()]/g, '');

  let nationalNumber = '';

  if (cleaned.startsWith('+255')) {
    nationalNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('255')) {
    nationalNumber = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    nationalNumber = cleaned.slice(1);
  } else {
    nationalNumber = cleaned;
  }

  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(nationalNumber)) {
    return {
      isValid: false,
      formattedE164: '',
      formattedDisplay: input,
      carrier: 'Unknown',
      errorSw: 'Nambari ya simu lazima iwe na tarakimu 9 za Tanzania (mfano: 0712 345 678 au +255 712 345 678).',
      errorEn: 'Phone number must have 9 Tanzanian digits (e.g., 0712 345 678 or +255 712 345 678).',
    };
  }

  // Determine Tanzanian Carrier by prefix (2 digits)
  const prefix2 = nationalNumber.slice(0, 2);
  let carrier: PhoneValidationResult['carrier'] = 'Unknown';

  if (['74', '75', '76'].includes(prefix2)) {
    carrier = 'Vodacom';
  } else if (['71', '65', '67'].includes(prefix2)) {
    carrier = 'Tigo';
  } else if (['78', '68', '69'].includes(prefix2)) {
    carrier = 'Airtel';
  } else if (['62', '61'].includes(prefix2)) {
    carrier = 'Halotel';
  } else if (prefix2 === '73') {
    carrier = 'TTCL';
  } else {
    return {
      isValid: false,
      formattedE164: '',
      formattedDisplay: input,
      carrier: 'Unknown',
      errorSw: `Kiambishi awali "0${prefix2}" sio mtandao unaotambuliwa Tanzania (Vodacom, Tigo, Airtel, Halotel).`,
      errorEn: `Prefix "0${prefix2}" is not a recognized Tanzanian carrier (Vodacom, Tigo, Airtel, Halotel).`,
    };
  }

  const formattedE164 = `+255${nationalNumber}`;
  const formattedDisplay = `+255 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;

  return {
    isValid: true,
    formattedE164,
    formattedDisplay,
    carrier,
  };
}
