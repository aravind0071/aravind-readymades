interface ProductEnquiryParams {
  productName: string;
  productCode: string;
  price: number;
  selectedSize?: string;
  selectedColour?: string;
  whatsappNumber?: string;
}

export function generateProductWhatsAppLink({
  productName,
  productCode,
  price,
  selectedSize,
  selectedColour,
  whatsappNumber = '9959257373',
}: ProductEnquiryParams): string {
  // Strip non-digits from phone number
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;

  const lines = [
    'Hello, I am interested in this product from Aravind Readymades.',
    '',
    `Product:\n${productName}`,
    '',
    `Product Code:\n${productCode}`,
    '',
    `Price:\n₹${price.toLocaleString('en-IN')}`,
  ];

  if (selectedSize) {
    lines.push('', `Size:\n${selectedSize}`);
  }

  if (selectedColour) {
    lines.push('', `Colour:\n${selectedColour}`);
  }

  lines.push('', 'Is this product currently available?');

  const message = lines.join('\n');
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralWhatsAppLink(
  whatsappNumber = '9959257373',
  customMessage = 'Hello Aravind Readymades, I would like to enquire about your latest clothing collections.'
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(customMessage)}`;
}
