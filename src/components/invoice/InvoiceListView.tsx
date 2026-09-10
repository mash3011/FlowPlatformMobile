import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

// Types for Invoice List
interface InvoiceRowData {
  id: string;
  invoiceNumber: string;
  client: string;
  dateRange: string;
  activities: string[];
  itemCount: number;
  status: 'Invoiced' | 'Not Invoiced' | 'Paid';
}

// Mock Data for List View (Node 1010:8649)
const figmaMockInvoices: InvoiceRowData[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    client: 'Derby County Football Club',
    dateRange: '13th - 15th Jul, 2025',
    activities: ['Wash', 'Damage'],
    itemCount: 1204,
    status: 'Not Invoiced',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    client: 'Derby LIVE',
    dateRange: '1st - 30th Aug, 2025',
    activities: ['Wash', 'Damage'],
    itemCount: 953,
    status: 'Invoiced',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    client: 'Electric Daisy',
    dateRange: '28th Sep - 1st Oct, 2025',
    activities: ['Wash', 'Damage'],
    itemCount: 1240,
    status: 'Paid',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    client: 'Derby County Football Club',
    dateRange: '1st - 31st Aug, 2025',
    activities: ['Lost', 'Damage'],
    itemCount: 12421,
    status: 'Not Invoiced',
  },
];

// Item Summary Types for Generate Screen (Node 1010:9338)
interface ItemSummaryRow {
  id: string;
  item: string;
  service: string;
  quantity: number;
  unitCost: number;
}

const initialSummaryItems: ItemSummaryRow[] = [
  { id: '1', item: 'Pint', service: 'Wash', quantity: 1250, unitCost: 0.15 },
  { id: '2', item: 'Half Pint', service: 'Wash', quantity: 550, unitCost: 0.15 },
  { id: '3', item: 'Pint', service: 'Damaged', quantity: 25, unitCost: 1.50 },
  { id: '4', item: 'Half Pint', service: 'Damaged', quantity: 75, unitCost: 1.50 },
  { id: '5', item: 'Delivery/Collection', service: 'Shipping', quantity: 8, unitCost: 25.00 },
];

