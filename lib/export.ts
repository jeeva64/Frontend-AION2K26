import * as XLSX from 'xlsx';

/** Type definitions for export functions */
interface CollegeStat {
  college: string;
  department: string;
  members: number;
  veg: number;
  nonVeg: number;
}

interface TeamMember {
  name: string;
  registerNumber: string;
  degree: 'ug' | 'pg';
  mobile: string;
  event1: string;
  event2?: string | null;
  foodPreference?: 'vegetarian' | 'non-vegetarian' | string;
  leaderId?: string;
}

interface EventRegEntry {
  leaderId?: string;
  college?: string;
  department?: string;
  members?: TeamMember[];
}

/** Export college-wise stats to Excel */
export function exportCollegeStats(data: CollegeStat[], filename?: string) {
  if (!data.length) return;

  const excelData = data.map((stat, index) => ({
    "S.No": index + 1,
    "College Name": stat.college,
    "Department": stat.department.toUpperCase(),
    "Total Members": stat.members,
    "Vegetarian": stat.veg,
    "Non-Vegetarian": stat.nonVeg
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Add header rows
  XLSX.utils.sheet_add_aoa(ws, [
    ["AION 2K26 - College-wise Registration Stats"],
    [`Generated: ${new Date().toLocaleString()}`],
    []
  ], { origin: "A1" });

  // Adjust range
  const range = XLSX.utils.decode_range(ws['!ref']!);
  range.e.r += 3;
  ws['!ref'] = XLSX.utils.encode_range(range);

  // Column widths
  ws['!cols'] = [
    { wch: 6 },
    { wch: 40 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "College Stats");
  XLSX.writeFile(wb, filename || `AION_College_Stats_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/** Export team attendance sheet */
export function exportTeamAttendance(
  data: TeamMember[],
  college: string,
  department: string,
  filename?: string
) {
  if (!data.length) return;

  const excelData = data.map((member, index) => ({
    "S.No": index + 1,
    "Name": member.name || "",
    "Register Number": member.registerNumber || "",
    "Degree": member.degree ? member.degree.toUpperCase() : "",
    "Mobile": member.mobile || "",
    "Event 1": member.event1 || "",
    "Event 2": member.event2 || "",
    "Food Preference": member.foodPreference || "",
    "Leader ID": member.leaderId || "",
    "Signature": ""
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  XLSX.utils.sheet_add_aoa(ws, [
    [`College: ${college}`],
    [`Department: ${department.toUpperCase()}`],
    [`Generated: ${new Date().toLocaleString()}`],
    []
  ], { origin: "A1" });

  const range = XLSX.utils.decode_range(ws['!ref']!);
  range.e.r += 4;
  ws['!ref'] = XLSX.utils.encode_range(range);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 18 },
    { wch: 8 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  XLSX.writeFile(wb, filename || `${college.replace(/[^a-zA-Z0-9]/g, '_')}_${department}_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/** Export event participants (filtered to event) */
export function exportEventParticipants(
  data: EventRegEntry[],
  eventName: string,
  filename?: string
) {
  if (!data.length) return;

  const excelData: any[] = [];
  let sno = 1;

  data.forEach(team => {
    team.members?.forEach((member: TeamMember) => {
      if (member.event1 === eventName || member.event2 === eventName) {
        excelData.push({
          "S.No": sno++,
          "Name": member.name || "",
          "Register Number": member.registerNumber || "",
          "Degree": member.degree ? member.degree.toUpperCase() : "",
          "Mobile": member.mobile || "",
          "College Name": team.college || "",
          "Department": team.department ? team.department.toUpperCase() : "",
          "Leader ID": team.leaderId || "",
          "Signature": ""
        });
      }
    });
  });

  if (!excelData.length) return;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  XLSX.utils.sheet_add_aoa(ws, [
    [`Event: ${eventName}`],
    [`Total Participants: ${excelData.length}`],
    [`Generated: ${new Date().toLocaleString()}`],
    []
  ], { origin: "A1" });

  const range = XLSX.utils.decode_range(ws['!ref']!);
  range.e.r += 4;
  ws['!ref'] = XLSX.utils.encode_range(range);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 18 },
    { wch: 8 },
    { wch: 12 },
    { wch: 35 },
    { wch: 12 },
    { wch: 18 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Event Participants");
  XLSX.writeFile(wb, filename || `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_Participants_${new Date().toISOString().split('T')[0]}.xlsx`);
}