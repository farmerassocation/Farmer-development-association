'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCodeComponent({ value, size = 100 }: QRCodeProps) {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: '#022c22', // Deep emerald-950
          light: '#ffffff', // White
        },
      },
      (err, url) => {
        if (err) {
          console.error('QR code generation error:', err);
          return;
        }
        setQrSrc(url);
      }
    );
  }, [value, size]);

  if (!qrSrc) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-emerald-50/50 animate-pulse rounded border border-emerald-900/10 flex items-center justify-center"
      >
        <span className="text-[9px] text-emerald-700/60 font-semibold uppercase tracking-wider">QR Code</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={qrSrc}
      alt="Verification QR Code"
      width={size}
      height={size}
      className="rounded border border-emerald-950/20 shadow-sm"
    />
  );
}
