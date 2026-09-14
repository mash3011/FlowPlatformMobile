import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';

// Types for Invoice List
interface InvoiceRowData {
  id: string;
  invoiceNumber: string;
  client: string;
  dateRange: string;
  activities: string[];
  itemCount: number;
  status: 'Invoiced' | 'Paid';
}

// Service Interface for Services Management
export interface ServiceItem {
  id: string;
  xeroId: string;
  label: string;
  description: string;
}

// Pre-populated Default Services requested by team feedback
const initialServicesList: ServiceItem[] = [
  { id: '1', xeroId: 'XERO-001', label: 'Lost Cup', description: 'Charges for lost reusable cups during events' },
  { id: '2', xeroId: 'XERO-002', label: 'Washed Cup', description: 'Professional cleaning and washing service per cup' },
  { id: '3', xeroId: 'XERO-003', label: 'Damaged', description: 'Replacement fees for damaged cups or equipment' },
  { id: '4', xeroId: 'XERO-004', label: 'Tote Lost', description: 'Missing tote storage box replacement fee' },
  { id: '5', xeroId: 'XERO-005', label: 'Wheely Bins', description: 'Wheely bin collection and rental service' },
  { id: '6', xeroId: 'XERO-006', label: 'DRS Bins', description: 'Deposit Return Scheme bin setup and collection' },
];

// Mock Data for List View
const figmaMockInvoices: InvoiceRowData[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    client: 'Derby County Football Club',
    dateRange: '1st - 30th Sep, 2026',
    activities: ['Washed Cup', 'Damaged'],
    itemCount: 1204,
    status: 'Invoiced',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    client: 'Derby LIVE',
    dateRange: '1st - 31st Aug, 2026',
    activities: ['Washed Cup', 'Damaged'],
    itemCount: 953,
    status: 'Invoiced',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    client: 'Electric Daisy',
    dateRange: '1st - 31st Jul, 2026',
    activities: ['Washed Cup', 'Tote Lost'],
    itemCount: 1240,
    status: 'Paid',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    client: 'Derby County Football Club',
    dateRange: '1st - 30th Jun, 2026',
    activities: ['Lost Cup', 'Wheely Bins'],
    itemCount: 12421,
    status: 'Invoiced',
  },
];

// Item Summary Row Interface
interface ItemSummaryRow {
  id: string;
  item: string;
  service: string;
  quantity: number;
  unitCost: number;
  vatPercent: number; // Row-level VAT percentage
}

const initialSummaryItems: ItemSummaryRow[] = [
  { id: '1', item: 'Pint', service: 'Washed Cup', quantity: 1250, unitCost: 0.15, vatPercent: 20 },
  { id: '2', item: 'Half Pint', service: 'Washed Cup', quantity: 550, unitCost: 0.15, vatPercent: 20 },
  { id: '3', item: 'Pint', service: 'Damaged', quantity: 25, unitCost: 1.50, vatPercent: 20 },
  { id: '4', item: 'Half Pint', service: 'Damaged', quantity: 75, unitCost: 1.50, vatPercent: 20 },
  { id: '5', item: 'Delivery/Collection', service: 'Wheely Bins', quantity: 8, unitCost: 25.00, vatPercent: 20 },
];

interface InvoiceListViewProps {
  onSelectDashboard?: (tabId: string) => void;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = () => {
  // View mode: 'list' | 'generate' | 'preview' | 'services'
  const [viewMode, setViewMode] = useState<'list' | 'generate' | 'preview' | 'services'>('list');

  // List View States
  const [invoices, setInvoices] = useState<InvoiceRowData[]>(figmaMockInvoices);
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Invoiced' | 'Paid'>('All');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRowData | null>(null);

  // Services Management State (CRUD)
  const [servicesList, setServicesList] = useState<ServiceItem[]>(initialServicesList);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceXeroId, setServiceXeroId] = useState<string>('');
  const [serviceLabel, setServiceLabel] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');

