import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HCOProfile, DCRProfile } from '@/types/mdm';

export const exportToExcel = (data: any, filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToJSON = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportHCOToPDF = (hco: HCOProfile) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(33, 150, 243);
  doc.text('Healthcare Organization Profile', 14, 20);
  
  // Organization Name
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(hco.name, 14, 30);
  
  // Basic Information
  doc.setFontSize(12);
  doc.text('Basic Information', 14, 45);
  
  const basicInfo = [
    ['NPI ID', hco.npiId],
    ['MDM ID', hco.mdmId],
    ['Org ID', hco.orgId],
    ['Organization Type', hco.organizationType],
    ['Status', hco.status],
    ['Source', hco.source],
    ['Last Updated', hco.lastUpdated],
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [['Field', 'Value']],
    body: basicInfo,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] },
  });
  
  // Contact Information
  let finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Contact Information', 14, finalY);
  
  const contactInfo = [
    ['Email', hco.email],
    ['Phone', hco.phone],
    ['Address', `${hco.address.street}, ${hco.address.city}, ${hco.address.state} ${hco.address.zipCode}`],
  ];
  
  autoTable(doc, {
    startY: finalY + 5,
    head: [['Field', 'Value']],
    body: contactInfo,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] },
  });
  
  // Departments
  finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Departments', 14, finalY);
  doc.setFontSize(10);
  doc.text(hco.departments.join(', '), 14, finalY + 7, { maxWidth: 180 });
  
  // Accreditation
  finalY = finalY + 20;
  doc.setFontSize(12);
  doc.text('Accreditation', 14, finalY);
  doc.setFontSize(10);
  hco.accreditation.forEach((acc, idx) => {
    doc.text(`• ${acc}`, 14, finalY + 7 + (idx * 7));
  });
  
  // Identifiers
  finalY = finalY + 7 + (hco.accreditation.length * 7) + 10;
  if (finalY > 250) {
    doc.addPage();
    finalY = 20;
  }
  doc.setFontSize(12);
  doc.text('Identifiers', 14, finalY);
  doc.setFontSize(10);
  hco.identifiers.forEach((id, idx) => {
    doc.text(`• ${id}`, 14, finalY + 7 + (idx * 7));
  });
  
  doc.save(`HCO_${hco.name.replace(/\s+/g, '_')}_${hco.mdmId}.pdf`);
};

export const exportDCRToPDF = (dcr: DCRProfile) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(33, 150, 243);
  doc.text('Doctor Call Report', 14, 20);
  
  // Call Date
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${dcr.callDate}`, 14, 30);
  
  // Basic Information
  doc.setFontSize(12);
  doc.text('Call Details', 14, 45);
  
  const basicInfo = [
    ['MDM ID', dcr.mdmId],
    ['Org ID', dcr.orgId],
    ['Call Type', dcr.callType],
    ['Duration', `${dcr.callDuration} minutes`],
    ['Status', dcr.status],
    ['Source', dcr.source],
    ['Last Updated', dcr.lastUpdated],
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [['Field', 'Value']],
    body: basicInfo,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] },
  });
  
  // Participants
  let finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Participants', 14, finalY);
  
  const participants = [
    ['Healthcare Professional', dcr.hcpName],
    ['Healthcare Organization', dcr.hcoName],
    ['Representative', dcr.representativeName],
  ];
  
  autoTable(doc, {
    startY: finalY + 5,
    head: [['Role', 'Name']],
    body: participants,
    theme: 'striped',
    headStyles: { fillColor: [33, 150, 243] },
  });
  
  // Products Discussed
  finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Products Discussed', 14, finalY);
  doc.setFontSize(10);
  doc.text(dcr.productsDiscussed.join(', '), 14, finalY + 7, { maxWidth: 180 });
  
  // Samples Provided
  finalY = finalY + 15;
  doc.setFontSize(12);
  doc.text('Samples Provided', 14, finalY);
  doc.setFontSize(10);
  if (dcr.samplesProvided.length > 0) {
    dcr.samplesProvided.forEach((sample, idx) => {
      doc.text(`• ${sample}`, 14, finalY + 7 + (idx * 7));
    });
    finalY = finalY + 7 + (dcr.samplesProvided.length * 7);
  } else {
    doc.text('No samples provided', 14, finalY + 7);
    finalY = finalY + 14;
  }
  
  // Next Follow-Up
  finalY = finalY + 10;
  doc.setFontSize(12);
  doc.text('Next Follow-Up', 14, finalY);
  doc.setFontSize(10);
  doc.text(dcr.nextFollowUp, 14, finalY + 7);
  
  // Call Notes
  finalY = finalY + 17;
  if (finalY > 230) {
    doc.addPage();
    finalY = 20;
  }
  doc.setFontSize(12);
  doc.text('Call Notes', 14, finalY);
  doc.setFontSize(10);
  const splitNotes = doc.splitTextToSize(dcr.notes, 180);
  doc.text(splitNotes, 14, finalY + 7);
  
  doc.save(`DCR_${dcr.mdmId}_${dcr.callDate}.pdf`);
};

export const prepareHCOForExport = (hco: HCOProfile) => {
  return {
    'MDM ID': hco.mdmId,
    'Org ID': hco.orgId,
    'Name': hco.name,
    'NPI ID': hco.npiId,
    'Organization Type': hco.organizationType,
    'Status': hco.status,
    'Phone': hco.phone,
    'Email': hco.email,
    'Address': `${hco.address.street}, ${hco.address.city}, ${hco.address.state} ${hco.address.zipCode}`,
    'Departments': hco.departments.join('; '),
    'Accreditation': hco.accreditation.join('; '),
    'Affiliated HCPs': hco.affiliatedHCPs.join('; '),
    'Identifiers': hco.identifiers.join('; '),
    'Source': hco.source,
    'Last Updated': hco.lastUpdated,
  };
};

export const prepareDCRForExport = (dcr: DCRProfile) => {
  return {
    'MDM ID': dcr.mdmId,
    'Org ID': dcr.orgId,
    'Call Date': dcr.callDate,
    'HCP Name': dcr.hcpName,
    'HCO Name': dcr.hcoName,
    'Representative': dcr.representativeName,
    'Call Type': dcr.callType,
    'Duration (minutes)': dcr.callDuration,
    'Products Discussed': dcr.productsDiscussed.join('; '),
    'Samples Provided': dcr.samplesProvided.join('; '),
    'Next Follow-Up': dcr.nextFollowUp,
    'Notes': dcr.notes,
    'Status': dcr.status,
    'Source': dcr.source,
    'Last Updated': dcr.lastUpdated,
    'Identifiers': dcr.identifiers.join('; '),
  };
};
