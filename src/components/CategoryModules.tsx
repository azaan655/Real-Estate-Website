import React, { useState } from 'react';
import { Check, Sparkles, UserCheck } from 'lucide-react';
import { Module, BuyPageTheme } from '../data/buyPages';
import { Property, formatPrice, pricePerUnit } from '../data/properties';
import { RUPEE, formatInr } from '../lib/money';

interface CategoryModulesProps {
  modules: Module[];
  theme: BuyPageTheme;
  topProperties: Property[];
  onEnquireClick?: () => void;
}

export const CategoryModules: React.FC<CategoryModulesProps> = ({
  modules,
  theme,
  topProperties,
  onEnquireClick,
}) => {
  return (
    <div className="w-full space-y-16 mt-20">
      {modules.map((mod, index) => (
        <section
          key={index}
          className="category-module rounded-3xl p-6 sm:p-10 md:p-12 border transition-all duration-300"
          style={{
            backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          }}
        >
          {/* Module Title */}
          <h2
            className="text-[clamp(1.85rem,4vw,2.5rem)] leading-tight mb-3"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", serif)',
              color: theme.mode === 'dark' ? '#FFFFFF' : '#0C0C0C',
            }}
          >
            {mod.title}
          </h2>

          {'intro' in mod && mod.intro && (
            <p className="font-sans text-sm opacity-70 max-w-2xl mb-8">
              {mod.intro}
            </p>
          )}

          {/* Module Content Switch */}
          {mod.kind === 'timeline' && (
            <div className="relative pl-6 sm:pl-8 border-l border-white/20 mt-8 space-y-8">
              {mod.steps.map((step, sIdx) => (
                <div key={sIdx} className="relative group">
                  <div
                    className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-sans text-xs font-semibold bg-black transition-colors"
                    style={{
                      borderColor: theme.accent,
                      color: theme.accent,
                    }}
                  >
                    {sIdx + 1}
                  </div>
                  <h3
                    className="text-lg font-serif mb-1"
                    style={{ color: theme.mode === 'dark' ? '#FFFFFF' : '#0C0C0C' }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm opacity-75 max-w-xl">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {mod.kind === 'checklist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {mod.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/5"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${theme.accent}25`, color: theme.accent }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="font-sans text-sm opacity-90 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mod.kind === 'factGrid' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {mod.facts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between"
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mb-3">
                    {fact.label}
                  </span>
                  <span
                    className="text-3xl sm:text-4xl leading-none"
                    style={{
                      fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                      color: theme.mode === 'dark' ? theme.accentInk : theme.accent,
                    }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mod.kind === 'table' && (
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/15">
                    {mod.head.map((h, idx) => (
                      <th key={idx} className="pb-3 text-xs uppercase tracking-wider opacity-60 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {mod.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-4 pr-4 opacity-90">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {mod.note && (
                <p className="font-sans text-xs opacity-50 mt-4 italic">
                  * {mod.note}
                </p>
              )}
            </div>
          )}

          {mod.kind === 'personas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {mod.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                    >
                      <UserCheck size={18} />
                    </div>
                    <h3 className="font-serif text-xl mb-2">
                      {card.title}
                    </h3>
                    <p className="font-sans text-sm opacity-75 leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mod.kind === 'emi' && (
            <EmiEstimator presetPriceCr={mod.presetPriceCr} theme={theme} />
          )}

          {mod.kind === 'yield' && (
            <YieldEstimator theme={theme} />
          )}

          {mod.kind === 'plotTools' && (
            <PlotTools theme={theme} />
          )}

          {mod.kind === 'compare' && (
            <CompareTable properties={topProperties.slice(0, 3)} theme={theme} />
          )}

          {mod.kind === 'concierge' && (
            <div
              className="p-8 sm:p-10 rounded-2xl mt-6 border border-white/15 bg-black/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="max-w-xl space-y-3">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
                  Discreet & Verified
                </span>
                <div className="space-y-2 mt-2">
                  {mod.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 font-sans text-sm opacity-85">
                      <Sparkles size={14} className="text-[#D4AF6A] flex-shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onEnquireClick}
                className="px-6 py-3.5 rounded-full border border-[#D4AF6A] text-white hover:bg-[#D4AF6A] hover:text-black font-sans text-xs uppercase tracking-wider font-medium transition-all duration-300 flex-shrink-0 cursor-pointer shadow-lg"
              >
                {mod.ctaLabel}
              </button>
            </div>
          )}

          {mod.kind === 'rentBudget' && (
            <RentBudgetEstimator presetRent={mod.presetRent} theme={theme} />
          )}

          {mod.kind === 'seatCalc' && (
            <SeatCalcEstimator theme={theme} />
          )}
        </section>
      ))}
    </div>
  );
};

// =========================================================================
// SUB-MODULE: EMI CALCULATOR
// =========================================================================
const EmiEstimator: React.FC<{ presetPriceCr: number; theme: BuyPageTheme }> = ({
  presetPriceCr,
  theme,
}) => {
  const [priceCr, setPriceCr] = useState(presetPriceCr);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [ratePct, setRatePct] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const priceVal = priceCr * 1e7;
  const downPayment = (priceVal * downPaymentPct) / 100;
  const loanAmount = priceVal - downPayment;
  const monthlyRate = ratePct / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

  const totalInterest = emi * totalMonths - loanAmount;
  const stampDutyReg = priceVal * 0.06; // 6% registration & stamp duty standard estimate

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      {/* Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between text-xs font-sans mb-1 opacity-80">
            <span>Property Value</span>
            <span className="font-medium text-white">{formatPrice(priceCr)}</span>
          </div>
          <input
            type="range"
            min={0.3}
            max={20}
            step={0.1}
            value={priceCr}
            onChange={(e) => setPriceCr(parseFloat(e.target.value))}
            className="w-full accent-[#D4AF6A] h-1.5 bg-white/20 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-sans mb-1 opacity-80">
            <span>Down Payment: {downPaymentPct}%</span>
            <span className="font-medium text-white">\u20B9{Math.round(downPayment).toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(parseInt(e.target.value))}
            className="w-full accent-[#D4AF6A] h-1.5 bg-white/20 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans opacity-70 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step={0.1}
              value={ratePct}
              onChange={(e) => setRatePct(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans opacity-70 mb-1">Tenure (Years)</label>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)}
              className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
            />
          </div>
        </div>
      </div>

      {/* Results Card (5 cols) */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
        <div>
          <span className="font-sans text-xs uppercase tracking-wider opacity-60">
            Monthly EMI Estimate
          </span>
          <div
            className="text-4xl font-serif mt-1 mb-6"
            style={{ color: theme.accent }}
          >
            \u20B9{Math.round(emi).toLocaleString('en-IN')}
            <span className="text-xs font-sans text-white/50 ml-1">/ month</span>
          </div>

          <div className="space-y-2.5 font-sans text-xs divide-y divide-white/10">
            <div className="flex justify-between pt-1 opacity-80">
              <span>Loan Amount</span>
              <span className="font-medium text-white">\u20B9{Math.round(loanAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 opacity-80">
              <span>Total Interest</span>
              <span className="font-medium text-white">\u20B9{Math.round(totalInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 opacity-80">
              <span>Estimated Stamp Duty & Reg (6%)</span>
              <span className="font-medium text-white">\u20B9{Math.round(stampDutyReg).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <p className="font-sans text-[11px] opacity-40 mt-6 italic">
          * Indicative calculation only. Rates and eligibility depend on lender criteria.
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MODULE: GROSS YIELD CALCULATOR
// =========================================================================
const YieldEstimator: React.FC<{ theme: BuyPageTheme }> = ({ theme }) => {
  const [price, setPrice] = useState(9500000);
  const [monthlyRent, setMonthlyRent] = useState(65000);

  const annualRent = monthlyRent * 12;
  const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
  const paybackYears = annualRent > 0 ? price / annualRent : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-sans opacity-70 mb-1">Asset Acquisition Price (\u20B9)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full h-11 px-4 bg-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
          />
        </div>
        <div>
          <label className="block text-xs font-sans opacity-70 mb-1">Estimated Monthly Rental (\u20B9)</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
            className="w-full h-11 px-4 bg-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center gap-4">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-sans uppercase tracking-wider opacity-60">Gross Rental Yield</span>
          <span className="text-3xl font-serif" style={{ color: theme.accent }}>
            {grossYield.toFixed(2)}% p.a.
          </span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF6A] transition-all duration-500"
            style={{ width: `${Math.min(grossYield * 10, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-sans opacity-80 pt-2 border-t border-white/10">
          <span>Capital Payback Period</span>
          <span className="font-medium text-white">{paybackYears.toFixed(1)} Years</span>
        </div>
        <span className="text-[10px] font-sans opacity-40 italic">
          * Indicative only. Excludes vacancy risk and maintenance reserves.
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MODULE: PLOT TOOLS (CONVERTER & TOTAL COST)
// =========================================================================
const PlotTools: React.FC<{ theme: BuyPageTheme }> = () => {
  const [sqYd, setSqYd] = useState(267);
  const [ratePerSqYd, setRatePerSqYd] = useState(14232);

  const sqFt = sqYd * 9;
  const totalCost = sqYd * ratePerSqYd;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="font-serif text-lg mb-2">Area Dimension Conversion</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans opacity-70 mb-1">Square Yards (sq yd)</label>
            <input
              type="number"
              value={sqYd}
              onChange={(e) => setSqYd(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
            />
          </div>
          <div>
            <label className="block text-xs font-sans opacity-70 mb-1">Square Feet (sq ft)</label>
            <input
              type="number"
              value={sqFt}
              readOnly
              className="w-full h-10 px-3 bg-white/5 rounded-lg text-sm font-sans text-white/70 border border-white/5"
            />
          </div>
        </div>
        <p className="text-xs font-sans opacity-50 pt-1">
          Rule of thumb: 1 Square Yard = 9 Square Feet.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg mb-4">Total Cost Calculation</h3>
          <div className="mb-4">
            <label className="block text-xs font-sans opacity-70 mb-1">Rate per Sq Yd (\u20B9)</label>
            <input
              type="number"
              value={ratePerSqYd}
              onChange={(e) => setRatePerSqYd(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-xs font-sans opacity-70">Estimated Cost:</span>
          <span className="text-2xl font-serif text-[#D4AF6A]">
            \u20B9{Math.round(totalCost).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MODULE: 3-COLUMN COMPARE TABLE
// =========================================================================
const CompareTable: React.FC<{ properties: Property[]; theme: BuyPageTheme }> = ({
  properties,
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-left font-sans text-sm border-collapse min-w-[550px]">
        <thead>
          <tr className="border-b border-white/15">
            <th className="pb-3 w-1/4 text-xs uppercase tracking-wider opacity-60">Parameter</th>
            {properties.map((p) => (
              <th key={p.id} className="pb-3 text-sm font-serif font-normal text-white">
                {p.name.replace('\n', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Price</td>
            {properties.map((p, idx) => (
              <td key={p.id} className="py-3 font-serif text-lg text-[#D4AF6A]">
                <div className="flex items-center gap-1.5">
                  {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]" />}
                  <span>{formatPrice(p.priceCr)}</span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Total Area</td>
            {properties.map((p) => (
              <td key={p.id} className="py-3 opacity-90">
                {p.area.toLocaleString('en-IN')} {p.areaUnit}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Unit Price</td>
            {properties.map((p) => (
              <td key={p.id} className="py-3 opacity-90">
                {pricePerUnit(p)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Status</td>
            {properties.map((p) => (
              <td key={p.id} className="py-3 capitalize opacity-90">
                {p.status.replace('-', ' ')}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Facing</td>
            {properties.map((p) => (
              <td key={p.id} className="py-3 opacity-90">
                {p.facing}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 text-xs uppercase tracking-wider opacity-60">Possession</td>
            {properties.map((p) => (
              <td key={p.id} className="py-3 opacity-90">
                {p.possession}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// =========================================================================
// SUB-MODULE: RENT & MOVE-IN COST ESTIMATOR
// =========================================================================
const RentBudgetEstimator: React.FC<{ presetRent: number; theme: BuyPageTheme }> = ({
  presetRent,
  theme,
}) => {
  const [rent, setRent] = useState(presetRent || 25000);
  const [depositMonths, setDepositMonths] = useState(3);
  const [maintenance, setMaintenance] = useState(0);
  const [brokerageMonths, setBrokerageMonths] = useState(0);

  const securityDeposit = rent * depositMonths;
  const brokerageAmount = rent * brokerageMonths;
  const totalMoveInCost = rent + securityDeposit + brokerageAmount;
  const yearlyCost = rent * 12 + maintenance * 12;
  const comfortableMonthlyIncome = Math.round(rent / 0.3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Monthly Rent
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {RUPEE}{formatInr(rent)}
            </span>
          </div>
          <input
            type="range"
            min={3000}
            max={200000}
            step={500}
            value={rent}
            onChange={(e) => setRent(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>{RUPEE}3,000</span>
            <span>{RUPEE}2,00,000</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Security Deposit (Months)
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {depositMonths} {depositMonths === 1 ? 'Month' : 'Months'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={depositMonths}
            onChange={(e) => setDepositMonths(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>1 Month</span>
            <span>12 Months</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Monthly Maintenance
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {maintenance === 0 ? 'Included' : `${RUPEE}${formatInr(maintenance)}`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={maintenance}
            onChange={(e) => setMaintenance(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>{RUPEE}0 (Included)</span>
            <span>{RUPEE}15,000</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Brokerage Fee (Months)
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {brokerageMonths === 0 ? '0 (Direct / Free)' : `${brokerageMonths} Month`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.5}
            value={brokerageMonths}
            onChange={(e) => setBrokerageMonths(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>0</span>
            <span>0.5</span>
            <span>1.0</span>
          </div>
        </div>
      </div>

      {/* Outputs */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6">
        <div>
          <span className="text-xs font-sans uppercase tracking-[0.2em] opacity-60 block mb-1">
            Estimated Signing Total
          </span>
          <div className="font-serif text-3xl sm:text-4xl" style={{ color: theme.accent }}>
            {RUPEE}{formatInr(totalMoveInCost)}
          </div>
          <span className="text-xs font-sans opacity-60 block mt-1">
            Includes first month rent, deposit ({depositMonths} mo) &amp; brokerage
          </span>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10 text-sm font-sans">
          <div className="flex justify-between items-center">
            <span className="opacity-70">Security Deposit:</span>
            <span className="font-medium text-white">{RUPEE}{formatInr(securityDeposit)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Total Yearly Commitment:</span>
            <span className="font-medium text-white">{RUPEE}{formatInr(yearlyCost)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Recommended Monthly Income:</span>
            <span className="font-medium text-white">{RUPEE}{formatInr(comfortableMonthlyIncome)}</span>
          </div>
        </div>

        <p className="text-[11px] font-sans opacity-45 italic pt-2 border-t border-white/10">
          Indicative only. Deposit, brokerage and maintenance vary by landlord.
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-MODULE: OFFICE SPACE & SEAT ESTIMATOR
// =========================================================================
const SeatCalcEstimator: React.FC<{ theme: BuyPageTheme }> = ({ theme }) => {
  const [teamSize, setTeamSize] = useState(8);
  const [spacePerSeat, setSpacePerSeat] = useState(90);
  const [rentPerSqFt, setRentPerSqFt] = useState(63);

  const spaceNeeded = teamSize * spacePerSeat;
  const estimatedMonthlyRent = spaceNeeded * rentPerSqFt;
  const costPerSeat = teamSize > 0 ? Math.round(estimatedMonthlyRent / teamSize) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Team Size (Headcount)
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {teamSize} Desks
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>1 seat</span>
            <span>100 seats</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Space Density per Seat
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {spacePerSeat} sq ft
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={150}
            step={5}
            value={spacePerSeat}
            onChange={(e) => setSpacePerSeat(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>60 sq ft (Dense)</span>
            <span>90 sq ft (Standard)</span>
            <span>150 sq ft (Executive)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-sans uppercase tracking-wider opacity-70">
              Base Rent per Sq Ft / Month
            </label>
            <span className="font-serif text-xl" style={{ color: theme.accent }}>
              {RUPEE}{rentPerSqFt}
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={200}
            step={1}
            value={rentPerSqFt}
            onChange={(e) => setRentPerSqFt(Number(e.target.value))}
            className="w-full accent-[#D4AF6A] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] opacity-40 font-sans mt-1">
            <span>{RUPEE}30 (Suburbs)</span>
            <span>{RUPEE}63 (Kondapur / Madhapur)</span>
            <span>{RUPEE}200 (Grade A Prime)</span>
          </div>
        </div>
      </div>

      {/* Outputs */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6">
        <div>
          <span className="text-xs font-sans uppercase tracking-[0.2em] opacity-60 block mb-1">
            Estimated Monthly Rent
          </span>
          <div className="font-serif text-3xl sm:text-4xl" style={{ color: theme.accent }}>
            {RUPEE}{formatInr(estimatedMonthlyRent)}
          </div>
          <span className="text-xs font-sans opacity-60 block mt-1">
            Monthly commercial commitment for {teamSize} desks
          </span>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10 text-sm font-sans">
          <div className="flex justify-between items-center">
            <span className="opacity-70">Total Usable Carpet Area:</span>
            <span className="font-medium text-white">{formatInr(spaceNeeded)} sq ft</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Estimated Cost per Seat:</span>
            <span className="font-medium text-white">{RUPEE}{formatInr(costPerSeat)} / mo</span>
          </div>
        </div>

        <p className="text-[11px] font-sans opacity-45 italic pt-2 border-t border-white/10">
          Indicative only.
        </p>
      </div>
    </div>
  );
};

export default CategoryModules;

