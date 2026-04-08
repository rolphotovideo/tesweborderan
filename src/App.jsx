import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  CheckCircle,
  TrendingUp,
  DollarSign,
  Camera,
  ChevronRight
} from 'lucide-react';

// --- Mock Data Management (Local Storage) ---
const INITIAL_ORDERS = [
  { id: 'INV-001', client: 'Budi Santoso', service: 'Wedding Photography', date: '2023-12-20', status: 'Paid', amount: 5000000 },
  { id: 'INV-002', client: 'Siska Putri', service: 'Pre-Wedding', date: '2023-12-25', status: 'Pending', amount: 3500000 },
  { id: 'INV-003', client: 'Andi Wijaya', service: 'Product Shoot', date: '2024-01-05', status: 'Paid', amount: 1500000 },
];

const INITIAL_CLIENTS = [
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', phone: '08123456789' },
  { id: 2, name: 'Siska Putri', email: 'siska@example.com', phone: '08776543210' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('photo_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('photo_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  
  // Notifications
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('photo_orders', JSON.stringify(orders));
    localStorage.setItem('photo_clients', JSON.stringify(clients));
  }, [orders, clients]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Auth logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    notify('Welcome back, Admin!');
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Camera className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">LensFlow</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
          <NavItem active={activeTab === 'orders'} icon={<FileText size={20}/>} label="Invoices & Orders" onClick={() => setActiveTab('orders')} />
          <NavItem active={activeTab === 'calendar'} icon={<Calendar size={20}/>} label="Booking Calendar" onClick={() => setActiveTab('calendar')} />
          <NavItem active={activeTab === 'clients'} icon={<Users size={20}/>} label="Clients" onClick={() => setActiveTab('clients')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 w-full p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {notification && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            {notification}
          </div>
        )}

        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64" />
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard orders={orders} />}
          {activeTab === 'orders' && <Orders orders={orders} setOrders={setOrders} notify={notify} />}
          {activeTab === 'calendar' && <CalendarView orders={orders} />}
          {activeTab === 'clients' && <Clients clients={clients} setClients={setClients} notify={notify} />}
        </div>
      </main>
    </div>
  );
}

// --- UI Components ---

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl mb-4">
            <Camera className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to LensFlow</h1>
          <p className="text-slate-500">Login to manage your studio</p>
        </div>
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input required type="email" defaultValue="admin@lensflow.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input required type="password" defaultValue="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${
        active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
    </button>
  );
}

function Dashboard({ orders }) {
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Revenue" value={`Rp ${totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-emerald-600" />} trend="+12.5%" />
        <StatCard label="Total Orders" value={orders.length} icon={<FileText className="text-blue-600" />} trend="+4" />
        <StatCard label="Pending Bookings" value={pendingOrders} icon={<Calendar className="text-orange-600" />} trend="-2" />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                  <TrendingUp size={18} className="text-indigo-500" />
                </div>
                <div>
                  <p className="font-semibold">{order.client}</p>
                  <p className="text-xs text-slate-500">{order.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-600">Rp {order.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
  );
}

function Orders({ orders, setOrders, notify }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client: '', service: '', amount: '', date: '' });

  const addOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `INV-00${orders.length + 1}`,
      ...formData,
      amount: parseInt(formData.amount),
      status: 'Pending'
    };
    setOrders([newOrder, ...orders]);
    setShowModal(false);
    setFormData({ client: '', service: '', amount: '', date: '' });
    notify('Order created successfully!');
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
    notify('Order deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Invoices</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all"
        >
          <Plus size={20} /> Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Service</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600">{order.id}</td>
                <td className="px-6 py-4 font-medium">{order.client}</td>
                <td className="px-6 py-4 text-slate-600">{order.service}</td>
                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                <td className="px-6 py-4 font-bold">Rp {order.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => notify('Exporting PDF...')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download size={18} /></button>
                  <button onClick={() => deleteOrder(order.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">New Invoice</h2>
            <form onSubmit={addOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Service</option>
                  <option value="Wedding">Wedding Photography</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Product">Product Shoot</option>
                  <option value="Event">Event Coverage</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (IDR)</label>
                  <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarView({ orders }) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{months[today.getMonth()]} {today.getFullYear()}</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">{'<'}</button>
          <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">{'>'}</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
        ))}
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const hasOrder = orders.some(o => new Date(o.date).getDate() === day);
          return (
            <div key={i} className="bg-white min-h-[140px] p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
              <span className={`text-sm font-semibold ${day === today.getDate() ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                {day}
              </span>
              {hasOrder && (
                <div className="mt-2 space-y-1">
                  {orders.filter(o => new Date(o.date).getDate() === day).map(o => (
                    <div key={o.id} className="text-[10px] bg-indigo-50 text-indigo-700 p-1.5 rounded-lg border border-indigo-100 font-medium truncate">
                      {o.client}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}

function Clients({ clients, setClients, notify }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Client Management</h3>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold hover:bg-slate-50 transition-all">
          <Plus size={20} /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Users size={28} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{client.name}</h4>
                <p className="text-sm text-slate-500">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-sm text-slate-400">{client.phone}</span>
              <button className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View Profile <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
