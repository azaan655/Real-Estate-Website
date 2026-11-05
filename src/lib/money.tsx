import React from 'react';

export const RUPEE = '\u20B9';
export const DOT = '\u00B7';

export const formatInr = (n: number): string => {
  return n.toLocaleString('en-IN');
};

export const formatRupees = (n: number): string => {
  return RUPEE + n.toLocaleString('en-IN');
};

export interface MoneyProps {
  amount: number;
  className?: string;
  suffix?: string;
  rupeeClassName?: string;
}

export const Money: React.FC<MoneyProps> = ({
  amount,
  className = '',
  suffix = '',
  rupeeClassName = 'rupee',
}) => {
  return (
    <span className={className}>
      <span className={rupeeClassName}>{'\u20B9'}</span>
      {formatInr(amount)}
      {suffix}
    </span>
  );
};

export default Money;

