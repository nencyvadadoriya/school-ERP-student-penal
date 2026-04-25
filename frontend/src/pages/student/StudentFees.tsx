import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { feesAPI } from '../../services/api';
import Badge from '../../components/Badge';
import { Skeleton, CardSkeleton, TableRowSkeleton } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import { FaMoneyBillWave, FaDownload } from 'react-icons/fa';

const StudentFees: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    feesAPI.getAll({ gr_number: user?.gr_number })
      .then(r=>setFees(r.data.data||[]))
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[]);

  const totalDue = fees.filter(f=>f.status!=='Paid').reduce((s,f)=>s+(f.total_amount-f.amount_paid),0);

  const downloadReceipt = (fee: any) => {
    try {
      const doc = new jsPDF();
      const studentName = `${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`.trim();
      
      // Branding / Header Background
      doc.setFillColor(79, 70, 229); // Primary Color
      doc.rect(0, 0, 210, 40, 'F');
      
      // School Name / Header
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('SCHOOL ERP SYSTEM', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Official Payment Receipt', 20, 32);
      
      // Receipt Details (Top Right)
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Receipt No: ${fee.receipt_number || 'N/A'}`, 150, 20);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 26);
      
      // Student & Fee Info Section
      doc.setTextColor(40, 44, 52);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('STUDENT INFORMATION', 20, 55);
      
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.5);
      doc.line(20, 58, 60, 58);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Name:`, 20, 68);
      doc.setFont(undefined, 'bold');
      doc.text(`${studentName}`, 50, 68);
      
      doc.setFont(undefined, 'normal');
      doc.text(`GR Number:`, 20, 75);
      doc.setFont(undefined, 'bold');
      doc.text(`${fee.gr_number}`, 50, 75);
      
      doc.setFont(undefined, 'normal');
      doc.text(`Standard/Div:`, 120, 68);
      doc.setFont(undefined, 'bold');
      doc.text(`${fee.std || '-'} / ${fee.division || '-'}`, 155, 68);
      
      doc.setFont(undefined, 'normal');
      doc.text(`Academic Year:`, 120, 75);
      doc.setFont(undefined, 'bold');
      doc.text(`${fee.academic_year || '-'}`, 155, 75);
      
      // Payment Summary Table
      const tableData = [
        ['Description', 'Information'],
        ['Fee Category', fee.fee_type || 'Tuition Fees'],
        ['Payment Method', fee.payment_mode || 'Cash'],
        ['Installment', `No. ${fee.installment_number || 1}`],
        ['Payment Date', fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : '-'],
        ['Status', fee.status.toUpperCase()]
      ];

      autoTable(doc, {
        startY: 85,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 255] },
        styles: { fontSize: 10, cellPadding: 6, halign: 'left' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 100 }
        }
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 150;

      // Amount Breakdown Box
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(120, finalY + 10, 70, 40, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text('Total Amount:', 125, finalY + 20);
      doc.text('Amount Paid:', 125, finalY + 28);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 44, 52);
      doc.setFont(undefined, 'bold');
      doc.text(`INR ${fee.total_amount?.toLocaleString()}`, 155, finalY + 20);
      doc.setTextColor(22, 163, 74); // Green for paid
      doc.text(`INR ${fee.amount_paid?.toLocaleString()}`, 155, finalY + 28);
      
      doc.setDrawColor(209, 213, 219);
      doc.line(125, finalY + 32, 185, finalY + 32);
      
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38); // Red for balance
      doc.text('Balance Due:', 125, finalY + 40);
      doc.text(`INR ${(fee.total_amount - fee.amount_paid).toLocaleString()}`, 155, finalY + 40);

      // Footer / Signatures
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.setFont(undefined, 'normal');
      doc.text('This is a computer generated receipt and does not require a physical signature.', 105, 280, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setTextColor(40, 44, 52);
      doc.text('Authorized Signature', 150, finalY + 70);
      doc.setDrawColor(40, 44, 52);
      doc.line(140, finalY + 65, 190, finalY + 65);
      
      doc.save(`Receipt_${fee.gr_number}_${fee.fee_type}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="w-full px-2 py-3 md:px-4 md:py-4 lg:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#002B5B]">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-20 bg-white/20" /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={7} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Mobile Header */}
      <div className="md:hidden bg-[#002B5B] pt-6 pb-8 px-4">
        <h1 className="text-lg font-bold text-white">My Fees</h1>
        <p className="text-[10px] mt-0.5 text-white/80">Track and manage your academic fee payments</p>
      </div>

      <div className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-6">
        {/* Desktop Header & Stats */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Fees</h1>
              <p className="text-[10px] mt-0.5 font-medium text-gray-500">Track and manage your academic fee payments</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Due</span>
                <span className="text-sm font-bold text-red-600 leading-none">₹{totalDue.toLocaleString()}</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col items-end px-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Academic Year</span>
                <span className="text-sm font-bold text-gray-900 leading-none">2026</span>
              </div>
            </div>
          </div>
        </div>
        {totalDue > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm shadow-red-100/50 mb-4 relative z-10 animate-in slide-in-from-top-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-red-900 uppercase tracking-tight">Outstanding Balance</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">₹{totalDue.toLocaleString()}</p>
              <p className="text-xs text-red-500 font-bold mt-1 uppercase tracking-tighter italic">Please clear your dues to avoid penalties</p>
            </div>
          </div>
        )}

        {fees.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No fee records found</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="sm:hidden space-y-3">
              {fees.map(f => (
                <div key={f._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group active:scale-[0.98] transition-all">
                  <div className={`h-1 ${f.status === 'Paid' ? 'bg-[#002B5B]' : 'bg-[#002B5B]'}`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Fee Type</p>
                        <h3 className="text-sm font-bold text-[#002B5B] mt-0.5">{f.fee_type}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={f.status} />
                        <button 
                          onClick={() => downloadReceipt(f)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#e6f0f9] text-[#002B5B] hover:bg-[#d0e1f2] transition-colors shadow-sm"
                          title="Download Receipt"
                        >
                          <FaDownload size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-gray-50 pt-3">
                      <div>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Total Amount</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">₹{f.total_amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Amount Paid</p>
                        <p className="text-xs font-bold text-green-600 mt-0.5">₹{f.amount_paid?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Balance</p>
                        <p className="text-xs font-bold text-red-600 mt-0.5">₹{(f.total_amount - f.amount_paid).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Due Date</p>
                        <p className="text-xs font-bold text-gray-700 mt-0.5">{new Date(f.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-[#002B5B]">
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">FEE TYPE</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">TOTAL</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">PAID</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">BALANCE</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">DUE DATE</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">STATUS</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#002B5B]">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fees.map(f => (
                      <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-sm font-bold text-[#1e293b]">{f.fee_type}</td>
                        <td className="px-6 py-5 text-sm font-bold text-[#1e293b]">₹{f.total_amount?.toLocaleString()}</td>
                        <td className="px-6 py-5 text-sm font-bold text-green-600">₹{f.amount_paid?.toLocaleString()}</td>
                        <td className="px-6 py-5 text-sm font-bold text-red-600">₹{(f.total_amount - f.amount_paid).toLocaleString()}</td>
                        <td className="px-6 py-5 text-sm text-gray-500 font-medium">{new Date(f.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-5"><Badge status={f.status} /></td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => downloadReceipt(f)}
                            className="p-2 text-[#002B5B] hover:bg-gray-50 rounded-lg transition-colors shadow-sm border border-gray-100"
                            title="Download Receipt"
                          >
                            <FaDownload />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentFees;
