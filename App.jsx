import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, DollarSign, Activity, Target, BarChart3, Download, X } from 'lucide-react';

const STORAGE_KEY = 'gold-operations-v1';

export default function App() {
  const [operations, setOperations] = useState([]);
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Cargar operaciones al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOperations(JSON.parse(saved));
    } catch (e) {
      console.error('Error cargando operaciones:', e);
    }
  }, []);

  // Guardar cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    } catch (e) {
      console.error('Error guardando:', e);
    }
  }, [operations]);

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Solo mostrar si no está ya instalada
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const addOperation = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity) || 1;

    if (isNaN(buy) || isNaN(sell)) {
      alert('Por favor ingresa precios válidos');
      return;
    }

    const profit = (sell - buy) * qty;

    const newOp = {
      id: Date.now(),
      buyPrice: buy,
      sellPrice: sell,
      quantity: qty,
      profit: profit,
      date: date,
      notes: notes.trim(),
    };

    setOperations([newOp, ...operations]);

    setBuyPrice('');
    setSellPrice('');
    setQuantity('1');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const deleteOperation = (id) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  const clearAll = () => {
    if (confirm('¿Seguro que quieres borrar TODAS las operaciones? Esta acción no se puede deshacer.')) {
      setOperations([]);
    }
  };

  // Stats
  const totalProfit = operations.reduce((sum, op) => sum + op.profit, 0);
  const winningOps = operations.filter(op => op.profit > 0);
  const losingOps = operations.filter(op => op.profit < 0);
  const totalWins = winningOps.reduce((sum, op) => sum + op.profit, 0);
  const totalLosses = losingOps.reduce((sum, op) => sum + op.profit, 0);
  const winRate = operations.length > 0 ? (winningOps.length / operations.length * 100) : 0;
  const avgProfit = operations.length > 0 ? totalProfit / operations.length : 0;

  const formatMoney = (n) => {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Install banner */}
        {showInstallBanner && installPrompt && (
          <div className="mb-4 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/40 rounded-xl p-3 flex items-center gap-3">
            <Download className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-amber-200">Instalar app</div>
              <div className="text-xs text-zinc-400">Accede más rápido desde tu pantalla de inicio</div>
            </div>
            <button
              onClick={handleInstall}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm px-3 py-1.5 rounded-lg"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 pt-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-xl">🥇</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Gold Tracker
              </h1>
              <p className="text-xs text-zinc-500">Control de operaciones con oro</p>
            </div>
          </div>
        </div>

        {/* Resumen principal */}
        <div className={`rounded-2xl p-5 mb-4 border ${
          totalProfit >= 0
            ? 'bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border-emerald-800/50'
            : 'bg-gradient-to-br from-red-950/60 to-red-900/30 border-red-800/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Balance Total</span>
            {totalProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className={`text-4xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatMoney(totalProfit)}
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            {operations.length} {operations.length === 1 ? 'operación' : 'operaciones'} registradas
          </div>
        </div>

        {/* Stats grid */}
        {operations.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-zinc-400">Win rate</span>
              </div>
              <div className="text-lg font-semibold text-white">{winRate.toFixed(0)}%</div>
              <div className="text-xs text-zinc-500">{winningOps.length}G / {losingOps.length}P</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-zinc-400">Promedio</span>
              </div>
              <div className={`text-lg font-semibold ${avgProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {avgProfit >= 0 ? '+' : ''}{formatMoney(avgProfit)}
              </div>
              <div className="text-xs text-zinc-500">por operación</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-zinc-400">Ganancias</span>
              </div>
              <div className="text-lg font-semibold text-emerald-400">
                +{formatMoney(totalWins)}
              </div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="text-xs text-zinc-400">Pérdidas</span>
              </div>
              <div className="text-lg font-semibold text-red-400">
                {formatMoney(totalLosses)}
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        {showForm ? (
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-4 mb-4 shadow-lg shadow-amber-500/5">
            <h3 className="font-semibold mb-3 text-amber-300">Nueva operación</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Precio compra</label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Precio venta</label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Peso fino del lote</label>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-zinc-400 mb-1">Notas (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: breakout en resistencia"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Preview */}
            {buyPrice && sellPrice && !isNaN(parseFloat(buyPrice)) && !isNaN(parseFloat(sellPrice)) && (
              <div className="mb-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Resultado calculado</div>
                <div className={`text-xl font-bold ${
                  (parseFloat(sellPrice) - parseFloat(buyPrice)) * (parseFloat(quantity) || 1) >= 0
                    ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {(parseFloat(sellPrice) - parseFloat(buyPrice)) * (parseFloat(quantity) || 1) >= 0 ? '+' : ''}
                  {formatMoney((parseFloat(sellPrice) - parseFloat(buyPrice)) * (parseFloat(quantity) || 1))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={addOperation}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-zinc-950 font-semibold py-2.5 rounded-lg transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-zinc-950 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-5 h-5" />
            Nueva operación
          </button>
        )}

        {/* Historial */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Historial
            </h2>
            {operations.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-zinc-500 hover:text-red-400 transition"
              >
                Borrar todo
              </button>
            )}
          </div>

          {operations.length === 0 ? (
            <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl p-8 text-center">
              <DollarSign className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">Aún no has registrado operaciones</p>
              <p className="text-zinc-600 text-xs mt-1">Pulsa "Nueva operación" para empezar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {operations.map((op) => (
                <div
                  key={op.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          op.profit >= 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {op.profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {op.profit >= 0 ? 'Ganancia' : 'Pérdida'}
                        </span>
                        <span className="text-xs text-zinc-500">{op.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span>Compra: <span className="text-white font-medium">{formatMoney(op.buyPrice)}</span></span>
                        <span>→</span>
                        <span>Venta: <span className="text-white font-medium">{formatMoney(op.sellPrice)}</span></span>
                      </div>
                      {op.quantity !== 1 && (
                        <div className="text-xs text-zinc-500 mt-0.5">Peso fino: {op.quantity}</div>
                      )}
                      {op.notes && (
                        <div className="text-xs text-zinc-400 mt-1 italic">"{op.notes}"</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`text-lg font-bold ${
                        op.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {op.profit >= 0 ? '+' : ''}{formatMoney(op.profit)}
                      </div>
                      <button
                        onClick={() => deleteOperation(op.id)}
                        className="text-zinc-600 hover:text-red-400 transition p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
