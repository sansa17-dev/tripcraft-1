/**
 * PDF generation service for travel itineraries
 * Creates downloadable PDF files from generated itineraries
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedItinerary } from '../types';

/**
 * Generates and downloads a PDF of the itinerary
 */
export async function downloadItineraryAsPDF(itinerary: GeneratedItinerary): Promise<void> {
  try {
    // Create a temporary container for PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // A4 width
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '15mm';
    pdfContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    pdfContainer.style.fontSize = '11px';
    pdfContainer.style.lineHeight = '1.4';
    pdfContainer.style.color = '#1f2937';

    // Generate HTML content for PDF
    pdfContainer.innerHTML = generatePDFHTML(itinerary);
    
    // Add to DOM temporarily
    document.body.appendChild(pdfContainer);

    // Convert to canvas with higher quality
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: Math.max(1123, pdfContainer.scrollHeight * 2)
    });

    // Remove temporary container
    document.body.removeChild(pdfContainer);

    // Create PDF with better compression
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const fileName = `${itinerary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Generates HTML content for PDF rendering
 */
function generatePDFHTML(itinerary: GeneratedItinerary): string {
  return `
    <div style="max-width: 100%; margin: 0;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #2563eb;">
        <h1 style="color: #1e40af; font-size: 24px; margin: 0 0 8px 0; font-weight: 700; letter-spacing: -0.5px;">
          ${itinerary.title}
        </h1>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 10px; font-size: 10px; color: #6b7280;">
          <span><strong>📍</strong> ${itinerary.destination}</span>
          <span><strong>⏱️</strong> ${itinerary.duration}</span>
          <span><strong>💰</strong> ${itinerary.totalBudget}</span>
        </div>
      </div>

      <!-- Overview -->
      <div style="margin-bottom: 20px; padding: 12px; background-color: #f8fafc; border-radius: 6px; border-left: 3px solid #2563eb;">
        <h2 style="color: #1e40af; font-size: 14px; margin: 0 0 6px 0; font-weight: 600;">Overview</h2>
        <p style="margin: 0; line-height: 1.5; color: #374151; font-size: 10px;">${itinerary.overview}</p>
      </div>

      <!-- Daily Itinerary -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; font-size: 16px; margin: 0 0 15px 0; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
          📅 Daily Itinerary
        </h2>
        
        ${itinerary.days.map(day => `
          <div style="margin-bottom: 18px; page-break-inside: avoid;">
            <!-- Day Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px 12px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 6px; color: white;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; font-size: 12px;">Day ${day.day}</span>
                <span style="font-size: 10px; opacity: 0.9;">${new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              ${day.estimatedCost ? `
                <span style="background-color: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 500;">
                  ${day.estimatedCost}
                </span>
              ` : ''}
            </div>

            <div style="padding-left: 12px;">
              <!-- Activities -->
              <div style="margin-bottom: 12px;">
                <h4 style="color: #374151; font-size: 11px; margin: 0 0 6px 0; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                  <span style="color: #2563eb;">🎯</span> Activities
                </h4>
                <div style="display: grid; gap: 4px;">
                  ${day.activities.map((activity, index) => `
                    <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 10px; color: #4b5563;">
                      <span style="color: #6b7280; font-weight: 500; min-width: 16px;">${index === 0 ? 'AM' : index === 1 ? 'PM' : 'EVE'}</span>
                      <span style="line-height: 1.4;">${activity}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Meals & Accommodation in compact grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                <!-- Meals -->
                ${(day.meals.breakfast || day.meals.lunch || day.meals.dinner) ? `
                  <div>
                    <h4 style="color: #374151; font-size: 11px; margin: 0 0 6px 0; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                      <span style="color: #2563eb;">🍽️</span> Meals
                    </h4>
                    <div style="font-size: 9px; color: #6b7280; line-height: 1.3;">
                      ${day.meals.breakfast ? `<div><strong>B:</strong> ${day.meals.breakfast}</div>` : ''}
                      ${day.meals.lunch ? `<div><strong>L:</strong> ${day.meals.lunch}</div>` : ''}
                      ${day.meals.dinner ? `<div><strong>D:</strong> ${day.meals.dinner}</div>` : ''}
                    </div>
                  </div>
                ` : '<div></div>'}

                <!-- Accommodation -->
                ${day.accommodation ? `
                  <div>
                    <h4 style="color: #374151; font-size: 11px; margin: 0 0 6px 0; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                      <span style="color: #2563eb;">🏨</span> Stay
                    </h4>
                    <div style="font-size: 9px; color: #6b7280; line-height: 1.3;">
                      ${day.accommodation}
                    </div>
                  </div>
                ` : '<div></div>'}
              </div>

              <!-- Notes -->
              ${day.notes ? `
                <div style="background-color: #fef3c7; padding: 6px 8px; border-radius: 4px; border-left: 2px solid #f59e0b; margin-top: 8px;">
                  <div style="color: #92400e; font-size: 9px; font-style: italic; line-height: 1.3;">
                    <strong>💡</strong> ${day.notes}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Travel Tips -->
      ${itinerary.tips && itinerary.tips.length > 0 ? `
        <div style="margin-bottom: 20px; padding: 12px; background-color: #fef3c7; border-radius: 6px; border-left: 3px solid #f59e0b; page-break-inside: avoid;">
          <h2 style="color: #92400e; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">💡 Essential Tips</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px;">
            ${itinerary.tips.map(tip => `
              <div style="font-size: 9px; color: #78350f; line-height: 1.4; display: flex; align-items: flex-start; gap: 4px;">
                <span style="color: #f59e0b; font-weight: bold; min-width: 8px;">•</span>
                <span>${tip}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 9px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>TripCraft</strong> - AI-Powered Travel Planning</span>
          <span>Generated on ${new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}</span>
        </div>
      </div>
    </div>
  `;
}