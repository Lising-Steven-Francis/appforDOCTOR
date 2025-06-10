import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Avatar,
  Button,
  Container,
  IconButton,
   Typography,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  author: string;
  authorAvatar: string;
  likes: number;
  comments: number;
}

const HEALTH_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Breakthrough in Heart Disease Treatment',
    summary: 'New study shows 40% reduction in heart attack risk with innovative therapy.',
    date: '2 hours ago',
    category: 'Cardiology',
    author: 'Dr. Sarah Johnson',
    authorAvatar: '/assets/images/avatars/avatar_1.jpg',
    likes: 42,
    comments: 8,
  },
  {
    id: '2',
    title: 'AI Predicts Patient Deterioration 24 Hours in Advance',
    summary: 'Machine learning model helps hospitals improve patient outcomes with early warning system.',
    date: '5 hours ago',
    category: 'Technology',
    author: 'Dr. Michael Chen',
    authorAvatar: '/assets/images/avatars/avatar_2.jpg',
    likes: 36,
    comments: 12,
  },
  {
    id: '3',
    title: 'New Guidelines for Diabetes Management Released',
    summary: 'Updated recommendations include personalized treatment plans and continuous glucose monitoring.',
    date: '1 day ago',
    category: 'Endocrinology',
    author: 'Dr. Emily Rodriguez',
    authorAvatar: '/assets/images/avatars/avatar_3.jpg',
    likes: 28,
    comments: 5,
  },
];

// ----------------------------------------------------------------------

type HealthNewsFeedProps = {
  title?: string;
  subheader?: string;
};

export function HealthNewsFeed({ title = 'Health News Feed', subheader }: HealthNewsFeedProps) {
  const theme = useTheme();

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.customShadows.z24,
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Stack spacing={2} sx={{ p: 3 }}>
            {HEALTH_NEWS.map((news) => (
              <Card
                key={news.id}
                sx={{
                  p: 3,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows.z24,
                  },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'primary.main',
                  },
                }}
              >
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Avatar
                    src={news.authorAvatar}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      boxShadow: theme.customShadows.z8,
                      '& .MuiSvgIcon-root': {
                        width: 28,
                        height: 28,
                      },
                    }}
                  >
                    <Iconify icon="solar:heart-bold" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">
                        {news.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'primary.lighter',
                          color: 'primary.dark',
                          fontSize: 11,
                          fontWeight: 'fontWeightSemiBold',
                          lineHeight: 1.5,
                          ml: 1,
                        }}
                      >
                        {news.category}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {news.summary}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:user-id-bold" width={16} sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {news.author}
                        </Typography>
                      </Stack>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:clock-circle-outline" width={16} sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {news.date}
                        </Typography>
                      </Stack>
                      <Box sx={{ flexGrow: 1 }} />
                      <Stack direction="row" spacing={0.5}>
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<Iconify icon="solar:heart-bold" width={16} />}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: alpha(theme.palette.error.main, 0.08),
                            },
                          }}
                        >
                          {news.likes}
                        </Button>
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<Iconify icon="solar:chat-round-dots-bold" width={16} />}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'info.main',
                              bgcolor: alpha(theme.palette.info.main, 0.08),
                            },
                          }}
                        >
                          {news.comments}
                        </Button>
                        <IconButton
                          size="small"
                          color="default"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'success.main',
                              bgcolor: alpha(theme.palette.success.main, 0.08),
                            },
                          }}
                        >
                          <Iconify icon="solar:share-bold" width={16} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
