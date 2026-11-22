import React, { useEffect, useState } from 'react';
import { AlertTriangle, Banknote, X } from 'lucide-react';
import { WithdrawalRequest } from '../../types';
import { api } from '../../services/api';

interface RoyaltySummary {
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  availableAmount: number;
}

interface Props {
  isOpen: boolean;
  summary: RoyaltySummary;
  onClose: () => void;
  onSubmitted: (summary: RoyaltySummary, withdrawal: WithdrawalRequest) => void;
}

export const RoyaltyWithdrawalModal: React.FC<Props> = ({ isOpen, summary, onClose, onSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [accountType, setAccountType] = useState<WithdrawalRequest['accountType']>('Cheque');
  const [paymentReference, setPaymentReference] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setAmount(summary.availableAmount > 0 ? summary.availableAmount.toFixed(2) : '0.00');
    setError('');
    setAcknowledged(false);
  }, [isOpen, summary.availableAmount]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError('Enter a valid withdrawal amount.');
    if (numericAmount > summary.availableAmount) return setError(`You can withdraw up to R${summary.availableAmount.toFixed(2)}.`);
    if (!acknowledged) return setError('Please confirm that your banking details are correct.');

    try {
      setSaving(true);
      const result = await api.requestRoyaltyWithdrawal({
        amount: numericAmount,
        bankName,
        accountHolder,
        accountNumber,
        branchCode,
        accountType,
        paymentReference,
        whatsappNumber,
        notes,
        liabilityAcknowledged: true,
      });
      onSubmitted(result.summary, result.withdrawal);
      alert('Withdrawal request submitted successfully. SlacWave MG will process the payment using the banking details you provided.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not submit the withdrawal request.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold"><Banknote className="w-5 h-5 text-emerald-400" /> Request Royalty Withdrawal</div>
            <p className="text-[11px] text-neutral-500 mt-1">Available to withdraw: <strong className="text-emerald-400">R{summary.availableAmount.toFixed(2)}</strong></p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800"><span className="block text-[10px] text-neutral-500 uppercase">Total earnings</span><strong className="text-white">R{summary.totalEarnings.toFixed(2)}</strong></div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800"><span className="block text-[10px] text-neutral-500 uppercase">Pending</span><strong className="text-amber-400">R{summary.pendingAmount.toFixed(2)}</strong></div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800"><span className="block text-[10px] text-neutral-500 uppercase">Paid</span><strong className="text-blue-400">R{summary.paidAmount.toFixed(2)}</strong></div>
          </div>

          <label className="block space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Withdrawal Amount (ZAR) *</span><input required type="number" min="0.01" max={summary.availableAmount} step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="field" /></label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Bank Name *</span><input required value={bankName} onChange={e => setBankName(e.target.value)} className="field" placeholder="e.g. Capitec" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Account Holder *</span><input required value={accountHolder} onChange={e => setAccountHolder(e.target.value)} className="field" placeholder="Name as registered with bank" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Account Number *</span><input required inputMode="numeric" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))} className="field" placeholder="Account number" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Branch Code *</span><input required inputMode="numeric" value={branchCode} onChange={e => setBranchCode(e.target.value.replace(/\D/g, ''))} className="field" placeholder="Branch code" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Payment Reference (Artist Name) *</span><input required value={paymentReference} onChange={e => setPaymentReference(e.target.value)} className="field" placeholder="Your artist name" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-neutral-300">WhatsApp Number for Payment Proof *</span><input required type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="field" placeholder="+27..." /></label>
            <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-semibold text-neutral-300">Account Type *</span><select value={accountType} onChange={e => setAccountType(e.target.value as WithdrawalRequest['accountType'])} className="field"><option>Cheque</option><option>Savings</option><option>Transmission</option><option>Other</option></select></label>
          </div>

          <p className="text-[11px] text-neutral-500">Do not enter card numbers, CVV, PINs, one-time passwords or online banking passwords. SlacWave MG pays by bank transfer/EFT; your account number and branch code are sufficient.</p>
          <label className="block space-y-1.5"><span className="text-xs font-semibold text-neutral-300">Additional Payment Notes (optional)</span><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="field resize-y" placeholder="Anything SlacWave MG should know about this payment..." /></label>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/70 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-2 text-[11px] leading-relaxed text-emerald-200">
              <p><strong>Important:</strong> Please check your banking details carefully before submitting.</p>
              <p>Neither SlacWave MG nor Mid Ama Distribution will be liable for funds lost or misdirected because the client supplied incorrect or incomplete banking details, to the extent permitted by applicable law.</p>
              <label className="flex items-start gap-2 text-neutral-200 cursor-pointer"><input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} className="mt-0.5 accent-emerald-600" /> <span>I confirm that the banking details above are correct and I accept the responsibility for providing accurate payment information.</span></label>
            </div>
          </div>

          {error && <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300">{error}</div>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={saving} className="flex-1 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold hover:text-white">Cancel</button>
            <button type="submit" disabled={saving || summary.availableAmount <= 0} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold">{saving ? 'Submitting...' : 'Submit Withdrawal Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
