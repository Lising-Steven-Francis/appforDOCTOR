'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { faker } from '@faker-js/faker';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Tab,
  Card,
  Tabs,
  Table,
  Avatar,
  Tooltip,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { Label } from 'src/components/label';
import { fDate } from 'src/utils/format-time';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';

// Types
type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'pending';
type LabelVariant = 'filled' | 'outlined' | 'soft' | 'inverted';

interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  avatar: string;
}

interface AppointmentTableRowProps {
  row: Appointment;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
}

// Mock data for appointments
const _appointments: Appointment[] = Array.from({ length: 10 }, (_, index) => ({
  id: faker.string.uuid(),
  appointmentNumber: `APPT-${faker.number.int({ min: 1000, max: 9999 })}`,
  patientName: faker.person.fullName(),
  doctorName: `Dr. ${faker.person.fullName()}`,
  appointmentDate: faker.date.soon(),
  status: faker.helpers.arrayElement(['confirmed', 'pending', 'cancelled', 'completed']),
  avatar: `/assets/images/avatars/avatar_${index + 1}.jpg`,
}));

// Status options for tabs
const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

// Table head cells
interface TableHeadCell {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}

const TABLE_HEAD: TableHeadCell[] = [
  { id: 'appointmentNumber', label: 'Appointment' },
  { id: 'patientName', label: 'Patient' },
  { id: 'doctorName', label: 'Doctor' },
  { id: 'appointmentDate', label: 'Date & Time' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: '', align: 'right' },
];

function AppointmentTableRow({ row, selected, onSelectRow, onDeleteRow }: AppointmentTableRowProps) {
  const { appointmentNumber, patientName, doctorName, appointmentDate, status, avatar } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>{appointmentNumber}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={avatar} sx={{ mr: 2 }} />
        {patientName}
      </TableCell>
      <TableCell>{doctorName}</TableCell>
      <TableCell>{fDate(appointmentDate)}</TableCell>
      <TableCell>
        <Label
          color={
            (status === 'completed' && 'success') ||
            (status === 'confirmed' && 'info') ||
            (status === 'cancelled' && 'error') ||
            'warning'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteRow}>
            <Icon icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [tableData, setTableData] = useState(_appointments);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  const handleSelectAllRows = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = tableData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const filteredData = tableData.filter((item) => {
    if (currentTab === 'all') return true;
    return item.status === currentTab;
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Appointments
      </Typography>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {APPOINTMENT_STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    (tab.value === 'all' || tab.value === currentTab ? 'filled' : 'soft') as LabelVariant
                  }
                  color={
                    (tab.value === 'completed' && 'success') ||
                    (tab.value === 'confirmed' && 'info') ||
                    (tab.value === 'cancelled' && 'error') ||
                    'warning'
                  }
                >
                  {tab.value === 'all'
                    ? tableData.length
                    : tableData.filter((item) => item.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < tableData.length
                      }
                      checked={tableData.length > 0 && selected.length === tableData.length}
                      onChange={handleSelectAllRows}
                    />
                  </TableCell>
                  {TABLE_HEAD.map((headCell) => {
                    const align = headCell.align || 'left';
                    return (
                      <TableCell 
                        key={headCell.id} 
                        align={align as 'left' | 'center' | 'right' | 'justify' | 'inherit'}
                      >
                        {headCell.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const selectedRow = selected.indexOf(row.id) !== -1;
                    return (
                      <AppointmentTableRow
                        key={row.id}
                        row={row}
                        selected={selectedRow}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
