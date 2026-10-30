import { Box, ListItem, ListItemText, Typography } from '@mui/material';
import type { SaleStatsProps } from '../../sales/types/statsSale.type';


const labelSx = {
  fontWeight: 'bold',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1rem',
};

export const GastosStats = ({ lastSpend, totalMonto }: SaleStatsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1.5, sm: 2 },
        width: '100%',
        margin: { xs: '2rem auto', sm: '2rem auto' },
      }}
    >
     
      <ListItem
        sx={{
          width: { xs: '100%', sm: 'auto' },
          flex: { xs: '1 1 auto', sm: '0 0 auto' },
          p: 0,
        }}
      >
        <ListItemText

        >
          
          <Typography component="span" sx={{ fontWeight: '600', ml: 0.5 }}>
            {lastSpend}
          </Typography>
        </ListItemText>
      </ListItem>

      {/* Total */}
      <ListItem
        sx={{
          width: { xs: '100%', sm: 'auto' },
          flex: { xs: '1 1 auto', sm: '0 0 auto' },
          p: 0,
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <ListItemText
          sx={{
            m: 0,
            textAlign: { xs: 'left', sm: 'right' },
            '& .MuiListItemText-primary': {
              ...labelSx,
              transition: 'color 0.3s ease',
            },
          }}
        >
          Total:
          <Typography component="span" sx={{ fontWeight: '600', ml: 0.5 }}>
            ${totalMonto}
          </Typography>
        </ListItemText>
      </ListItem>
    </Box>
  );
};