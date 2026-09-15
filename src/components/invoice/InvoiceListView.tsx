import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomMultiSelect } from '../ui/CustomMultiSelect';
import { CustomDateRangePicker } from '../ui/CustomDateRangePicker';
import { SingleDatePicker } from '../ui/SingleDatePicker';

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
  unitCost?: number;
  vatPercent?: number;
}

// Pre-populated Default Services requested by team feedback
const initialServicesList: ServiceItem[] = [
  { id: '1', xeroId: 'XERO-001', label: 'Lost Cup', description: 'Charges for lost reusable cups during events', unitCost: 1.50, vatPercent: 20 },
  { id: '2', xeroId: 'XERO-002', label: 'Washed Cup', description: 'Professional cleaning and washing service per cup', unitCost: 0.50, vatPercent: 20 },
  { id: '3', xeroId: 'XERO-003', label: 'Damaged', description: 'Replacement fees for damaged cups or equipment', unitCost: 2.00, vatPercent: 20 },
  { id: '4', xeroId: 'XERO-004', label: 'Tote Lost', description: 'Missing tote storage box replacement fee', unitCost: 15.00, vatPercent: 20 },
  { id: '5', xeroId: 'XERO-005', label: 'Wheely Bins', description: 'Wheely bin collection and rental service', unitCost: 25.00, vatPercent: 20 },
  { id: '6', xeroId: 'XERO-006', label: 'DRS Bins', description: 'Deposit Return Scheme bin setup and collection', unitCost: 30.00, vatPercent: 20 },
];

// User Info Interface & Initial Data
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const initialUsersList: UserInfo[] = [
  {
    id: 'usr-1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+44 7700 900077',
    email: 'john.doe@example.com',
  },
  {
    id: 'usr-2',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    phone: '+44 7700 900123',
    email: 'sarah.j@example.com',
  },
  {
    id: 'usr-3',
    firstName: 'Mark',
    lastName: 'Smith',
    phone: '+44 7700 900456',
    email: 'm.smith@example.com',
  },
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
  isCustom?: boolean; // True for newly added rows allowing service select
}

const initialSummaryItems: ItemSummaryRow[] = [
  { id: '1', item: 'Pint', service: 'Washed Cup', quantity: 1250, unitCost: 0.15, vatPercent: 20 },
  { id: '2', item: 'Half Pint', service: 'Washed Cup', quantity: 550, unitCost: 0.15, vatPercent: 20 },
  { id: '3', item: 'Pint', service: 'Damaged', quantity: 25, unitCost: 1.50, vatPercent: 20 },
  { id: '4', item: 'Half Pint', service: 'Damaged', quantity: 75, unitCost: 1.50, vatPercent: 20 },
  { id: '5', item: 'Delivery/Collection', service: 'Wheely Bins', quantity: 8, unitCost: 25.00, vatPercent: 20 },
];

