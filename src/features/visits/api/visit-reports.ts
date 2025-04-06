import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface VisitReportData {
  establishment_id: string;
  establishment_name: string;
  establishment_address: string;
  establishment_city: string;
  establishment_postal_code: string;
  establishment_category: string;
  establishment_types: string[];
  visit_id: string;
  visit_date: string;
  visit_type: string;
  consultant_id: string;
  contact_name: string;
  contact_role: string;
  contact_email?: string;
  contact_phone?: string;
  observations?: string;
  technical_verifications_done: boolean;
  technical_verifications_notes?: string;
  prescriptions_reviewed: boolean;
  prescriptions_notes?: string;
  safety_register_checked: boolean;
  safety_register_notes?: string;
  staff_training_checked: boolean;
  staff_training_notes?: string;
  conclusion: string;
  actions_needed?: string;
  next_visit_date?: string;
  next_visit_type?: string;
}

export async function generateVisitReport(data: VisitReportData) {
  try {
    // Get consultant information
    const { data: consultant } = await supabase
      .from('users')
      .select('full_name, email, phone')
      .eq('id', data.consultant_id)
      .single();
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add header with logo
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("RAPPORT DE VISITE", 105, 20, { align: "center" });
    
    // Add establishment information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("ÉTABLISSEMENT", 20, 40);
    doc.setFontSize(10);
    doc.text(`Nom: ${data.establishment_name}`, 20, 50);
    doc.text(`Adresse: ${data.establishment_address}`, 20, 55);
    doc.text(`${data.establishment_postal_code} ${data.establishment_city}`, 20, 60);
    doc.text(`Catégorie: ${data.establishment_category}`, 20, 65);
    doc.text(`Type: ${data.establishment_types.join(', ')}`, 20, 70);
    
    // Add visit information
    doc.setFontSize(12);
    doc.text("VISITE", 120, 40);
    doc.setFontSize(10);
    
    const visitDate = format(new Date(data.visit_date), 'dd MMMM yyyy', { locale: fr });
    doc.text(`Date: ${visitDate}`, 120, 50);
    
    const visitTypeLabels: Record<string, string> = {
      'first_visit': 'Première visite',
      'second_visit': 'Seconde visite',
      'commission': 'Commission',
      'reminder': 'Visite de rappel'
    };
    
    doc.text(`Type: ${visitTypeLabels[data.visit_type] || data.visit_type}`, 120, 55);
    
    // Add contact information
    doc.setFontSize(12);
    doc.text("CONTACT", 20, 85);
    doc.setFontSize(10);
    doc.text(`Nom: ${data.contact_name}`, 20, 95);
    doc.text(`Fonction: ${data.contact_role}`, 20, 100);
    if (data.contact_email) {
      doc.text(`Email: ${data.contact_email}`, 20, 105);
    }
    if (data.contact_phone) {
      doc.text(`Téléphone: ${data.contact_phone}`, 20, 110);
    }
    
    // Add consultant information
    doc.setFontSize(12);
    doc.text("CONSULTANT", 120, 85);
    doc.setFontSize(10);
    if (consultant) {
      doc.text(`Nom: ${consultant.full_name}`, 120, 95);
      if (consultant.email) {
        doc.text(`Email: ${consultant.email}`, 120, 100);
      }
      if (consultant.phone) {
        doc.text(`Téléphone: ${consultant.phone}`, 120, 105);
      }
    }
    
    // Add observations
    doc.setFontSize(12);
    doc.text("OBSERVATIONS", 20, 125);
    doc.setFontSize(10);
    
    if (data.observations) {
      const splitObservations = doc.splitTextToSize(data.observations, 170);
      doc.text(splitObservations, 20, 135);
      
      // Calculate the height of the observations text
      const observationsHeight = splitObservations.length * 5;
      
      // Add verifications section
      doc.setFontSize(12);
      doc.text("VÉRIFICATIONS", 20, 135 + observationsHeight + 10);
      doc.setFontSize(10);
      
      // Create a table for verifications
      const verificationsData = [
        ['Vérifications techniques', data.technical_verifications_done ? 'Oui' : 'Non', data.technical_verifications_notes || ''],
        ['Registre de sécurité', data.safety_register_checked ? 'Oui' : 'Non', data.safety_register_notes || ''],
        ['Formation du personnel', data.staff_training_checked ? 'Oui' : 'Non', data.staff_training_notes || ''],
        ['Prescriptions', data.prescriptions_reviewed ? 'Oui' : 'Non', data.prescriptions_notes || '']
      ];
      
      doc.autoTable({
        startY: 135 + observationsHeight + 15,
        head: [['Élément vérifié', 'Effectué', 'Observations']],
        body: verificationsData,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 20 },
          2: { cellWidth: 100 }
        }
      });
      
      // Add conclusion
      const tableHeight = doc.autoTable.previous.finalY || 0;
      
      doc.setFontSize(12);
      doc.text("CONCLUSION", 20, tableHeight + 15);
      doc.setFontSize(10);
      
      const splitConclusion = doc.splitTextToSize(data.conclusion, 170);
      doc.text(splitConclusion, 20, tableHeight + 25);
      
      // Calculate the height of the conclusion text
      const conclusionHeight = splitConclusion.length * 5;
      
      // Add actions needed if any
      if (data.actions_needed) {
        doc.setFontSize(12);
        doc.text("ACTIONS À MENER", 20, tableHeight + 25 + conclusionHeight + 10);
        doc.setFontSize(10);
        
        const splitActions = doc.splitTextToSize(data.actions_needed, 170);
        doc.text(splitActions, 20, tableHeight + 25 + conclusionHeight + 20);
        
        // Calculate the height of the actions text
        const actionsHeight = splitActions.length * 5;
        
        // Add next visit information if any
        if (data.next_visit_date) {
          doc.setFontSize(12);
          doc.text("PROCHAINE VISITE", 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 10);
          doc.setFontSize(10);
          
          const nextVisitDate = format(new Date(data.next_visit_date), 'dd MMMM yyyy', { locale: fr });
          doc.text(`Date: ${nextVisitDate}`, 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 20);
          
          if (data.next_visit_type) {
            doc.text(`Type: ${visitTypeLabels[data.next_visit_type] || data.next_visit_type}`, 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 25);
          }
        }
      } else if (data.next_visit_date) {
        // If no actions but next visit is set
        doc.setFontSize(12);
        doc.text("PROCHAINE VISITE", 20, tableHeight + 25 + conclusionHeight + 10);
        doc.setFontSize(10);
        
        const nextVisitDate = format(new Date(data.next_visit_date), 'dd MMMM yyyy', { locale: fr });
        doc.text(`Date: ${nextVisitDate}`, 20, tableHeight + 25 + conclusionHeight + 20);
        
        if (data.next_visit_type) {
          doc.text(`Type: ${visitTypeLabels[data.next_visit_type] || data.next_visit_type}`, 20, tableHeight + 25 + conclusionHeight + 25);
        }
      }
    } else {
      // If no observations, start verifications section higher
      doc.setFontSize(12);
      doc.text("VÉRIFICATIONS", 20, 135);
      doc.setFontSize(10);
      
      // Create a table for verifications
      const verificationsData = [
        ['Vérifications techniques', data.technical_verifications_done ? 'Oui' : 'Non', data.technical_verifications_notes || ''],
        ['Registre de sécurité', data.safety_register_checked ? 'Oui' : 'Non', data.safety_register_notes || ''],
        ['Formation du personnel', data.staff_training_checked ? 'Oui' : 'Non', data.staff_training_notes || ''],
        ['Prescriptions', data.prescriptions_reviewed ? 'Oui' : 'Non', data.prescriptions_notes || '']
      ];
      
      doc.autoTable({
        startY: 140,
        head: [['Élément vérifié', 'Effectué', 'Observations']],
        body: verificationsData,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 20 },
          2: { cellWidth: 100 }
        }
      });
      
      // Add conclusion
      const tableHeight = doc.autoTable.previous.finalY || 0;
      
      doc.setFontSize(12);
      doc.text("CONCLUSION", 20, tableHeight + 15);
      doc.setFontSize(10);
      
      const splitConclusion = doc.splitTextToSize(data.conclusion, 170);
      doc.text(splitConclusion, 20, tableHeight + 25);
      
      // Calculate the height of the conclusion text
      const conclusionHeight = splitConclusion.length * 5;
      
      // Add actions needed if any
      if (data.actions_needed) {
        doc.setFontSize(12);
        doc.text("ACTIONS À MENER", 20, tableHeight + 25 + conclusionHeight + 10);
        doc.setFontSize(10);
        
        const splitActions = doc.splitTextToSize(data.actions_needed, 170);
        doc.text(splitActions, 20, tableHeight + 25 + conclusionHeight + 20);
        
        // Calculate the height of the actions text
        const actionsHeight = splitActions.length * 5;
        
        // Add next visit information if any
        if (data.next_visit_date) {
          doc.setFontSize(12);
          doc.text("PROCHAINE VISITE", 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 10);
          doc.setFontSize(10);
          
          const nextVisitDate = format(new Date(data.next_visit_date), 'dd MMMM yyyy', { locale: fr });
          doc.text(`Date: ${nextVisitDate}`, 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 20);
          
          if (data.next_visit_type) {
            doc.text(`Type: ${visitTypeLabels[data.next_visit_type] || data.next_visit_type}`, 20, tableHeight + 25 + conclusionHeight + 20 + actionsHeight + 25);
          }
        }
      } else if (data.next_visit_date) {
        // If no actions but next visit is set
        doc.setFontSize(12);
        doc.text("PROCHAINE VISITE", 20, tableHeight + 25 + conclusionHeight + 10);
        doc.setFontSize(10);
        
        const nextVisitDate = format(new Date(data.next_visit_date), 'dd MMMM yyyy', { locale: fr });
        doc.text(`Date: ${nextVisitDate}`, 20, tableHeight + 25 + conclusionHeight + 20);
        
        if (data.next_visit_type) {
          doc.text(`Type: ${visitTypeLabels[data.next_visit_type] || data.next_visit_type}`, 20, tableHeight + 25 + conclusionHeight + 25);
        }
      }
    }
    
    // Add footer with date and page number
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const today = format(new Date(), 'dd/MM/yyyy', { locale: fr });
      doc.text(`Généré le ${today} - Page ${i} sur ${totalPages}`, 105, 285, { align: "center" });
    }
    
    // Save the report
    const reportName = `Rapport_Visite_${data.establishment_name.replace(/\s+/g, '_')}_${format(new Date(data.visit_date), 'yyyy-MM-dd')}.pdf`;
    
    // Save the report to Supabase Storage
    const { data: fileData, error } = await supabase.storage
      .from('visit_reports')
      .upload(`${data.establishment_id}/${reportName}`, doc.output('blob'), {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('visit_reports')
      .getPublicUrl(`${data.establishment_id}/${reportName}`);
    
    const reportUrl = publicUrlData.publicUrl;
    
    // Save the report metadata to the database
    const { error: dbError } = await supabase
      .from('visit_reports')
      .insert({
        visit_id: data.visit_id,
        establishment_id: data.establishment_id,
        consultant_id: data.consultant_id,
        report_url: reportUrl,
        report_date: new Date().toISOString(),
        report_type: 'visit',
        file_path: `${data.establishment_id}/${reportName}`
      });
    
    if (dbError) {
      throw dbError;
    }
    
    // Update the visit with the report URL
    const { error: visitUpdateError } = await supabase
      .from('visits')
      .update({
        report_url: reportUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.visit_id);
    
    if (visitUpdateError) {
      throw visitUpdateError;
    }
    
    // Download the PDF
    doc.save(reportName);
    
    return { success: true, reportUrl };
  } catch (error) {
    console.error("Error generating visit report:", error);
    throw error;
  }
}