import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomMultiSelect } from '../ui/CustomMultiSelect';
import { SingleDatePicker } from '../ui/SingleDatePicker';
import { MobileDateRangePicker } from './MobileDateRangePicker';

export interface MobileInvoiceLineItem {
  id: string;
  item: string;
  service: string;
  quantity: number;
  unitCost: number;
  vatPercent: number;
  isCustom?: boolean;
}

interface MobileGenerateInvoiceViewProps {
  onBack: () => void;
  onGenerateSuccess?: (invoiceData: {
    invoiceNumber: string;
    client: string;
    location: string;
    billCycle: string;
    amount: number;
    itemCount: number;
    dueDate: string;
    activities: string[];
  }) => void;
}

const initialLineItems: MobileInvoiceLineItem[] = [
  { id: '1', item: 'Pint', service: 'Washed Cup', quantity: 1250, unitCost: 0.15, vatPercent: 20 },
  { id: '2', item: 'Half Pint', service: 'Washed Cup', quantity: 550, unitCost: 0.15, vatPercent: 20 },
  { id: '3', item: 'Pint', service: 'Damaged', quantity: 25, unitCost: 1.50, vatPercent: 20 },
  { id: '4', item: 'Half Pint', service: 'Damaged', quantity: 75, unitCost: 1.50, vatPercent: 20 },
  { id: '5', item: 'Delivery/Collec', service: 'Wheely Bins', quantity: 8, unitCost: 25.00, vatPercent: 20 },
];

const availableServices = [
  'Washed Cup',
  'Lost Cup',
  'Damaged',
  'Tote Lost',
  'Wheely Bins',
  'DRS Bins',
];

const clientOptions = [
  'Derby County Football Club',
  'Derby LIVE',
  'Electric Daisy',
];

const locationOptions = [
  'Pride Park Stadium',
  'Derby Arena',
  'Electric Daisy',
  'Moorways Sports Village',
  'Rolls-Royce Leisure',
  'Derby Theatre',
];

const monthOptions = [
  { value: 'September 2026 (Current)', label: 'September 2026 (Current)' },
  { value: 'August 2026', label: 'August 2026' },
  { value: 'July 2026', label: 'July 2026' },
  { value: 'June 2026', label: 'June 2026' },
  { value: 'May 2026', label: 'May 2026' },
  { value: 'April 2026', label: 'April 2026' },
];

