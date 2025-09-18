import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Note } from '../types';

export class ExportService {
  /**
   * Export a note as PDF
   */
  static async exportNoteToPDF(note: Note): Promise<void> {
    try {
      // Create a temporary container for the note content
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      exportContainer.style.padding = '40px';
      exportContainer.style.backgroundColor = 'white';
      exportContainer.style.color = 'black';
      exportContainer.style.fontFamily = 'Arial, sans-serif';
      exportContainer.style.lineHeight = '1.6';

      // Create the note content HTML
      exportContainer.innerHTML = `
        <div style="margin-bottom: 30px; border-bottom: 2px solid #3f51b5; padding-bottom: 20px;">
          <h1 style="color: #3f51b5; font-size: 28px; margin: 0; font-weight: bold;">
            ${note.title}
          </h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
            Créé le ${new Date(note.createdAt).toLocaleDateString('fr-FR')} • 
            Modifié le ${new Date(note.updatedAt).toLocaleDateString('fr-FR')}
          </p>
          ${note.tags && note.tags.length > 0 ? `
            <div style="margin-top: 15px;">
              ${note.tags.map(tag => `
                <span style="
                  display: inline-block;
                  background: ${tag.colorHex};
                  color: white;
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  margin-right: 8px;
                  margin-bottom: 4px;
                ">
                  ${tag.name}
                </span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div style="font-size: 16px; line-height: 1.8;">
          ${note.contentHtml || '<p style="color: #999; font-style: italic;">Note vide</p>'}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          Exporté depuis Portfolio v3 - ${new Date().toLocaleDateString('fr-FR')}
        </div>
      `;

      document.body.appendChild(exportContainer);

      // Convert to canvas
      const canvas = await html2canvas(exportContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });

      // Remove temporary container
      document.body.removeChild(exportContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  }

  /**
   * Export a note as PNG image
   */
  static async exportNoteToPNG(note: Note): Promise<void> {
    try {
      // Create a temporary container for the note content
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '800px';
      exportContainer.style.padding = '40px';
      exportContainer.style.backgroundColor = 'white';
      exportContainer.style.color = 'black';
      exportContainer.style.fontFamily = 'Arial, sans-serif';
      exportContainer.style.lineHeight = '1.6';
      exportContainer.style.borderRadius = '12px';
      exportContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';

      // Create the note content HTML
      exportContainer.innerHTML = `
        <div style="margin-bottom: 30px; border-bottom: 2px solid #3f51b5; padding-bottom: 20px;">
          <h1 style="color: #3f51b5; font-size: 32px; margin: 0; font-weight: bold;">
            ${note.title}
          </h1>
          <p style="color: #666; margin: 15px 0 0 0; font-size: 16px;">
            📅 Créé le ${new Date(note.createdAt).toLocaleDateString('fr-FR')} • 
            ✏️ Modifié le ${new Date(note.updatedAt).toLocaleDateString('fr-FR')}
          </p>
          ${note.tags && note.tags.length > 0 ? `
            <div style="margin-top: 20px;">
              ${note.tags.map(tag => `
                <span style="
                  display: inline-block;
                  background: ${tag.colorHex};
                  color: white;
                  padding: 6px 16px;
                  border-radius: 16px;
                  font-size: 14px;
                  margin-right: 10px;
                  margin-bottom: 6px;
                  font-weight: 500;
                ">
                  ${tag.name}
                </span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div style="font-size: 18px; line-height: 1.8;">
          ${note.contentHtml || '<p style="color: #999; font-style: italic;">Note vide</p>'}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #999; text-align: center;">
          📝 Exporté depuis Portfolio v3 - ${new Date().toLocaleDateString('fr-FR')}
        </div>
      `;

      document.body.appendChild(exportContainer);

      // Convert to canvas
      const canvas = await html2canvas(exportContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });

      // Remove temporary container
      document.body.removeChild(exportContainer);

      // Create download link
      const link = document.createElement('a');
      link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Erreur lors de l\'export PNG:', error);
      alert('Erreur lors de l\'export PNG. Veuillez réessayer.');
    }
  }

  /**
   * Export all notes as a combined PDF
   */
  static async exportAllNotesToPDF(notes: Note[]): Promise<void> {
    if (notes.length === 0) {
      alert('Aucune note à exporter.');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let isFirstPage = true;

      for (const note of notes) {
        if (!isFirstPage) {
          pdf.addPage();
        }

        // Add note title
        pdf.setFontSize(20);
        pdf.setTextColor(63, 81, 181); // Primary color
        pdf.text(note.title, 20, 30);

        // Add note metadata
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Créé: ${new Date(note.createdAt).toLocaleDateString('fr-FR')}`, 20, 40);
        pdf.text(`Modifié: ${new Date(note.updatedAt).toLocaleDateString('fr-FR')}`, 120, 40);

        // Add note content (simplified - remove HTML tags)
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        const content = note.contentHtml?.replace(/<[^>]*>/g, '') || 'Note vide';
        const lines = pdf.splitTextToSize(content, 170);
        pdf.text(lines, 20, 55);

        isFirstPage = false;
      }

      // Download the PDF
      const fileName = `Mes_Notes_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  }
}
