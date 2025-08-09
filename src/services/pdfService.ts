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
    pdfContainer.style.padding = '20px';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.fontSize = '12px';
    pdfContainer.style.lineHeight = '1.4';
    pdfContainer.style.color = '#333';

    // Generate HTML content for PDF
    pdfContainer.innerHTML = generatePDFHTML(itinerary);
    
    // Add to DOM temporarily
    document.body.appendChild(pdfContainer);

    // Convert to canvas
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: Math.max(1123, pdfContainer.scrollHeight * 2) // A4 height minimum
    });

    // Remove temporary container
    document.body.removeChild(pdfContainer);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
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
    <div style="max-width: 100%; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3B82F6;">
        <h1 style="color: #1E40AF; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
          ${itinerary.title}
        </h1>
        <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 15px;">
          <div style="color: #6B7280; font-size: 14px;">
            <strong>📍 Destination:</strong> ${itinerary.destination}
          </div>
          <div style="color: #6B7280; font-size: 14px;">
            <strong>⏱️ Duration:</strong> ${itinerary.duration}
          </div>
          <div style="color: #6B7280; font-size: 14px;">
            <strong>💰 Budget:</strong> ${itinerary.totalBudget}
          </div>
        </div>
      </div>

      <!-- Overview -->
      <div style="margin-bottom: 30px; padding: 20px; background-color: #F8FAFC; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <h2 style="color: #1E40AF; font-size: 18px; margin: 0 0 10px 0;">Trip Overview</h2>
        <p style="margin: 0; line-height: 1.6; color: #374151;">${itinerary.overview}</p>
      </div>

      <!-- Daily Itinerary -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1E40AF; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #E5E7EB;">
          📅 Daily Itinerary
        </h2>
        
        ${itinerary.days.map(day => `
          <div style="margin-bottom: 25px; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; background-color: #FAFAFA;">
            <!-- Day Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #D1D5DB;">
              <div>
                <span style="background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                  Day ${day.day}
                </span>
                <span style="margin-left: 15px; color: #6B7280; font-weight: 500;">${day.date}</span>
              </div>
              ${day.estimatedCost ? `
                <span style="background-color: #10B981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                  ${day.estimatedCost}
                </span>
              ` : ''}
            </div>

            <!-- Activities -->
            <div style="margin-bottom: 15px;">
              <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">🎯 Activities</h4>
              <ul style="margin: 0; padding-left: 20px; color: #4B5563;">
                ${day.activities.map(activity => `
                  <li style="margin-bottom: 5px; line-height: 1.4;">${activity}</li>
                `).join('')}
              </ul>
            </div>

            <!-- Meals -->
            ${(day.meals.breakfast || day.meals.lunch || day.meals.dinner) ? `
              <div style="margin-bottom: 15px;">
                <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">🍽️ Meals</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                  ${day.meals.breakfast ? `
                    <div style="background-color: white; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB;">
                      <strong style="color: #6B7280; font-size: 12px;">Breakfast:</strong>
                      <div style="color: #374151; font-size: 12px; margin-top: 2px;">${day.meals.breakfast}</div>
                    </div>
                  ` : ''}
                  ${day.meals.lunch ? `
                    <div style="background-color: white; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB;">
                      <strong style="color: #6B7280; font-size: 12px;">Lunch:</strong>
                      <div style="color: #374151; font-size: 12px; margin-top: 2px;">${day.meals.lunch}</div>
                    </div>
                  ` : ''}
                  ${day.meals.dinner ? `
                    <div style="background-color: white; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB;">
                      <strong style="color: #6B7280; font-size: 12px;">Dinner:</strong>
                      <div style="color: #374151; font-size: 12px; margin-top: 2px;">${day.meals.dinner}</div>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Accommodation -->
            ${day.accommodation ? `
              <div style="margin-bottom: 15px;">
                <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">🏨 Accommodation</h4>
                <div style="background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #E5E7EB; color: #4B5563; font-size: 12px;">
                  ${day.accommodation}
                </div>
              </div>
            ` : ''}

            <!-- Notes -->
            ${day.notes ? `
              <div style="background-color: #EFF6FF; padding: 10px; border-radius: 4px; border-left: 3px solid #3B82F6;">
                <div style="color: #1E40AF; font-size: 12px; font-style: italic;">${day.notes}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Travel Tips -->
      ${itinerary.tips && itinerary.tips.length > 0 ? `
        <div style="margin-bottom: 30px; padding: 20px; background-color: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <h2 style="color: #92400E; font-size: 18px; margin: 0 0 15px 0;">💡 Travel Tips</h2>
          <ul style="margin: 0; padding-left: 20px; color: #78350F;">
            ${itinerary.tips.map(tip => `
              <li style="margin-bottom: 8px; line-height: 1.5;">${tip}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
        <p style="margin: 0;">Generated by TripCraft - AI-Powered Travel Planning</p>
        <p style="margin: 5px 0 0 0;">Created on ${new Date().toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
      </div>
    </div>
  `;
}