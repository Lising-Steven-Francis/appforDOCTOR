'use client';

import { Box, Card, Stack, IconButton, Typography } from '@mui/material';

import { AppWelcome } from '../app-welcome';
import { AppNewInvoice } from '../app-new-invoice';

import { _appInvoices } from 'src/_mock';
import { CONFIG } from 'src/global-config';
import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', margin: '-12px' }}>
        <div style={{ flex: '1 1 66.666%', minWidth: '300px', padding: '12px' }}>
          <AppWelcome
            title={`Welcome back  \n ${user?.name || ''}`}
            img={<SeoIllustration hideBackground />}
          />
        </div>
        
        <div style={{ flex: '1 1 25%', minWidth: '300px', padding: '12px' }}>
          <Card 
            sx={(theme) => ({
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              background: `linear-gradient(to right, ${theme.palette.grey[900]}e0 0%, ${theme.palette.grey[900]} 75%), url(${CONFIG.assetsDir}/assets/background/background-5.webp)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
              borderRadius: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              color: 'common.white',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
              }
            })}
          >
            <Box sx={{ 
              textAlign: 'center', 
              p: 2,
              '&:hover': {
                '& .doctor-avatar': {
                  transform: 'scale(1.05)'
                }
              }
            }}>
              <Box 
                className="doctor-avatar"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  transition: 'transform 0.3s ease',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                DI
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, color: 'common.white' }}>Doctor Irion</Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'primary.light',
                  fontWeight: 'medium',
                  mb: 1,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
              >
                Anesthesiologist
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'grey.300',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5
                }}
              >
                <Iconify icon="solar:letter-bold" width={16} sx={{ color: 'grey.400' }} />
                aironalarde123@gmail.com
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center"
                sx={{
                  '& .MuiIconButton-root': {
                    border: '1px solid',
                    borderColor: 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'common.white',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                  }
                }}
              >
                <IconButton 
                  color="primary" 
                  aria-label="Facebook" 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener"
                  sx={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.2)'
                    }
                  }}
                >
                  <Iconify icon="solar:users-group-rounded-bold" />
                </IconButton>
                <IconButton 
                  color="info" 
                  aria-label="Twitter" 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener"
                  sx={{
                    background: 'rgba(56, 182, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(56, 182, 255, 0.2)'
                    }
                  }}
                >
                  <Iconify icon="solar:chat-round-dots-bold" />
                </IconButton>
                <IconButton 
                  color="error" 
                  aria-label="Instagram" 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener"
                  sx={{
                    background: 'rgba(255, 86, 48, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 86, 48, 0.2)'
                    }
                  }}
                >
                  <Iconify icon="solar:gallery-wide-bold" />
                </IconButton>
              </Stack>
            </Box>
          </Card>
        </div>
        
        <div style={{ flex: '1 1 66.666%', minWidth: '300px', padding: '12px' }}>
          <AppNewInvoice
            title="Patient Receipt"
            tableData={_appInvoices}
            headCells={[
              { id: 'id', label: 'Patient ID' },
              { id: 'category', label: 'Surgery' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </div>
      </div>
    </DashboardContent>
  );
}
