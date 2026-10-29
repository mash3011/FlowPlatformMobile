import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';
import { MobileDateRangePicker } from './MobileDateRangePicker';
import { MobileGenerateInvoiceView } from './MobileGenerateInvoiceView';

export interface MobileInvoiceItem {
  id: string;
  invoiceNumber: string;
  client: string;
  location?: string;
  billCycle: string;
  activities: string[];
  amount: number;
  itemCount?: number;
  status: 'Invoiced' | 'Paid';
  dueDate?: string;
}

export interface MobileServiceItem {
  id: string;
  xeroId: string;
  label: string;
  description: string;
  unitCost: number;
  vatPercent: number;
}

const initialInvoices: MobileInvoiceItem[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    client: 'Derby County Football Club',
    location: 'Pride Park Stadium',
    billCycle: '1st - 30th Sep, 2026',
    activities: ['Washed Cup', 'Damaged'],
    amount: 1444.80,
    itemCount: 1900,
    status: 'Invoiced',
    dueDate: '14 Oct, 2026',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    client: 'Derby LIVE',
    location: 'Derby Arena',
    billCycle: '1st - 31st Aug, 2026',
    activities: ['Washed Cup', 'Damaged'],
    amount: 1143.60,
    itemCount: 1550,
    status: 'Invoiced',
    dueDate: '14 Sep, 2026',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    client: 'Electric Daisy',
    location: 'Electric Daisy Site',
    billCycle: '1st - 31st Jul, 2026',
    activities: ['Washed Cup', 'Tote Lost'],
    amount: 1488.00,
    itemCount: 1800,
    status: 'Paid',
    dueDate: '14 Aug, 2026',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    client: 'Derby County Football Club',
    location: 'Pride Park Stadium',
    billCycle: '1st - 30th Jun, 2026',
    activities: ['Lost Cup', 'Wheely Bins'],
    amount: 14905.20,
    itemCount: 9200,
    status: 'Invoiced',
    dueDate: '14 Jul, 2026',
  },
];

const initialServices: MobileServiceItem[] = [
  { id: '1', xeroId: 'XERO-001', label: 'Lost Cup', description: 'Charges for lost reusable cups during events', unitCost: 1.50, vatPercent: 20 },
  { id: '2', xeroId: 'XERO-002', label: 'Washed Cup', description: 'Professional cleaning and washing service per cup', unitCost: 0.50, vatPercent: 20 },
  { id: '3', xeroId: 'XERO-003', label: 'Damaged', description: 'Replacement fees for damaged cups or equipment', unitCost: 2.00, vatPercent: 20 },
  { id: '4', xeroId: 'XERO-004', label: 'Tote Lost', description: 'Missing tote storage box replacement fee', unitCost: 15.00, vatPercent: 20 },
  { id: '5', xeroId: 'XERO-005', label: 'Wheely Bins', description: 'Wheely bin collection and rental service', unitCost: 25.00, vatPercent: 20 },
  { id: '6', xeroId: 'XERO-006', label: 'DRS Bins', description: 'Deposit Return Scheme bin setup and collection', unitCost: 30.00, vatPercent: 20 },
];

interface MobileInvoiceListViewProps {
  currentTab?: string;
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
}