interface InvoiceListViewProps {
  activeTab?: string;
  onSelectDashboard?: (tabId: string) => void;
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = ({ activeTab, onSelectDashboard }) => {
  // View mode: 'list' | 'generate' | 'preview' | 'services'
  const [viewMode, setViewMode] = useState<'list' | 'generate' | 'preview' | 'services'>(() => {
    if (activeTab === 'invoice-services' || activeTab === 'services') return 'services';
    return 'list';
  });

  React.useEffect(() => {
    if (activeTab === 'invoice-services' || activeTab === 'services') {
      setViewMode('services');
    } else if (activeTab === 'invoice-list' || activeTab === 'invoice') {
      setViewMode('list');
    }
  }, [activeTab]);

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
  const [activeServiceMenuId, setActiveServiceMenuId] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceXeroId, setServiceXeroId] = useState<string>('');
  const [serviceLabel, setServiceLabel] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceUnitCost, setServiceUnitCost] = useState<string>('1.50');
  const [serviceVatPercent, setServiceVatPercent] = useState<string>('20');

  // Close 3-dot dropdown menus on outside click
  React.useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
      setActiveServiceMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Preview Mode State
  const [activePreviewInvoice, setActivePreviewInvoice] = useState<InvoiceRowData | null>(figmaMockInvoices[0]);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [toastInvoiceNum, setToastInvoiceNum] = useState<string>('INV-0001');

  // Generate View States
  const [genClient, setGenClient] = useState<string>('Derby County Football Club');
  
  // Available Locations for Multiselect
  const locationOptions = [
    'Pride Park Stadium',
    'Derby Arena',
    'Electric Daisy',
    'Moorways Sports Village',
    'Rolls-Royce Leisure',
    'Derby Theatre',
    'Silk Mill Museum',
  ];
  
  const [genLocations, setGenLocations] = useState<string[]>([
    'Pride Park Stadium',
    'Derby Arena',
  ]);

  // User Info Dropdown & Create Modal State
  const [usersList, setUsersList] = useState<UserInfo[]>(initialUsersList);
  const [selectedUserId, setSelectedUserId] = useState<string>('usr-1');
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [userLastName, setUserLastName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const selectedUser = usersList.find((u) => u.id === selectedUserId) || usersList[0];

  const handleOpenAddUser = () => {
    setUserFirstName('');
    setUserLastName('');
    setUserPhone('');
    setUserEmail('');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFirstName.trim() || !userLastName.trim()) {
      toast.error('First name and Second name are required');
      return;
    }
    if (!userEmail.trim()) {
      toast.error('Email address is required');
      return;
    }

    const newUser: UserInfo = {
      id: `usr-${Date.now()}`,
      firstName: userFirstName.trim(),
      lastName: userLastName.trim(),
      phone: userPhone.trim() || '—',
      email: userEmail.trim(),
    };

    setUsersList((prev) => [...prev, newUser]);
    setSelectedUserId(newUser.id);
    setIsUserModalOpen(false);
    toast.success(`User "${newUser.firstName} ${newUser.lastName}" created successfully!`);
  };

  const [selectedMonthRange, setSelectedMonthRange] = useState<string>('September 2026');
  const [presetRange, setPresetRange] = useState<'month' | 'custom'>('month');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-30');
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('Updated 5 min ago');

  const handleRefreshData = () => {
    setLastUpdatedText('Updated just now');
    toast.success('Workspace data refreshed successfully');
  };
  
  // Selected Services Checklist State (Autoselected all at start)
  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    initialServicesList.map((s) => s.label)
  );

  const handleToggleServiceCheck = (label: string) => {
    if (selectedServices.includes(label)) {
      setSelectedServices(selectedServices.filter((s) => s !== label));
    } else {
      setSelectedServices([...selectedServices, label]);
    }
  };

  // Date selection fields for Created Date & Due Date
  const [createdDate, setCreatedDate] = useState<string>('14/09/2026');
  const [dueDate, setDueDate] = useState<string>('28/09/2026');

  // Items table state
  const [summaryItems, setSummaryItems] = useState<ItemSummaryRow[]>(initialSummaryItems);

  // Month Date Range Options in Descending Order (Current Month First)
  const monthOptions = [
    { value: '1st Sep - 30th Sep, 2026', label: 'September 2026 (Current)' },
    { value: '1st Aug - 31st Aug, 2026', label: 'August 2026' },
    { value: '1st Jul - 31st Jul, 2026', label: 'July 2026' },
    { value: '1st Jun - 30th Jun, 2026', label: 'June 2026' },
    { value: '1st May - 31st May, 2026', label: 'May 2026' },
    { value: '1st Apr - 30th Apr, 2026', label: 'April 2026' },
    { value: '1st Mar - 31st Mar, 2026', label: 'March 2026' },
    { value: '1st Feb - 28th Feb, 2026', label: 'February 2026' },
    { value: '1st Jan - 31st Jan, 2026', label: 'January 2026' },
    { value: '1st Dec - 31st Dec, 2025', label: 'December 2025' },
    { value: '1st Nov - 30th Nov, 2025', label: 'November 2025' },
    { value: '1st Oct - 31st Oct, 2025', label: 'October 2025' },
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
      isCustom: true,
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
    setServiceUnitCost('1.50');
    setServiceVatPercent('20');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceXeroId(service.xeroId);
    setServiceLabel(service.label);
    setServiceDescription(service.description);
    setServiceUnitCost(service.unitCost !== undefined ? String(service.unitCost) : '1.50');
    setServiceVatPercent(service.vatPercent !== undefined ? String(service.vatPercent) : '20');
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceLabel.trim()) {
      toast.error('Service Label is required');
      return;
    }

    const unitCostNum = parseFloat(serviceUnitCost) || 0;
    const vatNum = parseFloat(serviceVatPercent) || 0;

    if (editingService) {
      setServicesList((prev) =>
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
      const newService: ServiceItem = {
        id: Date.now().toString(),
        xeroId: serviceXeroId || `XERO-00${servicesList.length + 1}`,
        label: serviceLabel,
        description: serviceDescription,
        unitCost: unitCostNum,
        vatPercent: vatNum,
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
    setViewMode('preview');
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

      {/* HEADER & SECTION TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
        {/* Section Header Title & Updated Sync Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-bold text-[#241F20] dark:text-white flex items-center gap-3">
            {viewMode === 'services' && (
              <span>Services</span>
            )}
            {viewMode === 'generate' && (
              <div className="flex items-center gap-2 text-lg font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="text-[#A6A6A6] dark:text-slate-400 hover:text-[#241F20] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Invoice List
                </button>
                <Icon name="ChevronRight" size={16} className="text-[#A6A6A6]" />
                <span className="text-[#241F20] dark:text-white font-extrabold">Generate Invoice</span>
              </div>
            )}
            {(viewMode === 'list' || viewMode === 'preview') && (
              <>
                <span>Invoice List</span>
                {viewMode === 'preview' && (
                  <div className="flex items-center gap-1.5 text-xs text-[#A6A6A6] font-normal">
                    <Icon name="ChevronRight" size={14} />
                    <span className="font-semibold text-[#241F20] dark:text-white">
                      {activePreviewInvoice ? activePreviewInvoice.invoiceNumber : 'INV-0001'}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Updated / Sync Pill Badge (Rendered directly inline beside heading title) */}
            <div className="px-3 py-1 rounded-[10px] border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-2xs">
              <span>{lastUpdatedText}</span>
              <button
                type="button"
                onClick={handleRefreshData}
                title="Refresh Data"
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-transform active:rotate-180 cursor-pointer"
              >
                <Icon name="RotateCw" size={14} />
              </button>
            </div>
          </h1>
        </div>        {/* Top Header Action Buttons */}
        <div className="flex items-center gap-2">
          {viewMode === 'services' && (
            <button
              onClick={handleOpenAddService}
              className="px-4 py-1.5 rounded-lg bg-[#241F20] hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Icon name="Plus" size={15} />
              <span>Add Service</span>
            </button>
          )}

          {viewMode === 'generate' && (
            <button
              onClick={() => setViewMode('list')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Icon name="ArrowLeft" size={14} />
              <span>Back to List</span>
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

              <CustomDateRangePicker
                value={dateRangeFilter === 'all' ? 'Select date range' : dateRangeFilter}
                onChange={(val) => setDateRangeFilter(val)}
                className="w-56"
                align="right"
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === inv.id ? null : inv.id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-all shadow-2xs"
                      >
                        <Icon name="MoreVertical" size={16} />
                      </button>

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

                          <button
                            onClick={() => {
                              toast.success(`Downloading ${inv.id} PDF...`, {
                                description: `Preparing PDF export for ${inv.client}`,
                              });
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Icon name="Download" size={13} />
                            <span>Download</span>
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
            {/* LEFT FORM CONTROL PANEL (MATCHING 2ND IMAGE) */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#EDEDED] dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                  Select your criteria below
                </h3>
              </div>

              <div className="space-y-4 text-xs">
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

                {/* Location Multiselect */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <CustomMultiSelect
                    values={genLocations}
                    onChange={(vals) => setGenLocations(vals)}
                    options={locationOptions}
                    placeholder="Select locations..."
                    className="w-full"
                  />
                </div>

                {/* Date Range Section */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Date Range
                  </label>

                  {presetRange === 'month' ? (
                    <CustomSelect
                      value={
                        monthOptions.find((m) => m.value === selectedMonthRange)?.value ||
                        monthOptions[0].value
                      }
                      onChange={(val) => {
                        setSelectedMonthRange(val);
                        setPresetRange('month');
                      }}
                      options={monthOptions}
                      placeholder="Select Month..."
                      searchable={true}
                      icon="Calendar"
                      footerAction={{
                        label: 'Custom Date Range...',
                        onClick: () => {
                          setPresetRange('custom');
                          setIsDatePickerOpen(true);
                        },
                        icon: 'Calendar',
                      }}
                      className="w-full"
                    />
                  ) : (
                    <div className="space-y-2">
                      <CustomDateRangePicker
                        value={selectedMonthRange}
                        onChange={(val) => {
                          setSelectedMonthRange(val);
                        }}
                        isOpen={isDatePickerOpen}
                        onOpenChange={(open) => setIsDatePickerOpen(open)}
                        showPresets={false}
                        className="w-full"
                        align="left"
                      />
                    </div>
                  )}
                </div>

                {/* Services Multiselect Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Services
                  </label>
                  <CustomMultiSelect
                    values={selectedServices}
                    onChange={(vals) => setSelectedServices(vals)}
                    options={servicesList.map((s) => ({ value: s.label, label: s.label }))}
                    placeholder="Select services..."
                    searchable={true}
                    className="w-full"
                    footerAction={{
                      label: 'Create New Service',
                      onClick: handleOpenAddService,
                      icon: 'Plus',
                    }}
                    onEditOption={(srvLabel) => {
                      const found = servicesList.find((s) => s.label === srvLabel);
                      if (found) {
                        handleOpenEditService(found);
                      }
                    }}
                    onDeleteOption={(srvLabel) => {
                      const found = servicesList.find((s) => s.label === srvLabel);
                      if (found) {
                        handleDeleteService(found.id, found.label);
                        setSelectedServices((prev) => prev.filter((label) => label !== srvLabel));
                      }
                    }}
                  />
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
                      Configure services, quantities, unit costs, subtotal (excl. VAT), VAT %, and total inc. VAT
                    </p>
                  </div>

                  <div>
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

                <div className="border border-[#EDEDED] dark:border-slate-800 rounded-[6px] relative z-20 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FBFBFB] dark:bg-slate-900/80 border-b border-[#EDEDED] dark:border-slate-800 text-[#241F20] dark:text-slate-300 font-semibold h-[38px]">
                        <th className="py-2 px-3 min-w-[120px]">Item</th>
                        <th className="py-2 px-3 min-w-[140px]">Service</th>
                        <th className="py-2 px-2 text-center min-w-[60px]">Qty</th>
                        <th className="py-2 px-2 text-center min-w-[85px]">Unit Cost (£)</th>
                        <th className="py-2 px-3 text-right min-w-[95px]">Total (Excl. VAT)</th>
                        <th className="py-2 px-2 text-center min-w-[70px]">VAT (%)</th>
                        <th className="py-2 px-3 text-right min-w-[105px]">Total Inc VAT (£)</th>
                        <th className="py-2 px-2 text-center min-w-[50px]">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EDEDED] dark:divide-slate-800">
                      {summaryItems.map((row) => {
                        const rowSubtotal = row.quantity * row.unitCost;
                        const rowVat = (rowSubtotal * (row.vatPercent || 0)) / 100;
                        const rowTotalIncVat = rowSubtotal + rowVat;

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
                              {row.isCustom ? (
                                <CustomSelect
                                  value={row.service}
                                  onChange={(val) => handleServiceChange(row.id, val)}
                                  options={servicesList.map((s) => ({ value: s.label, label: s.label }))}
                                  className="w-36"
                                />
                              ) : (
                                <div className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-[#EDEDED] dark:border-slate-800 rounded text-xs font-semibold text-[#241F20] dark:text-slate-200">
                                  {row.service}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min="1"
                                value={row.quantity}
                                onChange={(e) => handleQuantityChange(row.id, parseInt(e.target.value) || 0)}
                                className="w-14 px-1 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={row.unitCost}
                                onChange={(e) => handleUnitCostChange(row.id, parseFloat(e.target.value) || 0)}
                                className="w-16 px-1 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-[#241F20] dark:text-slate-200">
                              £{rowSubtotal.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                value={row.vatPercent}
                                onChange={(e) => handleVatChange(row.id, parseFloat(e.target.value) || 0)}
                                className="w-14 px-1 py-1 border border-[#EDEDED] dark:border-slate-800 rounded text-center text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                              £{rowTotalIncVat.toFixed(2)}
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
              </div>

              {/* TOTALS SUMMARY WITH CREATED & DUE DATE PICKERS */}
              <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[8px] p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                  Invoice Totals Breakdown
                </h3>

                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex items-center justify-between min-h-[34px]">
                    <span className="text-[#9D9D9D]">Created Date</span>
                    <SingleDatePicker
                      value={createdDate}
                      onChange={(val) => setCreatedDate(val)}
                      placeholder="14/09/2026"
                      className="w-36"
                    />
                  </div>

                  <div className="flex items-center justify-between min-h-[34px]">
                    <span className="text-[#9D9D9D]">Due Date</span>
                    <SingleDatePicker
                      value={dueDate}
                      onChange={(val) => setDueDate(val)}
                      placeholder="28/09/2026"
                      className="w-36"
                    />
                  </div>

                  <div className="flex items-center justify-between min-h-[34px]">
                    <span className="text-[#9D9D9D]">Subtotal (Excl. VAT)</span>
                    <span className="text-[#241F20] dark:text-white font-bold text-sm">
                      £{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between min-h-[34px]">
                    <span className="text-[#9D9D9D]">Total VAT Amount</span>
                    <span className="text-[#241F20] dark:text-white font-bold text-sm">
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
                  <th className="py-2.5 px-4 text-center">Definite Unit Cost (£)</th>
                  <th className="py-2.5 px-4 text-center">Definite VAT (%)</th>
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
                    <td className="py-3 px-4 text-center font-semibold text-[#241F20] dark:text-slate-200">
                      £{(srv.unitCost ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-[#241F20] dark:text-slate-200">
                      {srv.vatPercent ?? 0}%
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {srv.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveServiceMenuId(activeServiceMenuId === srv.id ? null : srv.id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-all shadow-2xs"
                      >
                        <Icon name="MoreVertical" size={16} />
                      </button>

                      {/* 3-Dot Context Menu */}
                      {activeServiceMenuId === srv.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-4 top-10 z-50 w-36 bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-lg shadow-xl py-1 text-left animate-in fade-in duration-100"
                        >
                          <button
                            onClick={() => {
                              handleOpenEditService(srv);
                              setActiveServiceMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Icon name="Edit" size={14} className="text-slate-500" />
                            <span>Edit</span>
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                          <button
                            onClick={() => {
                              handleDeleteService(srv.id, srv.label);
                              setActiveServiceMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Icon name="Trash" size={14} className="text-red-500" />
                            <span>Delete</span>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Definite Unit Cost (£)*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={serviceUnitCost}
                    onChange={(e) => setServiceUnitCost(e.target.value)}
                    placeholder="e.g. 1.50"
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
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
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
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

      {/* ========================================================================= */}
      {/* CREATE NEW USER MODAL DIALOG */}
      {/* ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#241F20] dark:text-white">
                <span>Create New User</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={userFirstName}
                    onChange={(e) => setUserFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                    Second Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={userLastName}
                    onChange={(e) => setUserLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="e.g. +44 7700 900077"
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#241F20] dark:text-slate-300 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. john.doe@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[#EDEDED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#241F20] dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#EDEDED] dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#241F20] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Save User
                </button>
              </div>
            </form>
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