export const MobileGenerateInvoiceView: React.FC<MobileGenerateInvoiceViewProps> = ({
  onBack,
  onGenerateSuccess,
}) => {
  // Criteria State
  const [client, setClient] = useState('Derby County Football Club');
  const [locations, setLocations] = useState<string[]>(['Pride Park Stadium', 'Derby Arena']);
  const [billCycleV1, setBillCycleV1] = useState('September 2026 (Current)');
  const [billCycleV2, setBillCycleV2] = useState('01/09/2026 - 30/09/2026');
  const [selectedServices, setSelectedServices] = useState<string[]>(availableServices);
  const [lastUpdatedText, setLastUpdatedText] = useState('Updated 5 min ago');

  // Line Items State
  const [lineItems, setLineItems] = useState<MobileInvoiceLineItem[]>(initialLineItems);
  const [lineItemViewMode, setLineItemViewMode] = useState<'cards' | 'table'>('cards');

  // Totals & Date State
  const [createdDate, setCreatedDate] = useState('14/09/2026');
  const [dueDate, setDueDate] = useState('28/09/2026');

  // Recalculations
  const subtotal = lineItems.reduce((acc, row) => acc + row.quantity * row.unitCost, 0);
  const totalVat = lineItems.reduce(
    (acc, row) => acc + (row.quantity * row.unitCost * (row.vatPercent || 0)) / 100,
    0
  );
  const grandTotal = subtotal + totalVat;
  const totalQty = lineItems.reduce((acc, row) => acc + row.quantity, 0);

  // Line items handlers
  const handleQuantityChange = (id: string, qty: number) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, qty) } : item))
    );
  };

  const handleUnitCostChange = (id: string, cost: number) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unitCost: Math.max(0, cost) } : item))
    );
  };

  const handleVatChange = (id: string, vat: number) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, vatPercent: Math.max(0, vat) } : item))
    );
  };

  const handleItemNameChange = (id: string, val: string) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, item: val } : item))
    );
  };

  const handleServiceChange = (id: string, val: string) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, service: val } : item))
    );
  };

  const handleDeleteRow = (id: string) => {
    if (lineItems.length === 1) {
      toast.warning('Invoice must contain at least one line item');
      return;
    }
    setLineItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('Row item removed');
  };

  const handleAddRow = () => {
    const newId = Date.now().toString();
    const newItem: MobileInvoiceLineItem = {
      id: newId,
      item: 'Custom Item',
      service: 'Washed Cup',
      quantity: 100,
      unitCost: 0.15,
      vatPercent: 20,
      isCustom: true,
    };
    setLineItems([...lineItems, newItem]);
    toast.success('New line item added');
  };

  const handleApplyCriteria = () => {
    toast.success('Criteria applied successfully!', {
      description: `${client} (${locations.length} locations, ${selectedServices.length} services)`,
    });
  };

  const handleClearCriteria = () => {
    setClient('Derby County Football Club');
    setLocations(['Pride Park Stadium', 'Derby Arena']);
    setBillCycleV1('September 2026 (Current)');
    setBillCycleV2('01/09/2026 - 30/09/2026');
    setSelectedServices(availableServices);
    toast.info('Criteria reset to default values');
  };

  const handleRefresh = () => {
    setLastUpdatedText('Updated just now');
    toast.success('Workspace criteria refreshed');
  };

  const handleGenerateInvoice = () => {
    const nextInvoiceNumber = `INV-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice = {
      invoiceNumber: nextInvoiceNumber,
      client,
      location: locations[0] ? `${locations[0]}${locations.length > 1 ? ` (+${locations.length - 1})` : ''}` : 'Pride Park Stadium',
      billCycle: billCycleV1.includes('September') ? '1st - 30th Sep, 2026' : billCycleV2,
      amount: grandTotal,
      itemCount: totalQty,
      dueDate,
      activities: Array.from(new Set(lineItems.map((i) => i.service))),
    };

    if (onGenerateSuccess) {
      onGenerateSuccess(newInvoice);
    }
    toast.success(`Invoice ${nextInvoiceNumber} generated!`, {
      description: `Grand Total £${grandTotal.toFixed(2)} for ${client}`,
    });
    onBack();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB (MATCHING DESKTOP SCREENSHOT) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer font-medium"
            >
              Invoice List
            </button>
            <span className="text-slate-400">›</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Generate Invoice
            </span>
          </div>

          {/* Back to List Button */}
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <Icon name="ArrowLeft" size={12} />
            <span>Back to List</span>
          </button>
        </div>

        {/* Updated Badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Refresh"
          >
            <span>{lastUpdatedText}</span>
            <Icon name="RotateCw" size={10} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD: SELECT YOUR CRITERIA BELOW */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Select your criteria below
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* Client Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Client
            </label>
            <CustomSelect
              value={client}
              onChange={(val) => setClient(val)}
              options={clientOptions}
              className="w-full"
              buttonClassName="!h-9.5 !px-3 !text-xs !rounded-xl !bg-white dark:!bg-[#0c0f17] !border-slate-200 dark:!border-slate-800"
            />
          </div>

          {/* Location Multiselect */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Location
            </label>
            <CustomMultiSelect
              values={locations}
              onChange={(vals) => setLocations(vals)}
              options={locationOptions}
              placeholder="Select locations..."
              className="w-full"
              buttonClassName="!h-9.5 !px-3 !text-xs !rounded-xl !bg-white dark:!bg-[#0c0f17] !border-slate-200 dark:!border-slate-800"
            />
          </div>

          {/* Bill Cycle (Version 1) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bill Cycle (Version 1)
            </label>
            <CustomSelect
              value={billCycleV1}
              onChange={(val) => setBillCycleV1(val)}
              options={monthOptions.map((m) => m.value)}
              icon="Calendar"
              className="w-full"
              buttonClassName="!h-9.5 !px-3 !text-xs !rounded-xl !bg-white dark:!bg-[#0c0f17] !border-slate-200 dark:!border-slate-800"
            />
          </div>

          {/* Bill Cycle (Version 2) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bill Cycle (Version 2)
            </label>
            <MobileDateRangePicker
              value={billCycleV2}
              onChange={(val) => setBillCycleV2(val)}
              placeholder="Select date range..."
              buttonClassName="!h-9.5 !px-3 !text-xs !rounded-xl !bg-white dark:!bg-[#0c0f17] !border-slate-200 dark:!border-slate-800"
            />
          </div>

          {/* Services Multiselect */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Services
            </label>
            <CustomMultiSelect
              values={selectedServices}
              onChange={(vals) => setSelectedServices(vals)}
              options={availableServices}
              placeholder="Select services..."
              className="w-full"
              buttonClassName="!h-9.5 !px-3 !text-xs !rounded-xl !bg-white dark:!bg-[#0c0f17] !border-slate-200 dark:!border-slate-800"
            />
          </div>

          {/* Clear & Apply Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClearCriteria}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Icon name="RotateCcw" size={13} />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCriteria}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Icon name="Check" size={13} />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CARD: INVOICE LINE ITEMS */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Invoice Line Items
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Configure services, quantities, unit costs, VAT %, and totals
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setLineItemViewMode('cards')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  lineItemViewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Card View"
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setLineItemViewMode('table')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  lineItemViewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Table View"
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Add Row Button */}
        <div>
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icon name="Plus" size={14} />
            <span>Add Additional Row Item</span>
          </button>
        </div>

        {/* --- CARDS VIEW MODE (TOUCH-FRIENDLY MOBILE CARDS) --- */}
        {lineItemViewMode === 'cards' ? (
          <div className="space-y-2.5">
            {lineItems.map((row) => {
              const rowSubtotal = row.quantity * row.unitCost;
              const rowVat = (rowSubtotal * (row.vatPercent || 0)) / 100;
              const rowTotalIncVat = rowSubtotal + rowVat;

              return (
                <div
                  key={row.id}
                  className="bg-[#f8fafc] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 space-y-2.5 text-xs shadow-2xs"
                >
                  {/* Top: Item name input + Service badge + Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) => handleItemNameChange(row.id, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white w-28 focus:outline-none focus:border-blue-500"
                        placeholder="Item name"
                      />

                      {row.isCustom ? (
                        <select
                          value={row.service}
                          onChange={(e) => handleServiceChange(row.id, e.target.value)}
                          className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {availableServices.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-md text-[11px] font-semibold text-blue-700 dark:text-blue-300 truncate">
                          {row.service}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                      title="Remove row"
                    >
                      <Icon name="Trash" size={15} />
                    </button>
                  </div>

                  {/* Middle: Qty, Unit Cost, VAT % inputs */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Qty
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={row.quantity}
                        onChange={(e) =>
                          handleQuantityChange(row.id, parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-center"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Unit Cost (£)
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.unitCost}
                        onChange={(e) =>
                          handleUnitCostChange(row.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-center"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        VAT (%)
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.vatPercent}
                        onChange={(e) =>
                          handleVatChange(row.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-center"
                      />
                    </div>
                  </div>

                  {/* Bottom: Subtotal & Total Inc VAT */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500">
                      Subtotal (Excl. VAT):{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                        £{rowSubtotal.toFixed(2)}
                      </strong>
                    </span>

                    <span className="text-slate-500">
                      Total Inc. VAT:{' '}
                      <strong className="text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                        £{rowTotalIncVat.toFixed(2)}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- TABLE VIEW MODE (HORIZONTAL SCROLL TABLE AS IN DESKTOP) --- */
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold h-9">
                  <th className="py-2 px-2.5">Item</th>
                  <th className="py-2 px-2.5">Service</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-center">Unit Cost (£)</th>
                  <th className="py-2 px-2.5 text-right">Total (Excl. VAT)</th>
                  <th className="py-2 px-2 text-center">VAT (%)</th>
                  <th className="py-2 px-2.5 text-right">Total Inc VAT (£)</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {lineItems.map((row) => {
                  const rowSubtotal = row.quantity * row.unitCost;
                  const rowVat = (rowSubtotal * (row.vatPercent || 0)) / 100;
                  const rowTotalIncVat = rowSubtotal + rowVat;

                  return (
                    <tr key={row.id} className="h-10 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-1.5 px-2.5">
                        <input
                          type="text"
                          value={row.item}
                          onChange={(e) => handleItemNameChange(row.id, e.target.value)}
                          className="w-20 px-1.5 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="py-1.5 px-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-semibold">
                          {row.service}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          value={row.quantity}
                          onChange={(e) =>
                            handleQuantityChange(row.id, parseInt(e.target.value) || 0)
                          }
                          className="w-14 px-1 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold text-center bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.01"
                          value={row.unitCost}
                          onChange={(e) =>
                            handleUnitCostChange(row.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-14 px-1 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold text-center bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-semibold">
                        £{rowSubtotal.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          value={row.vatPercent}
                          onChange={(e) =>
                            handleVatChange(row.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-12 px-1 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold text-center bg-white dark:bg-slate-800"
                        />
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                        £{rowTotalIncVat.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Icon name="Trash" size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. CARD: INVOICE TOTALS BREAKDOWN */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Invoice Totals Breakdown
          </h3>
        </div>

        <div className="space-y-2.5 text-xs font-semibold">
          {/* Created Date */}
          <div className="flex items-center justify-between min-h-[34px]">
            <span className="text-slate-500">Created Date</span>
            <SingleDatePicker
              value={createdDate}
              onChange={(val) => setCreatedDate(val)}
              placeholder="14/09/2026"
              className="w-34"
              buttonClassName="!h-8.5 !px-2.5 !text-xs !rounded-lg"
            />
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between min-h-[34px]">
            <span className="text-slate-500">Due Date</span>
            <SingleDatePicker
              value={dueDate}
              onChange={(val) => setDueDate(val)}
              placeholder="28/09/2026"
              className="w-34"
              buttonClassName="!h-8.5 !px-2.5 !text-xs !rounded-lg"
            />
          </div>

          {/* Subtotal Excl VAT */}
          <div className="flex items-center justify-between min-h-[30px] pt-1">
            <span className="text-slate-500">Subtotal (Excl. VAT)</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">
              £{subtotal.toFixed(2)}
            </span>
          </div>

          {/* Total VAT */}
          <div className="flex items-center justify-between min-h-[30px]">
            <span className="text-slate-500">Total VAT Amount</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">
              £{totalVat.toFixed(2)}
            </span>
          </div>

          {/* Grand Total */}
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-3 mt-2 flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              Grand Total (Incl. VAT)
            </span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">
              £{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Generate Invoice CTA Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleGenerateInvoice}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
            >
              <Icon name="FileText" size={15} />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