  // Preview Mode State
  const [activePreviewInvoice, setActivePreviewInvoice] = useState<InvoiceRowData | null>(figmaMockInvoices[0]);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [toastInvoiceNum, setToastInvoiceNum] = useState<string>('INV-0001');

  // Generate View States
  const [genClient, setGenClient] = useState<string>('Derby County Football Club');
  const [genLocation, setGenLocation] = useState<string>('Pride Park Stadium');
  const [selectedMonthRange, setSelectedMonthRange] = useState<string>('September 2026');
  const [presetRange, setPresetRange] = useState<'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-30');
  
  // Date selection fields for Created Date & Due Date
  const [createdDate, setCreatedDate] = useState<string>('2026-09-14');
  const [dueDate, setDueDate] = useState<string>('2026-09-28');

  // Items table state
  const [summaryItems, setSummaryItems] = useState<ItemSummaryRow[]>(initialSummaryItems);

  // Month Date Range Options in Descending Order (Current Month First)
  const monthOptions = [
    { value: 'September 2026', label: 'September 2026 (Current)' },
    { value: 'August 2026', label: 'August 2026' },
    { value: 'July 2026', label: 'July 2026' },
    { value: 'June 2026', label: 'June 2026' },
    { value: 'May 2026', label: 'May 2026' },
    { value: 'April 2026', label: 'April 2026' },
    { value: 'March 2026', label: 'March 2026' },
    { value: 'February 2026', label: 'February 2026' },
    { value: 'January 2026', label: 'January 2026' },
  ];

  // Item Table Handlers
  const handleQuantityChange = (id: string, qty: number) => {
    setSummaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleUnitCostChange = (id: string, newCost: number) => {
    setSummaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unitCost: newCost } : item))
    );
  };

  const handleVatChange = (id: string, newVat: number) => {
    setSummaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, vatPercent: newVat } : item))
    );
  };

  const handleServiceChange = (id: string, newService: string) => {
    setSummaryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, service: newService } : item))
    );
  };

  const handleAddItemRow = () => {
    const defaultServiceLabel = servicesList[0]?.label || 'Washed Cup';
    const newRow: ItemSummaryRow = {
      id: Date.now().toString(),
      item: 'New Item',
      service: defaultServiceLabel,
      quantity: 100,
      unitCost: 1.0,
      vatPercent: 20,
    };
    setSummaryItems((prev) => [...prev, newRow]);
    toast.success('New line item added');
  };

  const handleDeleteItemRow = (id: string) => {
    if (summaryItems.length <= 1) {
      toast.error('Invoice must have at least one line item');
      return;
    }
    setSummaryItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('Line item removed');
  };

  const handleUpdateStatus = (id: string, newStatus: 'Invoiced' | 'Paid') => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Invoice status updated to ${newStatus}`, {
      position: 'top-right',
    });
  };

  // Services Management CRUD Handlers
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceXeroId(`XERO-00${servicesList.length + 1}`);
    setServiceLabel('');
    setServiceDescription('');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceXeroId(service.xeroId);
    setServiceLabel(service.label);
    setServiceDescription(service.description);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceLabel.trim()) {
      toast.error('Service Label is required');
      return;
    }

    if (editingService) {
      setServicesList((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, xeroId: serviceXeroId, label: serviceLabel, description: serviceDescription }
            : s
        )
      );
      toast.success(`Service "${serviceLabel}" updated successfully`);
    } else {
      const newService: ServiceItem = {
        id: Date.now().toString(),
        xeroId: serviceXeroId || `XERO-00${servicesList.length + 1}`,
        label: serviceLabel,
        description: serviceDescription,
      };
      setServicesList((prev) => [...prev, newService]);
      toast.success(`Service "${serviceLabel}" added successfully`);
    }

    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string, label: string) => {
    setServicesList((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Service "${label}" deleted`);
  };

  // Confirmation Modal State
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState<string>('INV-0001');

  // Filtered List View Data
  const filteredInvoices = invoices.filter((item) => {
    if (activeTabFilter === 'Invoiced') return item.status === 'Invoiced';
    if (activeTabFilter === 'Paid') return item.status === 'Paid';
    if (selectedClientFilter !== 'all' && item.client !== selectedClientFilter) return false;
    return true;
  });

  // Calculate Subtotal, Total VAT, and Grand Total across rows
  const subtotal = summaryItems.reduce((acc, row) => acc + row.quantity * row.unitCost, 0);
  const totalVatAmount = summaryItems.reduce(
    (acc, row) => acc + (row.quantity * row.unitCost * (row.vatPercent || 0)) / 100,
    0
  );
  const grandTotal = subtotal + totalVatAmount;

  const getStatusStyle = (status: InvoiceRowData['status']) => {
    switch (status) {
      case 'Paid':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'Invoiced':
      default:
        return 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
    }
  };

  const handleGenerateInvoiceSubmit = () => {
    const nextNum = invoices.length + 1;
    const invNum = `INV-00${nextNum}`;
    const newInv: InvoiceRowData = {
      id: Date.now().toString(),
      invoiceNumber: invNum,
      client: genClient,
      dateRange: selectedMonthRange,
      activities: summaryItems.map((s) => s.service),
      itemCount: summaryItems.reduce((acc, r) => acc + r.quantity, 0),
      status: 'Invoiced',
    };

    setInvoices([newInv, ...invoices]);
    setActivePreviewInvoice(newInv);
    setSelectedInvoice(newInv);
    setViewMode('list');
    setCreatedInvoiceNumber(invNum);
    setIsConfirmationOpen(true);
    setToastInvoiceNum(invNum);
    setShowSuccessToast(true);

    toast.success(`Invoice ${invNum} generated successfully!`, {
      description: `Previewing generated invoice for ${newInv.client}.`,
    });

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#FFFFFF] dark:bg-[#090d16] text-[#241F20] dark:text-slate-100 p-6 space-y-4 font-sans relative">
      {/* FLOATING SUCCESS TOAST POPUP (TOP RIGHT CORNER) */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[100] bg-[#241F20] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
            <Icon name="CheckCircle" size={18} />
          </div>
          <div>
            <div className="text-xs font-bold">Invoice Generated Successfully!</div>
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-white">{toastInvoiceNum}</span> created for {genClient}.
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER & NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#241F20] text-white shadow-xs'
                : 'text-[#A6A6A6] hover:text-[#241F20] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Invoice List
          </button>

          <button
            onClick={() => setViewMode('generate')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'generate'
                ? 'bg-[#241F20] text-white shadow-xs'
                : 'text-[#A6A6A6] hover:text-[#241F20] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Generate Invoice
          </button>

          <button
            onClick={() => setViewMode('services')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'services'
                ? 'bg-[#241F20] text-white shadow-xs'
                : 'text-[#A6A6A6] hover:text-[#241F20] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon name="Wrench" size={14} />
            <span>Services</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold">
              {servicesList.length}
            </span>
          </button>

          {viewMode === 'preview' && (
            <div className="flex items-center gap-1.5 text-xs text-[#A6A6A6]">
              <Icon name="ChevronRight" size={14} />
              <span className="font-semibold text-[#241F20] dark:text-white">
                {activePreviewInvoice ? activePreviewInvoice.invoiceNumber : 'INV-0001'}
              </span>
            </div>
          )}
        </div>

        {/* Top Header Action Buttons */}
        <div className="flex items-center gap-2">
          {viewMode === 'services' ? (
            <button
              onClick={handleOpenAddService}
              className="px-4 py-1.5 rounded-lg bg-[#241F20] hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Icon name="Plus" size={15} />
              <span>Add Service</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddService}
              className="px-3 py-1.5 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Icon name="Plus" size={14} className="text-blue-500" />
              <span>Quick Add Service</span>
            </button>
          )}

          {viewMode === 'list' && (
            <button
              onClick={() => setViewMode('generate')}
              className="px-4 py-1.5 rounded-lg bg-[#241F20] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Icon name="Plus" size={15} />
              <span>New invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: INVOICE LIST VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Top Filter Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Left Side Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTabFilter('All')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'All'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setActiveTabFilter('Invoiced')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'Invoiced'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                Invoiced
              </button>

              <button
                onClick={() => setActiveTabFilter('Paid')}
                className={`px-3 py-1 rounded-[6px] border text-xs transition-all cursor-pointer ${
                  activeTabFilter === 'Paid'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'border-[#EDEDED] bg-white text-[#241F20] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                Paid
              </button>
            </div>

            {/* Right Side Dropdowns using CustomSelect */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <CustomSelect
                value={selectedClientFilter}
                onChange={(val) => setSelectedClientFilter(val)}
                options={[
                  { value: 'all', label: 'All Clients' },
                  { value: 'Derby County Football Club', label: 'Derby County Football Club' },
                  { value: 'Derby LIVE', label: 'Derby LIVE' },
                  { value: 'Electric Daisy', label: 'Electric Daisy' },
                ]}
                className="w-48"
              />

              <CustomSelect
                value={selectedLocationFilter}
                onChange={(val) => setSelectedLocationFilter(val)}
                options={[
                  { value: 'all', label: 'All Locations' },
                  { value: 'derby', label: 'Derby Stadium' },
                  { value: 'london', label: 'London Center' },
                ]}
                className="w-40"
              />

              <CustomSelect
                value={dateRangeFilter}
                onChange={(val) => setDateRangeFilter(val)}
                options={[
                  { value: 'all', label: 'Select date range' },
                  { value: 'sep2026', label: 'September 2026' },
                  { value: 'aug2026', label: 'August 2026' },
                  { value: 'jul2026', label: 'July 2026' },
                  { value: 'jun2026', label: 'June 2026' },
                ]}
                className="w-48"
              />
            </div>
          </div>

          {/* MAIN INVOICE TABLE */}
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] relative z-20 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[42px]">
                  <th className="py-2.5 px-4">Invoice Number</th>
                  <th className="py-2.5 px-4">Client</th>
                  <th className="py-2.5 px-4">Date Range</th>
                  <th className="py-2.5 px-4">Activities</th>
                  <th className="py-2.5 px-4 text-center">Item Count</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="h-[48px] hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#241F20] dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-[#241F20] dark:text-slate-200 font-semibold">
                      {inv.client}
                    </td>
                    <td className="py-3 px-4 text-[#A6A6A6] font-medium">
                      {inv.dateRange}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {inv.activities.map((act, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-[#241F20] dark:text-slate-200 font-semibold">
                      {inv.itemCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-[6px] border text-[11px] font-semibold ${getStatusStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right relative">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#241F20] dark:text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          View
                        </button>

                        <button
                          onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <Icon name="MoreVertical" size={16} />
                        </button>
                      </div>

                      {/* 3-Dot Context Menu */}
                      {activeMenuId === inv.id && (
                        <div className="absolute right-4 top-10 z-50 w-36 bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-lg shadow-xl py-1 text-left animate-in fade-in duration-100">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Icon name="Eye" size={13} />
                            <span>Preview</span>
                          </button>

                          <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Edit Status
                          </div>
                          <button
                            onClick={() => {
                              handleUpdateStatus(inv.id, 'Invoiced');
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 cursor-pointer"
                          >
                            <span>Mark Invoiced</span>
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateStatus(inv.id, 'Paid');
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 cursor-pointer"
                          >
                            <span>Mark Paid</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: GENERATE INVOICE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'generate' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT FORM CONTROL PANEL */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#EDEDED] dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                  Invoice Details
                </h3>
                <p className="text-[11px] text-[#9D9D9D]">
                  Select criteria and configure dates
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Client Select */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Client
                  </label>
                  <CustomSelect
                    value={genClient}
                    onChange={(val) => setGenClient(val)}
                    options={[
                      'Derby County Football Club',
                      'Derby LIVE',
                      'Electric Daisy',
                    ]}
                    className="w-full"
                  />
                </div>

                {/* Location Select */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <CustomSelect
                    value={genLocation}
                    onChange={(val) => setGenLocation(val)}
                    options={[
                      { value: 'Pride Park Stadium', label: 'Pride Park Stadium' },
                      { value: 'Derby Arena', label: 'Derby Arena' },
                    ]}
                    className="w-full"
                  />
                </div>

                {/* Date Range Dropdown with Descending Months */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Date Range (Month)
                  </label>
                  <CustomSelect
                    value={selectedMonthRange}
                    onChange={(val) => setSelectedMonthRange(val)}
                    options={monthOptions}
                    className="w-full"
                  />
                </div>

                {/* Editable Created Date & Due Date Fields */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                      Created Date
                    </label>
                    <input
                      type="date"
                      value={createdDate}
                      onChange={(e) => setCreatedDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: ITEM SUMMARY TABLE & VAT CALCULATIONS */}
            <div className="lg:col-span-8 space-y-5">
              {/* ITEM SUMMARY TABLE WITH VAT & ADD ROW */}
              <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                      Invoice Line Items
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure services, quantities, unit costs, and row-level VAT percentages
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenAddService}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Icon name="Plus" size={13} />
                      <span>New Service</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="px-3 py-1.5 rounded-lg bg-[#241F20] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Icon name="Plus" size={13} />
                      <span>Add Row</span>
                    </button>
                  </div>
                </div>

                <div className="border border-[#EDEDED] dark:border-slate-800 rounded-[6px] relative z-20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[38px]">
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-center">Unit Cost (£)</th>
                        <th className="py-2 px-3 text-center">VAT (%)</th>
                        <th className="py-2 px-3 text-right">Total (£)</th>
                        <th className="py-2 px-2 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                      {summaryItems.map((row) => {
                        const rowSubtotal = row.quantity * row.unitCost;
                        const rowVat = (rowSubtotal * (row.vatPercent || 0)) / 100;
                        const rowTotal = rowSubtotal + rowVat;

                        return (
                          <tr key={row.id} className="h-[44px]">
                            <td className="py-2 px-3 font-semibold text-[#241F20] dark:text-white">
                              <input
                                type="text"
                                value={row.item}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSummaryItems((prev) =>
                                    prev.map((i) => (i.id === row.id ? { ...i, item: val } : i))
                                  );
                                }}
                                className="w-full px-2 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <CustomSelect
                                value={row.service}
                                onChange={(val) => handleServiceChange(row.id, val)}
                                options={servicesList.map((s) => ({ value: s.label, label: s.label }))}
                                className="w-36"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                value={row.quantity}
                                onChange={(e) => handleQuantityChange(row.id, parseInt(e.target.value) || 0)}
                                className="w-16 px-1.5 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={row.unitCost}
                                onChange={(e) => handleUnitCostChange(row.id, parseFloat(e.target.value) || 0)}
                                className="w-16 px-1.5 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                value={row.vatPercent}
                                onChange={(e) => handleVatChange(row.id, parseFloat(e.target.value) || 0)}
                                className="w-14 px-1.5 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-[#241F20] dark:text-white">
                              £{rowTotal.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteItemRow(row.id)}
                                className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                                title="Remove line item"
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

                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-3.5 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Icon name="Plus" size={14} />
                    <span>Add Additional Row Item</span>
                  </button>
                </div>
              </div>

              {/* TOTALS SUMMARY */}
              <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                  Invoice Totals Breakdown
                </h3>

                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9D9D9D]">Subtotal (Excl. VAT)</span>
                    <span className="text-[#241F20] dark:text-white font-bold">
                      £{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9D9D9D]">Total VAT Amount</span>
                    <span className="text-[#241F20] dark:text-white font-bold">
                      £{totalVatAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-[#EDEDED] dark:border-slate-800 pt-3 flex items-center justify-between text-base">
                    <span className="font-extrabold text-[#241F20] dark:text-white">
                      Grand Total (Incl. VAT)
                    </span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">
                      £{grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#EDEDED] dark:border-slate-800 flex justify-end">
                    <button
                      onClick={handleGenerateInvoiceSubmit}
                      className="px-6 py-2.5 rounded-lg bg-[#241F20] hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Icon name="FileText" size={15} />
                      <span>Generate Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: SERVICES MANAGEMENT SECTION */}
      {/* ========================================================================= */}
      {viewMode === 'services' && (
        <div className="space-y-4 pt-1">

          {/* SERVICES TABLE */}
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[42px]">
                  <th className="py-2.5 px-4">Xero ID</th>
                  <th className="py-2.5 px-4">Label (Service Name)</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                {servicesList.map((srv) => (
                  <tr key={srv.id} className="h-[48px] hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {srv.xeroId}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#241F20] dark:text-white">
                      {srv.label}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {srv.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#241F20] dark:text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Icon name="Edit" size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id, srv.label)}
                          className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Icon name="Trash" size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: INVOICE PREVIEW MODE */}
      {/* ========================================================================= */}
      {viewMode === 'preview' && (
        <div className="w-full space-y-4 pt-1">
          <div className="bg-[#EDEDED]/60 dark:bg-slate-900/50 border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-6 shadow-2xs space-y-4 relative max-w-4xl mx-auto">
            {/* Top Controls Bar */}
            <div className="flex items-center justify-between bg-white dark:bg-[#0d131f] p-4 rounded-[8px] border border-[#EDEDED] dark:border-slate-800 shadow-2xs">
              <div>
                <span className="text-[10px] text-[#A6A6A6] font-semibold block">Invoice Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-[#241F20] dark:text-white">
                    {activePreviewInvoice?.invoiceNumber || 'INV-0001'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#FFAE4C] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    Unpaid
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    toast.success('Downloading Invoice PDF...', {
                      description: `Invoice ${activePreviewInvoice?.invoiceNumber || 'INV-0001'} ready.`,
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#241F20] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Icon name="Download" size={14} />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className="text-[#A6A6A6] hover:text-[#241F20] dark:hover:text-white text-base font-bold transition-colors cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* WHITE PAPER DOCUMENT SHEET */}
            <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-8 shadow-sm space-y-6 max-w-3xl mx-auto text-xs">
              {/* TOP CLIENT DETAILS SECTION (BRETT'S FEEDBACK) */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider block">Billed To (Client Details)</span>
                <div className="text-base font-extrabold text-[#241F20] dark:text-white">
                  {activePreviewInvoice?.client || genClient}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  Pride Park Stadium, Pride Park, Derby DE24 8XL
                </div>
              </div>

              {/* Document Header Row */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#EDEDED] dark:border-slate-800">
                <div>
                  <span className="text-[#A6A6A6]">Invoice Number: </span>
                  <span className="font-bold text-[#241F20] dark:text-white ml-1">
                    {activePreviewInvoice?.invoiceNumber || 'INV-001'}
                  </span>
                </div>
                <div>
                  <span className="text-[#A6A6A6]">Invoice Range: </span>
                  <span className="font-bold text-[#241F20] dark:text-white ml-1">
                    {activePreviewInvoice?.dateRange || selectedMonthRange}
                  </span>
                </div>
              </div>

              {/* Dates Row */}
              <div className="flex items-center justify-between text-xs pt-2 pb-3 border-b border-[#EDEDED] dark:border-slate-800">
                <div>
                  <span className="text-[#A6A6A6]">Date Issued: </span>
                  <span className="font-bold text-[#241F20] dark:text-white ml-1">{createdDate}</span>
                </div>
                <div>
                  <span className="text-[#A6A6A6]">Due Date: </span>
                  <span className="font-bold text-[#241F20] dark:text-white ml-1">{dueDate}</span>
                </div>
              </div>

              {/* Invoice Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#241F20] dark:text-white">
                  Invoice Details
                </h4>

                <div className="border border-[#EDEDED] dark:border-slate-800 rounded-[6px] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[36px]">
                        <th className="py-2 px-4">Item</th>
                        <th className="py-2 px-4">Service</th>
                        <th className="py-2 px-4 text-center">Quantity</th>
                        <th className="py-2 px-4 text-center">Unit Cost (£)</th>
                        <th className="py-2 px-4 text-center">VAT (%)</th>
                        <th className="py-2 px-4 text-right">Total (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                      {summaryItems.map((row) => {
                        const rowSub = row.quantity * row.unitCost;
                        const rowVat = (rowSub * (row.vatPercent || 0)) / 100;
                        const rowTot = rowSub + rowVat;
                        return (
                          <tr key={row.id} className="h-[38px]">
                            <td className="py-2 px-4 font-semibold text-[#241F20] dark:text-white">{row.item}</td>
                            <td className="py-2 px-4 text-[#241F20] dark:text-slate-300 font-semibold">{row.service}</td>
                            <td className="py-2 px-4 text-center text-[#A6A6A6] font-semibold">{row.quantity.toLocaleString()}</td>
                            <td className="py-2 px-4 text-center text-[#A6A6A6] font-semibold">£{row.unitCost.toFixed(2)}</td>
                            <td className="py-2 px-4 text-center text-[#A6A6A6] font-semibold">{row.vatPercent}%</td>
                            <td className="py-2 px-4 text-right font-bold text-[#241F20] dark:text-white">£{rowTot.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-4 border-t border-[#EDEDED] dark:border-slate-800 grid grid-cols-2 gap-6 items-end bg-[#FBFBFB] dark:bg-slate-900/40 p-4 rounded-[6px]">
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#241F20] dark:text-white">Please make payments to:</div>
                  <div className="font-semibold text-[#241F20] dark:text-slate-300">Circulayo Limited</div>
                  <div className="font-semibold text-[#241F20] dark:text-slate-300">Barclays Bank</div>
                  <div className="font-semibold text-[#241F20] dark:text-slate-300">Account number: 83168891</div>
                </div>

                <div className="space-y-2 text-xs text-right">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#241F20] dark:text-white">Subtotal</span>
                    <span className="font-semibold text-[#241F20] dark:text-white">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#241F20] dark:text-white">Total VAT</span>
                    <span className="font-semibold text-[#241F20] dark:text-white">£{totalVatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-[#241F20] dark:text-white">Grand Total</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">£{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE ADD/EDIT MODAL DIALOG */}
      {/* ========================================================================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#241F20] dark:text-white flex items-center gap-2">
                <Icon name="Wrench" size={16} className="text-blue-500" />
                <span>{editingService ? 'Edit Service' : 'Add New Service'}</span>
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                  Xero ID for Service*
                </label>
                <input
                  type="text"
                  required
                  value={serviceXeroId}
                  onChange={(e) => setServiceXeroId(e.target.value)}
                  placeholder="e.g. XERO-001"
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                  Label (Service Name)*
                </label>
                <input
                  type="text"
                  required
                  value={serviceLabel}
                  onChange={(e) => setServiceLabel(e.target.value)}
                  placeholder="e.g. Lost Cup, Washed Cup, Damaged..."
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Enter details or notes for this service item..."
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#EDEDED] dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#241F20] hover:bg-black text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-[rgba(15,15,15,0.26)] backdrop-blur-[6px] z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[12px] shadow-2xl w-[360px] p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-2xs">
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
                  setViewMode('preview');
                }}
                className="flex-1 py-2 rounded-[6px] bg-[#241F20] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                View Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE DRAWER INVOICE PREVIEW */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedInvoice(null)}
          />

          <div className="relative w-screen max-w-2xl bg-[#EDEDED] dark:bg-[#0d131f] border-l border-[#EDEDED] dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between bg-white dark:bg-[#0d131f] px-6 py-4 border-b border-[#EDEDED] dark:border-slate-800">
              <div>
                <span className="text-[10px] text-[#A6A6A6] font-semibold block">Invoice Preview</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-bold text-[#241F20] dark:text-white">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-[6px] border text-[10px] font-semibold ${getStatusStyle(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    toast.success('Downloading Invoice PDF...', {
                      description: `Invoice ${selectedInvoice.invoiceNumber} ready.`,
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-[6px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#241F20] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Icon name="Download" size={14} />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#A6A6A6] hover:text-[#241F20] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-base font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-6 shadow-sm space-y-5 text-xs">
                {/* TOP CLIENT DETAILS SECTION (BRETT'S FEEDBACK) */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider block">Billed To (Client Details)</span>
                  <div className="text-base font-extrabold text-[#241F20] dark:text-white">
                    {selectedInvoice.client}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    Pride Park Stadium, Pride Park, Derby DE24 8XL
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#EDEDED] dark:border-slate-800">
                  <div>
                    <span className="text-[#A6A6A6]">Invoice Number: </span>
                    <span className="font-bold text-[#241F20] dark:text-white ml-1">
                      {selectedInvoice.invoiceNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A6A6A6]">Invoice Range: </span>
                    <span className="font-bold text-[#241F20] dark:text-white ml-1">
                      {selectedInvoice.dateRange}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 pb-3 border-b border-[#EDEDED] dark:border-slate-800">
                  <div>
                    <span className="text-[#A6A6A6]">Date Issued: </span>
                    <span className="font-bold text-[#241F20] dark:text-white ml-1">{createdDate}</span>
                  </div>
                  <div>
                    <span className="text-[#A6A6A6]">Due Date: </span>
                    <span className="font-bold text-[#241F20] dark:text-white ml-1">{dueDate}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#241F20] dark:text-white">
                    Invoice Details
                  </h4>

                  <div className="border border-[#EDEDED] dark:border-slate-800 rounded-[6px] overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[36px]">
                          <th className="py-2 px-3">Item</th>
                          <th className="py-2 px-3">Service</th>
                          <th className="py-2 px-3 text-center">Quantity</th>
                          <th className="py-2 px-3 text-center">Unit Cost (£)</th>
                          <th className="py-2 px-3 text-center">VAT (%)</th>
                          <th className="py-2 px-3 text-right">Total (£)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                        {summaryItems.map((row) => {
                          const rowSub = row.quantity * row.unitCost;
                          const rowVat = (rowSub * (row.vatPercent || 0)) / 100;
                          const rowTot = rowSub + rowVat;
                          return (
                            <tr key={row.id} className="h-[38px]">
                              <td className="py-2 px-3 font-semibold text-[#241F20] dark:text-white">{row.item}</td>
                              <td className="py-2 px-3 text-[#241F20] dark:text-slate-300 font-semibold">{row.service}</td>
                              <td className="py-2 px-3 text-center text-[#A6A6A6] font-semibold">{row.quantity.toLocaleString()}</td>
                              <td className="py-2 px-3 text-center text-[#A6A6A6] font-semibold">£{row.unitCost.toFixed(2)}</td>
                              <td className="py-2 px-3 text-center text-[#A6A6A6] font-semibold">{row.vatPercent}%</td>
                              <td className="py-2 px-3 text-right font-bold text-[#241F20] dark:text-white">£{rowTot.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDEDED] dark:border-slate-800 grid grid-cols-2 gap-4 items-end bg-[#FBFBFB] dark:bg-slate-900/40 p-4 rounded-[6px]">
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-[#241F20] dark:text-white">Please make payments to:</div>
                    <div className="font-semibold text-[#241F20] dark:text-slate-300">Circulayo Limited</div>
                    <div className="font-semibold text-[#241F20] dark:text-slate-300">Barclays Bank</div>
                    <div className="font-semibold text-[#241F20] dark:text-slate-300">Account number: 83168891</div>
                  </div>

                  <div className="space-y-1.5 text-xs text-right">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#241F20] dark:text-white">Subtotal</span>
                      <span className="font-semibold text-[#241F20] dark:text-white">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#241F20] dark:text-white">Total VAT</span>
                      <span className="font-semibold text-[#241F20] dark:text-white">£{totalVatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-[#241F20] dark:text-white">Grand Total</span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">£{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="bg-white dark:bg-[#0d131f] px-6 py-3 border-t border-[#EDEDED] dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Grand Total: <span className="font-bold text-[#241F20] dark:text-white text-sm">£{grandTotal.toFixed(2)}</span>
              </span>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-[6px] bg-[#241F20] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
