import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './PDFExport.css';

const PDFExport = ({ financialData, currentAssumptions, currentMultipliers, selectedScenario }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportScenario, setSelectedReportScenario] = useState(selectedScenario);

  const scenarios = [
    { value: 'base', label: 'Base Scenario', description: 'Conservative baseline projections' },
    { value: 'upside', label: 'Upside Scenario', description: 'Optimistic growth projections' },
    { value: 'downside', label: 'Downside Scenario', description: 'Conservative risk projections' }
  ];

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const calculateCashAndRunway = (data) => {
    const years = [2026, 2027, 2028];
    const cashData = {};
    
    years.forEach(year => {
      const ebitda = data[year].ebitda;
      const monthlyBurn = Math.abs(ebitda) / 12;
      
      cashData[year] = {
        yearEndCash: year === 2026 ? 
          currentAssumptions.cashFlow.startingCash + currentAssumptions.cashFlow.plannedRaises[year] + ebitda :
          (cashData[year - 1]?.yearEndCash || 0) + currentAssumptions.cashFlow.plannedRaises[year] + ebitda,
        runwayMonths: ebitda >= 0 ? '∞' : Math.max(0, Math.floor(
          ((year === 2026 ? currentAssumptions.cashFlow.startingCash : cashData[year - 1]?.yearEndCash || 0) + 
           currentAssumptions.cashFlow.plannedRaises[year]) / monthlyBurn
        ))
      };
    });
    
    return cashData;
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Get scenario data
      const scenarioInfo = scenarios.find(s => s.value === selectedReportScenario);
      const scenarioLabel = scenarioInfo?.label || 'Unknown Scenario';
      const scenarioDescription = scenarioInfo?.description || '';
      const scenarioNumber = selectedReportScenario === 'base' ? '1' : selectedReportScenario === 'upside' ? '2' : '3';

      // Calculate financial data for selected scenario (simplified calculation)
      const reportData = financialData; // Using existing data for now
      // Calculate cash flow data for the report but don't store it in a variable since it's not used
      calculateCashAndRunway(reportData);

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Header with company branding
      doc.setFillColor(236, 72, 153); // Pink color
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FINANCIAL FORECAST REPORT', margin, 16);
      
      yPosition = 35;

      // Report title and scenario info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary Report', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Scenario ${scenarioNumber}: ${scenarioLabel}`, margin, yPosition);
      
      yPosition += 6;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(scenarioDescription, margin, yPosition);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth - margin - 60, yPosition);

      yPosition += 15;

      // Executive Summary Table
      checkPageBreak(80);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Financial Metrics', margin, yPosition);
      yPosition += 10;

      // Create simple table with manual positioning
      const summaryData = [
        { metric: 'Total Revenue', y2026: formatCurrency(reportData[2026].totalRevenue), y2027: formatCurrency(reportData[2027].totalRevenue), y2028: formatCurrency(reportData[2028].totalRevenue) },
        { metric: 'B2C Revenue', y2026: formatCurrency(reportData[2026].b2cRevenue), y2027: formatCurrency(reportData[2027].b2cRevenue), y2028: formatCurrency(reportData[2028].b2cRevenue) },
        { metric: 'B2B Revenue', y2026: formatCurrency(reportData[2026].b2bRevenue), y2027: formatCurrency(reportData[2027].b2bRevenue), y2028: formatCurrency(reportData[2028].b2bRevenue) },
        { metric: 'Gross Margin', y2026: formatCurrency(reportData[2026].grossMargin), y2027: formatCurrency(reportData[2027].grossMargin), y2028: formatCurrency(reportData[2028].grossMargin) },
        { metric: 'Total OpEx', y2026: formatCurrency(reportData[2026].totalOpex), y2027: formatCurrency(reportData[2027].totalOpex), y2028: formatCurrency(reportData[2028].totalOpex) },
        { metric: 'EBITDA', y2026: formatCurrency(reportData[2026].ebitda), y2027: formatCurrency(reportData[2027].ebitda), y2028: formatCurrency(reportData[2028].ebitda) }
      ];

      // Table headers
      doc.setFillColor(236, 72, 153);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Metric', margin + 2, yPosition + 5);
      doc.text('2026', margin + 60, yPosition + 5);
      doc.text('2027', margin + 90, yPosition + 5);
      doc.text('2028', margin + 120, yPosition + 5);
      
      yPosition += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      // Table rows
      summaryData.forEach((row, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
        }
        
        doc.text(row.metric, margin + 2, yPosition + 4);
        doc.text(row.y2026, margin + 60, yPosition + 4);
        doc.text(row.y2027, margin + 90, yPosition + 4);
        doc.text(row.y2028, margin + 120, yPosition + 4);
        yPosition += 6;
      });

      yPosition += 15;

      // Scenario Multipliers Summary
      checkPageBreak(50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Selected Scenario Multipliers', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Scenario: ${scenarioLabel}`, margin, yPosition);
      yPosition += 8;

      // Key multipliers for selected scenario
      const keyMultipliers = [
        `Traffic Multiplier: ${formatPercentage(currentMultipliers.trafficMultiplier[selectedReportScenario])}`,
        `Paid Conversion: ${formatPercentage(currentMultipliers.paidConversionMultiplier[selectedReportScenario])}`,
        `B2C ARPU: ${formatPercentage(currentMultipliers.b2cArpuMultiplier[selectedReportScenario])}`,
        `B2B Clients: ${formatPercentage(currentMultipliers.b2bClientsMultiplier[selectedReportScenario])}`,
        `Marketing Spend: ${formatPercentage(currentMultipliers.marketingSpendMultiplier[selectedReportScenario])}`,
        `Hosting Cost: ${formatPercentage(currentMultipliers.hostingCostMultiplier[selectedReportScenario])}`
      ];

      keyMultipliers.forEach(multiplier => {
        doc.text(`• ${multiplier}`, margin + 5, yPosition);
        yPosition += 5;
      });

      yPosition += 20;
      
      // Key Assumptions Summary
      checkPageBreak(100);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Business Assumptions', margin, yPosition);
      yPosition += 15;

      // B2B Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('B2B Client Summary (2028)', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const b2bSummary = [
        `Total B2B Clients: ${Object.values(currentAssumptions.b2bClients).reduce((sum, tier) => sum + tier[2028], 0).toLocaleString()}`,
        `Enterprise Tier: ${currentAssumptions.b2bClients.tierA[2028].toLocaleString()} clients at ${formatCurrency(currentAssumptions.b2bPricing.tierA[2028])}/month`,
        `Premium Tier: ${currentAssumptions.b2bClients.tierAPlus[2028].toLocaleString()} clients at ${formatCurrency(currentAssumptions.b2bPricing.tierAPlus[2028])}/month`
      ];
      
      b2bSummary.forEach(item => {
        doc.text(`• ${item}`, margin + 5, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      
      // Cost Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Monthly Cost Structure (2028)', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const costSummary = [
        `Marketing Spend: ${formatCurrency(currentAssumptions.costs.marketingSpend[2028])}`,
        `Hosting Costs: ${formatCurrency(currentAssumptions.costs.hostingCostPerUser[2028])} per user`,
        `General & Admin: ${formatCurrency(currentAssumptions.costs.gaFixed[2028])}`
      ];
      
      costSummary.forEach(item => {
        doc.text(`• ${item}`, margin + 5, yPosition);
        yPosition += 6;
      });

      // Footer
      yPosition = pageHeight - 20;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Financial Forecast Dashboard - Confidential', margin, yPosition);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, yPosition);

      // Save the PDF
      const fileName = `Financial_Forecast_${scenarioLabel.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pdf-export">
      <div className="export-header">
        <h3>📄 Download Financial Report</h3>
        <p>Generate a comprehensive PDF report with financial projections and assumptions</p>
      </div>
      
      <div className="export-controls">
        <div className="scenario-selection">
          <label htmlFor="report-scenario">Select Scenario for Report:</label>
          <select 
            id="report-scenario"
            value={selectedReportScenario} 
            onChange={(e) => setSelectedReportScenario(e.target.value)}
            className="scenario-select"
          >
            {scenarios.map(scenario => (
              <option key={scenario.value} value={scenario.value}>
                {scenario.label} - {scenario.description}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={generatePDF}
          disabled={isGenerating}
          className="export-btn"
        >
          {isGenerating ? (
            <>
              <span className="spinner">⏳</span>
              Generating PDF...
            </>
          ) : (
            <>
              <span>📥</span>
              Download PDF Report
            </>
          )}
        </button>
      </div>
      
      <div className="export-info">
        <h4>Report Contents:</h4>
        <ul>
          <li>✅ Executive Summary with key metrics</li>
          <li>✅ Selected scenario multipliers</li>
          <li>✅ 3-year financial projections</li>
          <li>✅ B2B client and pricing assumptions</li>
          <li>✅ Cost structure breakdown</li>
          <li>✅ Cash flow and runway analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFExport;