'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { faker } from '@faker-js/faker';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Card, 
  Chip, 
  Stack, 
  Table, 
  Avatar, 
  Button, 
  Dialog, 
  Divider, 
  TableRow, 
  TableBody, 
  TableCell, 
  TableHead, 
  Typography, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TableContainer, 
  TablePagination 
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import { Label } from 'src/components/label';
import { fDate } from 'src/utils/format-time';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  avatar: string;
  address: string;
  bloodType: string;
  lastVisit: Date;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}

// Mock data generation
const createMockPatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    patients.push({
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      age: faker.number.int({ min: 18, max: 90 }),
      avatar: `${CONFIG.assetsDir}/images/avatars/logo22.png`,
      address: faker.location.streetAddress(),
      bloodType: faker.helpers.arrayElement(bloodTypes),
      lastVisit: faker.date.recent({ days: 365 }),
      status,
      notes: faker.lorem.sentences(2),
    });
  }

  return patients;
};

type Status = 'active' | 'inactive' | 'pending';
type StatusColor = 'success' | 'error' | 'warning';

const STATUS_COLORS: Record<Status, StatusColor> = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
} as const;

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [open, setOpen] = useState(false);
  
  const patients = createMockPatients(15);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Patients
      </Typography>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1200, position: 'relative' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => (
                    <TableRow hover key={patient.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={patient.avatar} sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {patient.name}
                            </Typography>
                            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
                              {patient.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{fDate(patient.lastVisit)}</TableCell>
                      <TableCell>
                        <Label
                          color={STATUS_COLORS[patient.status]}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {patient.status}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpen(patient)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={patients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Patient Details Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedPatient && (
          <>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={selectedPatient.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Typography variant="h6">{selectedPatient.name}</Typography>
                    <Chip
                      label={selectedPatient.status}
                      color={STATUS_COLORS[selectedPatient.status as Status]}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Blood Type:
                      </Typography>
                      <Typography variant="subtitle2">{selectedPatient.bloodType}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Age:
                      </Typography>
                      <Typography variant="subtitle2">{selectedPatient.age} years</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Gender:
                      </Typography>
                      <Typography variant="subtitle2">{selectedPatient.gender}</Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Stack spacing={2.5} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Icon icon="ic:round-email" width={24} height={24} style={{ minWidth: 24, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ wordBreak: 'break-word', flex: 1 }}>
                        {selectedPatient.email}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Icon icon="ic:round-phone" width={24} height={24} style={{ minWidth: 24, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {selectedPatient.phone}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Icon icon="ic:round-location-on" width={24} height={24} style={{ marginTop: '4px', minWidth: 24, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ wordBreak: 'break-word', flex: 1 }}>
                        {selectedPatient.address}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="h6" gutterBottom>Medical Notes</Typography>
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.notes || 'No additional notes available.'}
                    </Typography>
                  </Card>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Icon icon="ic:round-edit" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon icon="ic:round-delete" />}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardContent>
  );
}