interface InvoiceListViewProps {
  onSelectDashboard?: (tabId: string) => void;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = () => {
  // Mode switcher: 'list' (Node 1010:8649) vs 'generate' (Node 1010:9338)
  const [viewMode, setViewMode] = useState<'list' | 'generate'>('list');

  // List View States
  const [invoices, setInvoices] = useState<InvoiceRowData[]>(figmaMockInvoices);
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Not Invoiced' | 'Invoiced' | 'Paid'>('All');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRowData | null>(null);

  // Generate View States (Figma Node 1010:9338)
  const [genClient, setGenClient] = useState<string>('Derby County Football Club');
  const [genLocation, setGenLocation] = useState<string>('Pride Park Stadium');
  const [genDateRange, setGenDateRange] = useState<string>('1st Sep - 30th Sep, 2025');
  const [presetRange, setPresetRange] = useState<'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('2025-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2025-09-30');
  const [servicesFilter, setServicesFilter] = useState<{ wash: boolean; damaged: boolean; lost: boolean }>({
    wash: true,
    damaged: true,
    lost: false,
  });
  const [dueDate, setDueDate] = useState<string>('2025-09-09');
  const [summaryItems, setSummaryItems] = useState<ItemSummaryRow[]>(initialSummaryItems);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(20);

  const handleUnitCostChange = (id: string, newCost: number) => {
    setSummaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unitCost: newCost } : item))
    );
  };

  const updateCustomRangeString = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return;
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const startFmt = `${s.getDate()}${getOrdinalSuffix(s.getDate())} ${s.toLocaleString('default', { month: 'short' })}`;
      const endFmt = `${e.getDate()}${getOrdinalSuffix(e.getDate())} ${e.toLocaleString('default', { month: 'short' })}, ${e.getFullYear()}`;
      setGenDateRange(`${startFmt} - ${endFmt}`);
    } catch {
      // Fallback
    }
  };

  function getOrdinalSuffix(d: number) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }

  // Confirmation Modal State (Figma Node 1010:9499)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState<string>('INV-0001');

  // Filtered List View Data
  const filteredInvoices = invoices.filter((item) => {
    if (activeTabFilter === 'Not Invoiced') return item.status === 'Not Invoiced';
    if (activeTabFilter === 'Invoiced') return item.status === 'Invoiced';
    if (activeTabFilter === 'Paid') return item.status === 'Paid';
    if (selectedClientFilter !== 'all' && item.client !== selectedClientFilter) return false;
    return true;
  });

  // Calculate Generate View Summary Totals
  const subtotal = summaryItems.reduce((acc, row) => acc + row.quantity * row.unitCost, 0);
  const taxAmount = (subtotal * taxRatePercent) / 100;
  const grandTotal = subtotal + taxAmount;

  const getStatusStyle = (status: InvoiceRowData['status']) => {
    switch (status) {
      case 'Paid':
        return 'text-[#27AE60] bg-white border-[#EDEDED]';
      case 'Invoiced':
        return 'text-[#FFAE4C] bg-white border-[#EDEDED]';
      case 'Not Invoiced':
      default:
        return 'text-[#E84040] bg-white border-[#EDEDED]';
    }
  };

  const handleGenerateInvoiceSubmit = () => {
    const nextNum = invoices.length + 1;
    const invNum = `INV-00${nextNum}`;
    setCreatedInvoiceNumber(invNum);

    const newInv: InvoiceRowData = {
      id: Date.now().toString(),
      invoiceNumber: invNum,
      client: genClient || 'Derby County Football Club',
      dateRange: genDateRange || '1st Sep - 30th Sep, 2025',
      activities: [
        ...(servicesFilter.wash ? ['Wash'] : []),
        ...(servicesFilter.damaged ? ['Damage'] : []),
        ...(servicesFilter.lost ? ['Lost'] : []),
      ],
      itemCount: summaryItems.reduce((acc, r) => acc + r.quantity, 0),
      status: 'Invoiced',
    };

    setInvoices([newInv, ...invoices]);
    setIsConfirmationOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FFFFFF] dark:bg-[#090d16] text-[#241F20] dark:text-slate-100 p-6 space-y-4 font-sans relative">
      {/* HEADER & BREADCRUMB NAVIGATION */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`text-base font-bold transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'text-[#241F20] dark:text-white'
                : 'text-[#A6A6A6] hover:text-[#241F20]'
            }`}
          >
            Invoice
          </button>

          {viewMode === 'generate' && (
            <>
              <Icon name="ChevronRight" size={16} className="text-[#A6A6A6]" />
              <span className="text-sm font-semibold text-[#A6A6A6]">
                Generate Invoice
              </span>
            </>
          )}
        </div>

        {/* Action Button: Toggle Screen */}
        {viewMode === 'list' ? (
          <button
            onClick={() => setViewMode('generate')}
            className="px-4 py-2 rounded-md bg-[#241F20] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Icon name="Plus" size={15} />
            <span>New invoice</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('list')}
            className="px-3.5 py-1.5 rounded-md border border-[#EDEDED] dark:border-slate-800 text-xs font-semibold text-[#241F20] dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            Back to Invoice List
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: INVOICE LIST LIGHT MODE (FIGMA NODE 1010:8649) */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Top Filter Controls Bar matching Figma Specs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Left Side Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTabFilter('All')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'All'
                    ? 'border-[#27AE60] bg-white text-[#241F20] font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                All Invoices({invoices.length})
              </button>

              <button
                onClick={() => setActiveTabFilter('Not Invoiced')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'Not Invoiced'
                    ? 'border-[#27AE60] bg-white text-[#241F20] font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                Not Invoiced
              </button>

              <button
                onClick={() => setActiveTabFilter('Invoiced')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'Invoiced'
                    ? 'border-[#27AE60] bg-white text-[#241F20] font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                Invoiced
              </button>

              <button
                onClick={() => setActiveTabFilter('Paid')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'Paid'
                    ? 'border-[#27AE60] bg-white text-[#241F20] font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                Paid
              </button>
            </div>

            {/* Right Side Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <div className="relative">
                <select
                  value={selectedClientFilter}
                  onChange={(e) => setSelectedClientFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1 rounded-[6px] border border-[#EDEDED] bg-white dark:bg-slate-900 dark:border-slate-800 text-[#A6A6A6] text-xs font-semibold focus:outline-none cursor-pointer w-36"
                >
                  <option value="all">Client</option>
                  <option value="Derby County Football Club">Derby County Football Club</option>
                  <option value="Derby LIVE">Derby LIVE</option>
                  <option value="Electric Daisy">Electric Daisy</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9D9D9D]"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1 rounded-[6px] border border-[#EDEDED] bg-white dark:bg-slate-900 dark:border-slate-800 text-[#A6A6A6] text-xs font-semibold focus:outline-none cursor-pointer w-28"
                >
                  <option value="all">Location</option>
                  <option value="derby">Derby Stadium</option>
                  <option value="london">London Center</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9D9D9D]"
                />
              </div>

              <div className="relative">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  className="appearance-none pl-8 pr-7 py-1 rounded-[8px] border border-[#EDEDED] bg-white dark:bg-slate-900 dark:border-slate-800 text-[#A6A6A6] text-xs font-semibold focus:outline-none cursor-pointer w-44"
                >
                  <option value="all">Select date range</option>
                  <option value="jul2025">Jul 2025</option>
                  <option value="aug2025">Aug 2025</option>
                  <option value="sep2025">Sep 2025</option>
                </select>
                <Icon
                  name="Calendar"
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A6A6A6]"
                />
                <Icon
                  name="ChevronDown"
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9D9D9D]"
                />
              </div>
            </div>
          </div>

          {/* Main Figma Invoice Table Container (Rectangle 1010:8686) */}
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] overflow-hidden shadow-2xs flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#A6A6A6] font-semibold text-[12px] h-[38px]">
                    <th className="py-2.5 px-4 font-semibold">Invoice Number</th>
                    <th className="py-2.5 px-4 font-semibold">Client</th>
                    <th className="py-2.5 px-4 font-semibold">Date Range</th>
                    <th className="py-2.5 px-4 font-semibold">Activities</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Item Count</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-4 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                  {filteredInvoices.map((inv) => {
                    const statusClass = getStatusStyle(inv.status);

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group h-[48px]"
                      >
                        <td className="py-3 px-4 font-semibold text-[#241F20] dark:text-white">
                          {inv.invoiceNumber}
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#241F20] dark:text-slate-200">
                          {inv.client}
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#241F20] dark:text-slate-300">
                          {inv.dateRange}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {inv.activities.map((act, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-[6px] bg-[#F4F4F4] dark:bg-slate-800 border border-[#EDEDED] dark:border-slate-700 text-[#241F20] dark:text-slate-200 text-[10px] font-semibold"
                              >
                                {act}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#241F20] dark:text-white text-center">
                          {inv.itemCount.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-[6px] border text-[10px] font-semibold ${statusClass}`}
                          >
                            {inv.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === inv.id ? null : inv.id);
                            }}
                            className="p-1 rounded text-[#241F20] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Icon name="MoreVertical" size={14} />
                          </button>

                          {/* Figma Popup Menu (Union 1010:8855) */}
                          {activeMenuId === inv.id && (
                            <div className="absolute right-4 top-10 z-30 w-28 bg-white dark:bg-[#141c2b] border border-[#EDEDED] dark:border-slate-800 rounded-[10px] shadow-lg p-1 space-y-0.5 text-left text-[11px] font-semibold">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedInvoice(inv);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-[#241F20] dark:text-slate-200 cursor-pointer"
                              >
                                <span>View</span>
                                <Icon name="Eye" size={12} className="text-slate-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-[#241F20] dark:text-slate-200 cursor-pointer"
                              >
                                <span>Download</span>
                                <Icon name="Download" size={12} className="text-slate-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[#FFAE4C] cursor-pointer"
                              >
                                <span>Query</span>
                                <Icon name="HelpCircle" size={12} className="text-[#FFAE4C]" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Figma Bottom Pagination Bar */}
            <div className="p-3.5 bg-white dark:bg-[#0d131f] border-t border-[#EDEDED] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[#241F20] dark:text-slate-300 font-semibold tracking-tight">
                Showing 1 - 10 of 24
              </div>

              <div className="flex items-center gap-1.5 self-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#DEDEDE] dark:text-slate-600 text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-[26px] h-[26px] rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === 1
                      ? 'bg-[#241F20] text-white shadow-2xs'
                      : 'bg-white border border-[#EDEDED] text-[#241F20] hover:bg-slate-50'
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-[26px] h-[26px] rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === 2
                      ? 'bg-[#241F20] text-white shadow-2xs'
                      : 'bg-white border border-[#EDEDED] text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  2
                </button>

                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-[26px] h-[26px] rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === 3
                      ? 'bg-[#241F20] text-white shadow-2xs'
                      : 'bg-white border border-[#EDEDED] text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  3
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="px-3.5 py-1 rounded-[6px] bg-[#241F20] hover:bg-black text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: INVOICE GENERATE INVOICE LIGHT MODE (FIGMA NODE 1010:9338) */}
      {/* ========================================================================= */}
      {viewMode === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-1">
          {/* LEFT PANEL: SELECT CRITERIA & FILTERS (Node 1010:9367, width 300px) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
              <div>
                <p className="text-xs text-[#241F20] dark:text-slate-300 font-normal">
                  Select your criteria below
                </p>
              </div>

              {/* Form Controls */}
              <div className="space-y-3 text-xs">
                {/* Client Select */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#241F20] dark:text-slate-300 mb-1">
                    Client
                  </label>
                  <div className="relative">
                    <select
                      value={genClient}
                      onChange={(e) => setGenClient(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-1.5 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white font-semibold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Derby County Football Club">Derby County Football Club</option>
                      <option value="Derby LIVE">Derby LIVE</option>
                      <option value="Electric Daisy">Electric Daisy</option>
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#9D9D9D]"
                    />
                  </div>
                </div>

                {/* Location Select */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#241F20] dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={genLocation}
                      onChange={(e) => setGenLocation(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-1.5 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white font-semibold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Pride Park Stadium">All(7)</option>
                      <option value="Derby Arena">Derby Arena</option>
                    </select>
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#9D9D9D]"
                    />
                  </div>
                </div>

                {/* Date Range Select */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#241F20] dark:text-slate-300 mb-1">
                    Date Range
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={genDateRange}
                      onChange={(e) => setGenDateRange(e.target.value)}
                      placeholder="1st Sep - 30th Sep, 2025"
                      className="w-full pl-3 pr-8 py-1.5 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none"
                    />
                    <Icon
                      name="Calendar"
                      size={13}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A6A6A6]"
                    />
                  </div>

                  {/* Preset Date Range Buttons */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPresetRange('month');
                        setGenDateRange('1st Sep - 30th Sep, 2025');
                      }}
                      className={`px-3 py-1 rounded-[6px] border text-[10px] font-semibold transition-all cursor-pointer ${
                        presetRange === 'month'
                          ? 'border-[#27AE60] text-[#241F20] dark:text-white bg-white shadow-2xs font-bold'
                          : 'border-[#EDEDED] text-[#241F20] hover:bg-slate-50'
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPresetRange('custom');
                        updateCustomRangeString(customStartDate, customEndDate);
                      }}
                      className={`px-3 py-1 rounded-[6px] border text-[10px] font-semibold transition-all cursor-pointer ${
                        presetRange === 'custom'
                          ? 'border-[#27AE60] text-[#241F20] dark:text-white bg-white shadow-2xs font-bold'
                          : 'border-[#EDEDED] text-[#241F20] hover:bg-slate-50'
                      }`}
                    >
                      Custom Range
                    </button>
                  </div>

                  {/* Interactive Custom Range Calendar Input Fields */}
                  {presetRange === 'custom' && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 border border-[#EDEDED] dark:border-slate-800 rounded-[8px] space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#241F20] dark:text-slate-200">
                        <span>Select Custom Calendar Dates</span>
                        <Icon name="Calendar" size={13} className="text-[#27AE60]" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-semibold text-[#9D9D9D] mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => {
                              setCustomStartDate(e.target.value);
                              updateCustomRangeString(e.target.value, customEndDate);
                            }}
                            className="w-full px-2 py-1 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-950 text-[#241F20] dark:text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-semibold text-[#9D9D9D] mb-1">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => {
                              setCustomEndDate(e.target.value);
                              updateCustomRangeString(customStartDate, e.target.value);
                            }}
                            className="w-full px-2 py-1 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-950 text-[#241F20] dark:text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services Checkbox Filters */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#241F20] dark:text-slate-300 mb-2">
                    Services
                  </label>
                  <div className="flex items-center gap-4 text-[10px] font-semibold text-[#241F20] dark:text-slate-200">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={servicesFilter.wash}
                        onChange={(e) => setServicesFilter({ ...servicesFilter, wash: e.target.checked })}
                        className="rounded border-[#EDEDED] text-[#241F20] focus:ring-0 cursor-pointer"
                      />
                      <span>Wash</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={servicesFilter.damaged}
                        onChange={(e) => setServicesFilter({ ...servicesFilter, damaged: e.target.checked })}
                        className="rounded border-[#EDEDED] text-[#241F20] focus:ring-0 cursor-pointer"
                      />
                      <span>Damaged</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={servicesFilter.lost}
                        onChange={(e) => setServicesFilter({ ...servicesFilter, lost: e.target.checked })}
                        className="rounded border-[#EDEDED] text-[#241F20] focus:ring-0 cursor-pointer"
                      />
                      <span>Lost</span>
                    </label>
                  </div>
                </div>

                {/* Activity Overview Box */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#241F20] dark:text-slate-300 mb-1">
                    Activity Overview
                  </label>
                  <div className="p-3 bg-white border border-[#EDEDED] rounded-[8px] text-[10px] text-[#241F20]">
                    <span>6th - 7th Sep, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS: ITEM SUMMARY & INVOICE PREVIEW */}
          <div className="lg:col-span-8 space-y-5">
            {/* ITEM SUMMARY TABLE (Figma Node 1010:9365, height 333px) */}
            <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-semibold text-[#241F20] dark:text-white">
                Item Summary
              </h3>

              <div className="border border-[#EDEDED] dark:border-slate-800 rounded-[6px] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold text-[12px] h-[38px]">
                      <th className="py-2.5 px-4 font-semibold">Item</th>
                      <th className="py-2.5 px-4 font-semibold">Service</th>
                      <th className="py-2.5 px-4 font-semibold text-center">Quantity</th>
                      <th className="py-2.5 px-4 font-semibold text-center">Unit Cost (£)</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800 text-xs">
                    {summaryItems.map((row) => (
                      <tr key={row.id} className="h-[44px]">
                        <td className="py-2.5 px-4 font-semibold text-[#241F20] dark:text-white">
                          {row.item}
                        </td>
                        <td className="py-2.5 px-4 text-[#241F20] dark:text-slate-300 font-semibold">
                          {row.service}
                        </td>
                        <td className="py-2.5 px-4 text-center font-semibold text-[#241F20] dark:text-white">
                          {row.quantity.toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-center font-semibold text-[#241F20] dark:text-white">
                          <div className="inline-flex items-center gap-1 justify-center">
                            <span className="text-[#9D9D9D]">£</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={row.unitCost}
                              onChange={(e) => handleUnitCostChange(row.id, parseFloat(e.target.value) || 0)}
                              className="w-16 px-1.5 py-0.5 border border-[#EDEDED] dark:border-slate-800 rounded-[4px] text-center text-xs font-semibold focus:outline-none focus:border-[#27AE60] bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-[#241F20] dark:text-white">
                          £{(row.quantity * row.unitCost).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INVOICE PREVIEW & TOTALS (Figma Node 1010:9366, height 364px) */}
            <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-semibold text-[#241F20] dark:text-white">
                Invoice Preview
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-[#9D9D9D]">Client Name</span>
                  <span className="text-[#9D9D9D] font-semibold">
                    {genClient}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9D9D9D]">Invoice Number</span>
                  <span className="text-[#9D9D9D] font-semibold">INV-0001</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9D9D9D]">Date</span>
                  <span className="text-[#9D9D9D] font-semibold">
                    28th Sep, 2025
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9D9D9D]">Due Date</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="px-2.5 py-1 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none cursor-pointer w-28 text-center"
                    />
                  </div>
                </div>

                <div className="border-t border-[#EDEDED] dark:border-slate-800 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9D9D9D]">Subtotal</span>
                    <span className="text-[#9D9D9D] font-semibold">
                      £{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#9D9D9D]">
                      <span>Tax (</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={taxRatePercent}
                        onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                        className="w-12 px-1 py-0.5 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold text-[#241F20] dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-[#27AE60]"
                      />
                      <span>%)</span>
                    </div>
                    <span className="text-[#9D9D9D] font-semibold">
                      £{taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#EDEDED] dark:border-slate-800 pt-4 flex items-center justify-between text-base">
                  <span className="font-semibold text-[#241F20] dark:text-white">
                    Grand Total
                  </span>
                  <span className="font-bold text-[#241F20] dark:text-white">
                    £{grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Primary Generate Invoice Button Below Amount */}
                <div className="pt-3 border-t border-[#EDEDED] dark:border-slate-800">
                  <button
                    onClick={handleGenerateInvoiceSubmit}
                    className="w-full py-2.5 rounded-md bg-[#241F20] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Icon name="FileText" size={15} />
                    <span>Generate Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FIGMA CONFIRMATION MODAL (NODE 1010:9499) */}
      {/* ========================================================================= */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-[rgba(15,15,15,0.26)] backdrop-blur-[6px] z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[12px] shadow-2xl w-[360px] p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Green Check Circle Icon */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#27AE60] flex items-center justify-center mx-auto shadow-2xs">
              <Icon name="CheckCircle" size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#241F20] dark:text-white">
                Generate Invoice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Invoice <span className="font-bold text-[#241F20] dark:text-white">{createdInvoiceNumber}</span> successfully generated for <span className="font-semibold">{genClient}</span>.
              </p>
            </div>

            {/* Figma Action Buttons (Back to Home & Download Invoice) */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  setViewMode('list');
                }}
                className="flex-1 py-2 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back to Home
              </button>

              <button
                onClick={() => {
                  setIsConfirmationOpen(false);
                  setViewMode('list');
                }}
                className="flex-1 py-2 rounded-[6px] bg-[#241F20] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR LIST VIEW */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#241F20] dark:text-white flex items-center gap-2">
                <span>{selectedInvoice.invoiceNumber} Details</span>
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-[#EDEDED] dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Client:</span>
                  <span className="font-bold text-[#241F20] dark:text-white">{selectedInvoice.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Range:</span>
                  <span>{selectedInvoice.dateRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Item Count:</span>
                  <span className="font-bold">{selectedInvoice.itemCount.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`px-2 py-0.5 rounded-[6px] border text-[10px] font-semibold ${getStatusStyle(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-md bg-[#241F20] text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
