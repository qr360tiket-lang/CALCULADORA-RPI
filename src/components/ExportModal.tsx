import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Building2, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult } from '../types/realEstate';
import { formatCurrency, formatPct } from '../utils/formatters';

interface ExportModalProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  property,
  results,
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Calculadora Inmobiliaria Perú - Reporte Ejecutivo'],
      ['Inmueble', property.title],
      ['Distrito', property.district],
      ['Tipo de Inmueble', property.propertyType],
      ['Área Techada (m2)', property.areaM2.toString()],
      ['Moneda', property.currency],
      ['Tipo de Cambio (PEN/USD)', property.exchangeRate.toString()],
      ['Fecha de Emisión', currentDate],
      [''],
      ['ESTRUCTURA DE ADQUISICIÓN Y GASTOS DE CIERRE'],
      ['Precio de Compra', results.purchasePrice.toString()],
      ['Precio por m2', results.pricePerM2.toString()],
      ['Cuota Inicial (%)', `${property.downPaymentPct}%`],
      ['Monto Cuota Inicial', results.downPaymentAmount.toString()],
      ['Saldo a Financiar', results.loanAmount.toString()],
      ['Impuesto de Alcabala (10 UIT exoneradas)', results.alcabalaAmount.toString()],
      ['Gastos Notaría', results.notaryAmount.toString()],
      ['Registros Públicos (SUNARP)', results.sunarpAmount.toString()],
      ['Otros Gastos Iniciales', results.extraInitialExpensesTotal.toString()],
      ['INVERSIÓN TOTAL PROPIA REQUERIDA (EQUITY)', results.totalInitialInvestmentRequired.toString()],
      [''],
      ['CONDICIONES DE FINANCIAMIENTO HIPOTECARIO'],
      ['Modalidad', property.financingMode],
      ['Plazo (Años)', property.financingMode === 'hipoteca' ? property.loanTermYears.toString() : 'N/A'],
      ['TEA (%)', property.financingMode === 'hipoteca' ? `${property.teaPct}%` : 'N/A'],
      ['Cuota Mensual Amortización e Interés', results.monthlyAmortizationAndInterest.toString()],
      ['Seguro de Desgravamen Mensual', results.monthlyDesgravamen.toString()],
      ['Seguro de Inmueble Mensual', results.monthlyPropertyInsurance.toString()],
      ['CUOTA BANCARIA TOTAL MENSUAL', results.totalMonthlyMortgagePayment.toString()],
      ['Intereses Totales a Pagar', results.totalLoanInterestPaid.toString()],
      [''],
      ['RENTABILIDAD Y GASTOS OPERATIVOS'],
      ['Estrategia de Renta', property.rentalStrategy],
      ['Ingreso Bruto Mensual', results.grossMonthlyIncome.toString()],
      ['Pérdida por Vacancia Mensual', results.vacancyLossMonthly.toString()],
      ['Ingreso Bruto Efectivo Mensual', results.effectiveGrossMonthlyIncome.toString()],
      ['Mantenimiento Edificio', results.buildingMaintenanceMonthly.toString()],
      ['Impuesto Predial y Arbitrios', results.municipalTaxMonthly.toString()],
      ['Reserva Imprevistos / Reparaciones', results.repairsReserveMonthly.toString()],
      ['Comisión Property Manager', results.managementFeeMonthly.toString()],
      ['SUNAT Renta 1ra Categoría (5%)', results.sunatTaxMonthly.toString()],
      ['Total Gastos Operativos Mensuales', results.totalOperatingExpensesMonthly.toString()],
      ['INGRESO OPERATIVO NETO MENSUAL (NOI)', results.netOperatingIncomeMonthly.toString()],
      [''],
      ['MÉTRICAS CLAVE Y CASH FLOW'],
      ['CASH FLOW MENSUAL NETO', results.netCashFlowMonthly.toString()],
      ['CASH FLOW ANUAL NETO', results.netCashFlowAnnual.toString()],
      ['Cap Rate Anual (%)', `${results.capRatePct}%`],
      ['Cash-on-Cash Return (%)', `${results.cashOnCashReturnPct}%`],
      ['Rentabilidad Bruta (Yield %)', `${results.grossYieldPct}%`],
      ['Años de Recuperación (Payback)', results.paybackYears ? `${results.paybackYears} años` : 'N/A'],
      ['Score de Salud Inmobiliaria', `${results.healthScore.score}/100`],
      ['Veredicto', results.healthScore.title],
    ];

    const csvContent = '\uFEFF' + rows.map(e => e.map(item => `"${(item || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_inmobiliario_${property.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      property,
      results,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inmoperu_datos_${property.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#DDD5C3] shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-auto text-[#091C2C] animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Header Tools */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD5C3] no-print">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8B66D] font-bold">
              Exportación y Reporte
            </span>
            <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-[#091C2C]">
              Reporte Ejecutivo de Inversión Inmobiliaria
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#091C2C] hover:bg-[#1b364e] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D8B66D]" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-2 rounded-xl bg-[#F6F4EF] hover:bg-[#EAE4D7] text-[#091C2C] font-semibold text-xs border border-[#DDD5C3] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar en formato Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-2 rounded-xl bg-[#F6F4EF] hover:bg-[#EAE4D7] text-[#091C2C] font-semibold text-xs border border-[#DDD5C3] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar datos en JSON"
            >
              <Download className="w-4 h-4 text-[#091C2C]" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto pr-2 space-y-6 flex-1 text-xs">
          
          {/* Executive Letterhead */}
          <div className="p-6 rounded-2xl bg-[#091C2C] text-[#F6F4EF] border border-[#D8B66D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D8B66D] text-[#091C2C] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D8B66D] font-bold block mb-0.5">
                  PAVEL MASTER · INVERSIÓN SEGURA
                </span>
                <h1 className="font-serif-title text-xl font-bold text-white">
                  {property.title || 'Propiedad sin título'}
                </h1>
                <p className="text-xs text-[#DDD5C3]">
                  {property.district || 'Lima'} · {property.propertyType.toUpperCase()} · {property.areaM2} m²
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              <span className="text-[10px] uppercase font-mono text-[#D8B66D] block">
                Fecha de Emisión
              </span>
              <span className="text-xs font-mono font-semibold text-white">
                {currentDate}
              </span>
              <span className="text-[11px] text-[#DDD5C3]/80 block font-mono">
                TC: S/. {property.exchangeRate.toFixed(2)} por USD
              </span>
            </div>
          </div>

          {/* 4 Summary Highlight Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3]">
              <span className="text-[10px] text-[#6F6456] block uppercase font-mono">Precio Compra</span>
              <span className="font-mono text-base font-bold text-[#091C2C]">
                {formatCurrency(results.purchasePrice, property.currency)}
              </span>
            </div>
            <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3]">
              <span className="text-[10px] text-[#6F6456] block uppercase font-mono">Capital Propio</span>
              <span className="font-mono text-base font-bold text-[#091C2C]">
                {formatCurrency(results.totalInitialInvestmentRequired, property.currency)}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
              <span className="text-[10px] text-emerald-800 block uppercase font-mono">Cash Flow / Mes</span>
              <span className={`font-mono text-base font-bold ${results.netCashFlowMonthly >= 0 ? 'text-emerald-900' : 'text-red-700'}`}>
                {formatCurrency(results.netCashFlowMonthly, property.currency)}
              </span>
            </div>
            <div className="p-3 bg-[#091C2C] text-white rounded-xl">
              <span className="text-[10px] text-[#D8B66D] block uppercase font-mono">Cap Rate / CoC</span>
              <span className="font-mono text-base font-bold text-white">
                {formatPct(results.capRatePct)} / {formatPct(results.cashOnCashReturnPct)}
              </span>
            </div>
          </div>

          {/* Detailed Financial Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Table 1: Inversión Inicial & Gastos de Cierre */}
            <div className="p-4 rounded-xl border border-[#DDD5C3] bg-white space-y-2">
              <h4 className="font-serif-title font-bold text-sm text-[#091C2C] pb-1 border-b border-[#DDD5C3]/40">
                1. Estructura de Compra & Gastos Notariales / Registrales
              </h4>
              <div className="divide-y divide-[#DDD5C3]/30 text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Precio pactado:</span>
                  <span className="font-mono font-bold text-[#091C2C]">{formatCurrency(results.purchasePrice, property.currency)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Cuota inicial ({property.downPaymentPct}%):</span>
                  <span className="font-mono font-bold text-[#091C2C]">{formatCurrency(results.downPaymentAmount, property.currency)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Alcabala (10 UIT inafectas):</span>
                  <span className="font-mono text-[#091C2C]">
                    {property.isFirstSaleConstructor ? 'S/. 0 (Exonerado)' : formatCurrency(results.alcabalaAmount, property.currency)}
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Notaría estimada:</span>
                  <span className="font-mono text-[#091C2C]">{formatCurrency(results.notaryAmount, property.currency)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Registros Públicos (SUNARP):</span>
                  <span className="font-mono text-[#091C2C]">{formatCurrency(results.sunarpAmount, property.currency)}</span>
                </div>
                {results.extraInitialExpensesTotal > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span className="text-[#6F6456]">Partidas adicionales:</span>
                    <span className="font-mono text-[#091C2C]">{formatCurrency(results.extraInitialExpensesTotal, property.currency)}</span>
                  </div>
                )}
                <div className="py-2 flex justify-between font-bold text-[#091C2C] pt-2 border-t-2 border-[#091C2C]">
                  <span>Total Capital Propio Desembolsado:</span>
                  <span className="font-mono text-sm">{formatCurrency(results.totalInitialInvestmentRequired, property.currency)}</span>
                </div>
              </div>
            </div>

            {/* Table 2: Financiamiento Bancario */}
            <div className="p-4 rounded-xl border border-[#DDD5C3] bg-white space-y-2">
              <h4 className="font-serif-title font-bold text-sm text-[#091C2C] pb-1 border-b border-[#DDD5C3]/40">
                2. Condiciones del Préstamo Hipotecario
              </h4>
              <div className="divide-y divide-[#DDD5C3]/30 text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Modalidad:</span>
                  <span className="font-semibold text-[#091C2C] uppercase">{property.financingMode}</span>
                </div>
                {property.financingMode === 'hipoteca' ? (
                  <>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[#6F6456]">Saldo de préstamo:</span>
                      <span className="font-mono font-bold text-[#091C2C]">{formatCurrency(results.loanAmount, property.currency)}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[#6F6456]">Plazo / TEA:</span>
                      <span className="font-mono text-[#091C2C]">{property.loanTermYears} años · {property.teaPct}% TEA</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[#6F6456]">Cuota Capital + Intereses:</span>
                      <span className="font-mono text-[#091C2C]">{formatCurrency(results.monthlyAmortizationAndInterest, property.currency)}/m</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-[#6F6456]">Seguros Desgravamen + Inmueble:</span>
                      <span className="font-mono text-[#091C2C]">
                        {formatCurrency(results.monthlyDesgravamen + results.monthlyPropertyInsurance, property.currency)}/m
                      </span>
                    </div>
                    <div className="py-2 flex justify-between font-bold text-amber-900 pt-2 border-t-2 border-[#091C2C]">
                      <span>Cuota Total Mensual al Banco:</span>
                      <span className="font-mono text-sm">{formatCurrency(results.totalMonthlyMortgagePayment, property.currency)}/m</span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-[#6F6456]">
                    Compra 100% al contado sin cuota mensual bancaria.
                  </div>
                )}
              </div>
            </div>

            {/* Table 3: Ingresos y Gastos de Operación */}
            <div className="p-4 rounded-xl border border-[#DDD5C3] bg-white space-y-2">
              <h4 className="font-serif-title font-bold text-sm text-[#091C2C] pb-1 border-b border-[#DDD5C3]/40">
                3. Operación Mensual & Renta
              </h4>
              <div className="divide-y divide-[#DDD5C3]/30 text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Estrategia:</span>
                  <span className="font-semibold text-[#091C2C] capitalize">
                    {property.rentalStrategy === 'tradicional' ? 'Renta tradicional' : 'Airbnb / Corta estancia'}
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Ingreso Bruto Mensual:</span>
                  <span className="font-mono font-bold text-emerald-800">+{formatCurrency(results.grossMonthlyIncome, property.currency)}/m</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Pérdida por Vacancia:</span>
                  <span className="font-mono text-red-600">-{formatCurrency(results.vacancyLossMonthly, property.currency)}/m</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Mantenimiento Edificio:</span>
                  <span className="font-mono text-[#091C2C]">{formatCurrency(results.buildingMaintenanceMonthly, property.currency)}/m</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Predial & Arbitrios prorrateados:</span>
                  <span className="font-mono text-[#091C2C]">{formatCurrency(results.municipalTaxMonthly, property.currency)}/m</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">SUNAT Renta 1ra Cat (5%):</span>
                  <span className="font-mono text-[#091C2C]">{formatCurrency(results.sunatTaxMonthly, property.currency)}/m</span>
                </div>
                <div className="py-2 flex justify-between font-bold text-[#091C2C] pt-2 border-t-2 border-[#091C2C]">
                  <span>Ingreso Operativo Neto (NOI):</span>
                  <span className="font-mono text-sm">{formatCurrency(results.netOperatingIncomeMonthly, property.currency)}/m</span>
                </div>
              </div>
            </div>

            {/* Table 4: Diagnóstico y Salud */}
            <div className="p-4 rounded-xl border border-[#DDD5C3] bg-white space-y-2">
              <h4 className="font-serif-title font-bold text-sm text-[#091C2C] pb-1 border-b border-[#DDD5C3]/40">
                4. Dictamen Financiero & Semáforo de Salud
              </h4>
              <div className="divide-y divide-[#DDD5C3]/30 text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Veredicto del modelo:</span>
                  <span className="font-bold text-[#091C2C]">{results.healthScore.title}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Puntaje de Solidez:</span>
                  <span className="font-mono font-bold text-[#091C2C]">{results.healthScore.score} / 100</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Cobertura de Deuda (DSCR):</span>
                  <span className="font-mono text-[#091C2C]">
                    {results.debtServiceCoverageRatio ? `${results.debtServiceCoverageRatio}x` : 'N/A'}
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-[#6F6456]">Tiempo de Recuperación:</span>
                  <span className="font-mono text-[#091C2C]">
                    {results.paybackYears ? `${results.paybackYears} años` : 'N/A'}
                  </span>
                </div>
                <div className="py-2 flex justify-between font-bold pt-2 border-t-2 border-[#091C2C]">
                  <span>Flujo de Caja Neto Mensual:</span>
                  <span className={`font-mono text-sm ${results.netCashFlowMonthly >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                    {formatCurrency(results.netCashFlowMonthly, property.currency)}/m
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Legal and Technical Disclaimer */}
          <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3] text-[11px] text-[#6F6456] space-y-1">
            <p className="font-semibold text-[#091C2C]">
              Nota informativa sobre tributación y crédito en el Perú:
            </p>
            <p>
              El cálculo de Alcabala aplica la exoneración de las 10 primeras UIT (Ley de Tributación Municipal D. Leg. 776). La tasa de Impuesto a la Renta de 1ra Categoría para personas naturales corresponde al 5% del valor devengado (SUNAT). Los seguros y tasas bancarias son referenciales según las condiciones vigentes de las entidades del sistema financiero supervisadas por la SBS.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
