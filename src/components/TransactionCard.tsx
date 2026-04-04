import type { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
  return (
    <div>
      {/* Transaction display */}
      <p>{transaction.description}</p>
    </div>
  );
}
