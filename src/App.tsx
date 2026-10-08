import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StepNavigation } from './components/StepNavigation';
import { Step1Property } from './components/Step1Property';
import { Step2Mortgage } from './components/Step2Mortgage';
import { Step3Rental } from './components/Step3Rental';
import { Step4Results } from './components/Step4Results';
import { DashboardOverview } from './components/DashboardOverview';
import { SensitivitySimulator } from './components/SensitivitySimulator';
import { ComparisonView } from './components/ComparisonView';
import { ExportModal } from './components/ExportModal';
import { InvestmentRangeModal } from './components/InvestmentRangeModal';

import { 
  PropertyData, 
  Currency 
} from './types/realEstate';
import { 
  DEFAULT_PROPERTIES, 
  SAMPLE_FICTITIOUS_PROPERTY,
  createCleanBlankProperty,
  loadSavedProperties, 
  savePropertiesToStorage,
  getActivePropertyId,
  setActivePropertyId
} from './data/defaultProperties';
import { calculateRealEstateMetrics } from './utils/realEstateCalculations';

export default function App() {
  const [properties, setProperties] = useState<PropertyData[]>(() => loadSavedProperties());
  const [activeId, setActiveId] = useState<string>(() => getActivePropertyId());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'wizard' | 'dashboard' | 'comparison'>('wizard');
  const [showSensitivity, setShowSensitivity] = useState<boolean>(false);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showRangoInversion, setShowRangoInversion] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    savePropertiesToStorage(properties);
  }, [properties]);

  useEffect(() => {
    setActivePropertyId(activeId);
  }, [activeId]);

  // Current Property
  const currentProperty = useMemo(() => {
    const found = properties.find(p => p.id === activeId);
    return found || properties[0] || DEFAULT_PROPERTIES[0];
  }, [properties, activeId]);

  // Real-time calculation results
  const results = useMemo(() => {
    return calculateRealEstateMetrics(currentProperty);
  }, [currentProperty]);

  // Update property attributes
  const handleUpdateProperty = (updated: Partial<PropertyData>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === currentProperty.id) {
        return {
          ...p,
          ...updated,
          updatedAt: Date.now(),
        };
      }
      return p;
    }));
  };

  // Formulario Limpio (Tus datos) - Exactly as requested!
  const handleFormularioLimpio = () => {
    const cleanProp = createCleanBlankProperty();
    setProperties(prev => [cleanProp, ...prev]);
    setActiveId(cleanProp.id);
    setCurrentStep(1);
    setActiveTab('wizard');
    showToast('✨ Formulario limpio listo para ingresar tus datos reales');
  };

  // Cargar ejemplo ficticio
  const handleCargarEjemploFicticio = () => {
    const exampleId = `prop-ejemplo-${Date.now()}`;
    const exampleProp: PropertyData = {
      ...SAMPLE_FICTITIOUS_PROPERTY,
      id: exampleId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProperties(prev => [exampleProp, ...prev]);
    setActiveId(exampleId);
    setCurrentStep(1);
    setActiveTab('wizard');
    showToast('📊 Ejemplo ficticio cargado (Proyecto Salaverry - Jesús María)');
  };

  // Convert currency smoothly
  const handleCurrencyToggle = (newCurrency: Currency) => {
    if (newCurrency === currentProperty.currency) return;

    const rate = currentProperty.exchangeRate || 3.75;
    const factor = newCurrency === 'PEN' ? rate : (1 / rate);

    const converted: Partial<PropertyData> = {
      currency: newCurrency,
      purchasePrice: Math.round(currentProperty.purchasePrice * factor),
      notaryFee: Math.round(currentProperty.notaryFee * factor),
      sunarpFee: Math.round(currentProperty.sunarpFee * factor),
      traditionalRentMonthly: Math.round(currentProperty.traditionalRentMonthly * factor),
      airbnbPricePerNight: Math.round(currentProperty.airbnbPricePerNight * factor),
      airbnbCleaningFeePerMonth: Math.round(currentProperty.airbnbCleaningFeePerMonth * factor),
      maintenanceFeeMonthly: Math.round(currentProperty.maintenanceFeeMonthly * factor),
      propertyTaxAndArbitriosMonthly: Math.round(currentProperty.propertyTaxAndArbitriosMonthly * factor),
      utilitiesMonthly: Math.round(currentProperty.utilitiesMonthly * factor),
      extraInitialExpenses: currentProperty.extraInitialExpenses.map(item => ({
        ...item,
        amount: Math.round(item.amount * factor),
      })),
      customRecurringExpenses: currentProperty.customRecurringExpenses.map(item => ({
        ...item,
        amount: Math.round(item.amount * factor),
      })),
    };

    handleUpdateProperty(converted);
  };

  // Update Exchange Rate
  const handleUpdateExchangeRate = (rate: number) => {
    handleUpdateProperty({ exchangeRate: rate });
  };

  // New Property
  const handleNewProperty = () => {
    const newProp = createCleanBlankProperty();
    newProp.title = `Inmueble ${properties.length + 1}`;
    setProperties(prev => [newProp, ...prev]);
    setActiveId(newProp.id);
    setCurrentStep(1);
    setActiveTab('wizard');
  };

  // Delete Property
  const handleDeleteProperty = (id: string) => {
    if (properties.length <= 1) return;
    const remaining = properties.filter(p => p.id !== id);
    setProperties(remaining);
    if (activeId === id) {
      setActiveId(remaining[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#081827] flex flex-col font-sans selection:bg-[#D8B66D]/30 selection:text-[#081827]">
      
      {/* Toast Alert Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081827] text-white border border-[#D8B66D] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar Matching Screenshot */}
      <Navbar
        currentProperty={currentProperty}
        properties={properties}
        onSelectProperty={setActiveId}
        onNewProperty={handleNewProperty}
        onFormularioLimpio={handleFormularioLimpio}
        onCargarEjemploFicticio={handleCargarEjemploFicticio}
        onOpenRangoInversion={() => setShowRangoInversion(true)}
        onDeleteProperty={handleDeleteProperty}
        onCurrencyToggle={handleCurrencyToggle}
        onUpdateExchangeRate={handleUpdateExchangeRate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExport(true)}
      />

      {/* Stepper Navigation Matching Screenshot (with Progress bar and Pendientes badge) */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        property={currentProperty}
        results={results}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Tab 1: Stepper Wizard */}
        {activeTab === 'wizard' && (
          <div>
            {currentStep === 1 && (
              <Step1Property
                property={currentProperty}
                results={results}
                onChange={handleUpdateProperty}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <Step2Mortgage
                property={currentProperty}
                results={results}
                onChange={handleUpdateProperty}
                onPrev={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3Rental
                property={currentProperty}
                results={results}
                onChange={handleUpdateProperty}
                onPrev={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && (
              <Step4Results
                property={currentProperty}
                results={results}
                onPrev={() => setCurrentStep(3)}
                onOpenSensitivity={() => setShowSensitivity(true)}
                onOpenExport={() => setShowExport(true)}
                onGoToComparison={() => setActiveTab('comparison')}
              />
            )}
          </div>
        )}

        {/* Tab 2: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <DashboardOverview
              property={currentProperty}
              results={results}
              onGoToStep={(step) => {
                setCurrentStep(step);
                setActiveTab('wizard');
              }}
              onOpenSensitivity={() => setShowSensitivity(true)}
              onOpenExport={() => setShowExport(true)}
            />

            {/* In Dashboard, show the comprehensive Step 4 full breakdown */}
            <Step4Results
              property={currentProperty}
              results={results}
              onPrev={() => {
                setCurrentStep(3);
                setActiveTab('wizard');
              }}
              onOpenSensitivity={() => setShowSensitivity(true)}
              onOpenExport={() => setShowExport(true)}
              onGoToComparison={() => setActiveTab('comparison')}
            />
          </div>
        )}

        {/* Tab 3: Comparison View */}
        {activeTab === 'comparison' && (
          <ComparisonView
            properties={properties}
            activePropertyId={activeId}
            onSelectProperty={setActiveId}
            onNewProperty={handleNewProperty}
            onDeleteProperty={handleDeleteProperty}
            onCloseComparison={() => setActiveTab('wizard')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#081827] text-[#DDD5C3] border-t border-[#D8B66D]/25 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-bold text-base text-[#F6F4EF]">
              PAVEL MASTER · Inversión Segura
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#D8B66D]/20 text-[#D8B66D] font-mono">
              Perú Real Estate
            </span>
          </div>

          <p className="text-center md:text-left text-[#DDD5C3]/70 max-w-xl">
            Calculadora de rentabilidad inmobiliaria adaptada al Perú. Ley de Tributación Municipal (Alcabala D. Leg. 776 con 10 UIT exoneradas), aranceles de Notaría y SUNARP, y metodología SBS para hipotecas.
          </p>

          <div className="text-right font-mono text-[11px] text-[#D8B66D]">
            Lima · Miraflores · Jesús María · San Isidro
          </div>
        </div>
      </footer>

      {/* Ficha: Rango de Inversión Modal */}
      {showRangoInversion && (
        <InvestmentRangeModal
          currency={currentProperty.currency}
          exchangeRate={currentProperty.exchangeRate}
          onClose={() => setShowRangoInversion(false)}
          onApplyBudget={(price) => {
            handleUpdateProperty({ purchasePrice: price });
            showToast(`Precio sugerido de ${price.toLocaleString()} aplicado`);
          }}
        />
      )}

      {/* Sensitivity Modal */}
      {showSensitivity && (
        <SensitivitySimulator
          property={currentProperty}
          baseResults={results}
          onClose={() => setShowSensitivity(false)}
        />
      )}

      {/* Export / Print Modal (Descargar PDF) */}
      {showExport && (
        <ExportModal
          property={currentProperty}
          results={results}
          onClose={() => setShowExport(false)}
        />
      )}

    </div>
  );
}