export const MobileInvoiceListView: React.FC<MobileInvoiceListViewProps> = ({
  currentTab = 'invoice-list',
  onOpenSidebar,
  onSelectNavTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'services'>(
    currentTab === 'invoice-services' ? 'services' : 'list'
  );
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  React.useEffect(() => {
    if (currentTab === 'invoice-services') {
      setActiveSubTab('services');
      setIsGenerateOpen(false);
    } else if (currentTab === 'invoice-list' || currentTab === 'invoice') {
      setActiveSubTab('list');
      setIsGenerateOpen(false);
    }
  }, [currentTab]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<'All' | 'Invoiced' | 'Paid'>('All');
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [dateRangeFilter, setDateRangeFilter] = useState('Select date range');

  // Invoices & Services State
  const [invoices, setInvoices] = useState<MobileInvoiceItem[]>(initialInvoices);
  const [services, setServices] = useState<MobileServiceItem[]>(initialServices);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<MobileInvoiceItem | null>(null);

  // Services Management State (matching desktop InvoiceListView)
  const [activeServiceMenuId, setActiveServiceMenuId] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<MobileServiceItem | null>(null);
  const [serviceXeroId, setServiceXeroId] = useState<string>('');
  const [serviceLabel, setServiceLabel] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceUnitCost, setServiceUnitCost] = useState<string>('1.50');
  const [serviceVatPercent, setServiceVatPercent] = useState<string>('20');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceXeroId(`XERO-00${services.length + 1}`);
    setServiceLabel('');
    setServiceDescription('');
    setServiceUnitCost('1.50');
    setServiceVatPercent('20');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: MobileServiceItem) => {
    setEditingService(srv);
    setServiceXeroId(srv.xeroId);
    setServiceLabel(srv.label);
    setServiceDescription(srv.description);
    setServiceUnitCost(srv.unitCost !== undefined ? String(srv.unitCost) : '1.50');
    setServiceVatPercent(srv.vatPercent !== undefined ? String(srv.vatPercent) : '20');
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceLabel.trim()) {
      toast.error('Service label is required');
      return;
    }

    const unitCostNum = parseFloat(serviceUnitCost) || 0;
    const vatNum = parseFloat(serviceVatPercent) || 0;

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                xeroId: serviceXeroId,
                label: serviceLabel,
                description: serviceDescription,
                unitCost: unitCostNum,
                vatPercent: vatNum,
              }
            : s
        )
      );
      toast.success(`Service "${serviceLabel}" updated successfully`);
    } else {
      const newSvc: MobileServiceItem = {
        id: Date.now().toString(),
        xeroId: serviceXeroId || `XERO-00${services.length + 1}`,
        label: serviceLabel,
        description: serviceDescription,
        unitCost: unitCostNum,
        vatPercent: vatNum,
      };
      setServices((prev) => [...prev, newSvc]);
      toast.success(`Service "${serviceLabel}" added successfully`);
    }

    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string, label: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Service "${label}" deleted`);
  };

  // Filtered List
  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (selectedClient !== 'All Clients' && inv.client !== selectedClient) return false;
    if (selectedLocation !== 'All Locations' && inv.location !== selectedLocation) return false;
    if (dateRangeFilter && dateRangeFilter !== 'Select date range' && dateRangeFilter !== 'all') {
      const q = dateRangeFilter.toLowerCase();
      const matchCycle = inv.billCycle.toLowerCase().includes(q);
      const matchDue = inv.dueDate ? inv.dueDate.toLowerCase().includes(q) : false;
      if (!matchCycle && !matchDue) {
        // Also check if any common month abbreviation matches (e.g. Sep -> September)
        const monthMap: Record<string, string> = {
          jan: 'jan', feb: 'feb', mar: 'mar', apr: 'apr', may: 'may', jun: 'jun',
          jul: 'jul', aug: 'aug', sep: 'sep', oct: 'oct', nov: 'nov', dec: 'dec'
        };
        const detectedMonth = Object.keys(monthMap).find(m => q.includes(m));
        if (detectedMonth && !inv.billCycle.toLowerCase().includes(detectedMonth)) {
          return false;
        }
      }
    }
    return true;
  });

  const filteredServices = services.filter((s) => {
    if (!serviceSearchQuery) return true;
    const q = serviceSearchQuery.toLowerCase();
    return (
      s.label.toLowerCase().includes(q) ||
      s.xeroId.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  const toggleInvoiceStatus = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: inv.status === 'Invoiced' ? 'Paid' : 'Invoiced' }
          : inv
      )
    );
    toast.info('Invoice status updated');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0c0f17] text-slate-900 dark:text-white font-sans relative">
      {/* Top Header matching Figma: #1e1e24 background with 16px bottom corner radius */}
      <header className="h-14 bg-[#1e1e24] text-white flex items-center justify-between px-4 shrink-0 z-30 shadow-md rounded-b-2xl">
        <button
          onClick={onOpenSidebar}
          className="p-1 rounded-lg text-white hover:text-slate-300 transition-colors cursor-pointer"
          title="Open Navigation Menu"
        >
          <Icon name="Menu" size={22} strokeWidth={2.2} />
        </button>

        <h1 className="text-[17px] font-bold tracking-tight text-white select-none">
          Flow Platform
        </h1>

        <button
          className="relative p-1 rounded-lg text-white hover:text-slate-300 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Icon name="Bell" size={20} strokeWidth={2.2} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444] border-1 border-[#1e1e24]" />
        </button>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
        {isGenerateOpen ? (
          <MobileGenerateInvoiceView
            onBack={() => setIsGenerateOpen(false)}
            onGenerateSuccess={(invData) => {
              const newInvoice: MobileInvoiceItem = {
                id: Date.now().toString(),
                invoiceNumber: invData.invoiceNumber,
                client: invData.client,
                location: invData.location,
                billCycle: invData.billCycle,
                activities: invData.activities,
                amount: invData.amount,
                itemCount: invData.itemCount,
                status: 'Invoiced',
                dueDate: invData.dueDate,
              };
              setInvoices((prev) => [newInvoice, ...prev]);
              setIsGenerateOpen(false);
              setSelectedInvoiceForPreview(newInvoice);
            }}
          />
        ) : (
          <>
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeSubTab === 'services' ? 'Services' : 'Invoice List'}
              </h2>

              <div className="flex items-center gap-2">
                {activeSubTab === 'list' && (
                  <button
                    onClick={() => setIsGenerateOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                    title="Generate Invoice"
                  >
                    <Icon name="Plus" size={15} strokeWidth={2.5} />
                    <span>Generate Invoice</span>
                  </button>
                )}

                {activeSubTab === 'services' && (
                  <button
                    onClick={handleOpenAddService}
                    className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                    title="Add Service"
                  >
                    <Icon name="Plus" size={15} strokeWidth={2.5} />
                    <span>Add Service</span>
                  </button>
                )}
              </div>
            </div>

            {/* Subtab Segmented Switcher: Invoices | Services */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl w-fit gap-1">
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'list'
                    ? 'bg-[#10b981] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Invoices
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('services')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'services'
                    ? 'bg-[#10b981] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Services
              </button>
            </div>

            {activeSubTab === 'list' ? (
          /* ========================================================================= */
          /* INVOICES LIST VIEW */
          /* ========================================================================= */
          <div className="space-y-3">
            {/* Filter Dropdowns Bar matching Figma Frame 1142:8790 */}
            <div className="space-y-2 z-20 relative">
              {/* Row 1: Clients & Locations side-by-side */}
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect
                  value={selectedClient}
                  onChange={(val) => setSelectedClient(val)}
                  options={[
                    'All Clients',
                    'Derby County Football Club',
                    'Derby LIVE',
                    'Electric Daisy',
                  ]}
                  placeholder="All Clients"
                  searchable={false}
                  buttonClassName="!h-9 !px-2.5 !gap-1.5 !text-xs !rounded-xl !bg-white dark:!bg-[#141824] !border-slate-200/90 dark:!border-slate-800 shadow-2xs whitespace-nowrap w-full"
                />

                <CustomSelect
                  value={selectedLocation}
                  onChange={(val) => setSelectedLocation(val)}
                  options={[
                    'All Locations',
                    'Pride Park Stadium',
                    'Derby Arena',
                    'Electric Daisy Site',
                  ]}
                  placeholder="All Locations"
                  searchable={false}
                  buttonClassName="!h-9 !px-2.5 !gap-1.5 !text-xs !rounded-xl !bg-white dark:!bg-[#141824] !border-slate-200/90 dark:!border-slate-800 shadow-2xs whitespace-nowrap w-full"
                />
              </div>

              {/* Row 2: Full width date range selector */}
              <div className="w-full">
                <MobileDateRangePicker
                  value={dateRangeFilter}
                  onChange={(val) => setDateRangeFilter(val)}
                  placeholder="Select date range"
                  buttonClassName="!h-9 !px-3 !gap-2 !text-xs !rounded-xl !bg-white dark:!bg-[#141824] !border-slate-200/90 dark:!border-slate-800 shadow-2xs whitespace-nowrap w-full justify-between"
                />
              </div>
            </div>

            {/* Status Pills and Counter */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center bg-[#f1f3f6] dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                {(['All', 'Invoiced', 'Paid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      statusFilter === filter
                        ? 'bg-[#10b981] text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {(selectedClient !== 'All Clients' ||
                  selectedLocation !== 'All Locations' ||
                  (dateRangeFilter && dateRangeFilter !== 'Select date range')) && (
                  <button
                    onClick={() => {
                      setSelectedClient('All Clients');
                      setSelectedLocation('All Locations');
                      setDateRangeFilter('Select date range');
                    }}
                    className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  {filteredInvoices.length} entries
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoiceForPreview(inv)}
                  className="bg-white dark:bg-[#141824] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-2 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {inv.billCycle}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {inv.client}
                    </h4>
                    {inv.location && (
                      <p className="text-[10px] text-slate-400">{inv.location}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {inv.activities.map((act, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {act}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-none">Amount</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        £{inv.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInvoiceStatus(inv.id);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {inv.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* SERVICES SECTION (MATCHING DESKTOP INVOICELISTVIEW & FIGMA CLEAN DESIGN) */
          /* ========================================================================= */
          <div className="space-y-3">
            {/* Search and Service count row */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  size={13}
                  className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  placeholder="Search service name, Xero ID..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                {filteredServices.length} services
              </span>
            </div>

            {/* Service Cards (Matching desktop table data & fields) */}
            <div className="space-y-2.5">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white dark:bg-[#141824] rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-2.5"
                >
                  {/* Row 1: Label + Xero ID badge + 3-Dot Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {srv.label}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                        {srv.xeroId}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveServiceMenuId(activeServiceMenuId === srv.id ? null : srv.id);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                        title="Service Actions"
                      >
                        <Icon name="MoreVertical" size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeServiceMenuId === srv.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 z-50 w-28 bg-white dark:bg-[#1e2330] rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 text-left animate-in fade-in duration-100"
                        >
                          <button
                            onClick={() => {
                              handleOpenEditService(srv);
                              setActiveServiceMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Icon name="Edit" size={13} className="text-slate-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteService(srv.id, srv.label);
                              setActiveServiceMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                          >
                            <Icon name="Trash" size={13} className="text-red-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Description */}
                  {srv.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {srv.description}
                    </p>
                  )}

                  {/* Row 3: Definite Unit Cost & Definite VAT */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-none">Definite Unit Cost</span>
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
                        £{srv.unitCost.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block leading-none">Definite VAT</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">
                        {srv.vatPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Invoice Breakdown Sheet */}
      {selectedInvoiceForPreview && (
        <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedInvoiceForPreview(null)}
          />
          <div className="relative max-h-[85%] w-full bg-white dark:bg-[#121622] rounded-t-3xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-200 border-t border-slate-200 dark:border-slate-800">
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Invoice Breakdown
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedInvoiceForPreview.invoiceNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                      selectedInvoiceForPreview.status === 'Paid'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {selectedInvoiceForPreview.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvoiceForPreview(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <Icon name="X" size={14} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Billed To</div>
                <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                  {selectedInvoiceForPreview.client}
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedInvoiceForPreview.location || 'Pride Park, Derby DE24 8XL'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Total Due</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    £{selectedInvoiceForPreview.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-blue-100 dark:border-blue-900/40">
                  Barclays Bank: Acct 83168891 • Circulayo Limited
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success('Downloading Invoice PDF...', {
                    description: `${selectedInvoiceForPreview.invoiceNumber}.pdf ready`,
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Icon name="Download" size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL (Matching Desktop Service Modal Form) */}
      {isServiceModalOpen && (
        <div className="absolute inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsServiceModalOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white dark:bg-[#121622] rounded-2xl p-4 shadow-2xl z-10 space-y-3.5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <Icon name="X" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Xero ID for Service*
                </label>
                <input
                  type="text"
                  required
                  value={serviceXeroId}
                  onChange={(e) => setServiceXeroId(e.target.value)}
                  placeholder="e.g. XERO-001"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Label (Service Name)*
                </label>
                <input
                  type="text"
                  required
                  value={serviceLabel}
                  onChange={(e) => setServiceLabel(e.target.value)}
                  placeholder="e.g. Lost Cup, Washed Cup..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Definite Unit Cost (£)*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={serviceUnitCost}
                    onChange={(e) => setServiceUnitCost(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Definite VAT (%)*
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    required
                    value={serviceVatPercent}
                    onChange={(e) => setServiceVatPercent(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Enter service details..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
                >
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1e1e24] text-slate-400 flex items-center justify-around px-2 z-30 shadow-2xl">
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('home')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Home" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Home</span>
        </button>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('stock-check')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Layers" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Stock Check</span>
        </button>

        <div className="relative -top-5 flex items-center justify-center px-2">
          <button
            onClick={() => setIsGenerateOpen(true)}
            className="w-13 h-13 rounded-full bg-[#10b981] hover:bg-[#059669] text-white border-4 border-[#1e1e24] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Generate Invoice"
          >
            <Icon name="Plus" size={26} strokeWidth={2.8} />
          </button>
        </div>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('calendar')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Calendar" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Calendar</span>
        </button>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('batch')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Archive" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Batch</span>
        </button>
      </nav>
    </div>
  );
};
