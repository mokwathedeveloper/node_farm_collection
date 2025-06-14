import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

// Sample size data - replace with actual data from your backend
const sizeData = {
  clothing: {
    US: [
      { size: 'XS', chest: '32-34', waist: '26-28', hips: '34-36' },
      { size: 'S', chest: '34-36', waist: '28-30', hips: '36-38' },
      { size: 'M', chest: '36-38', waist: '30-32', hips: '38-40' },
      { size: 'L', chest: '38-40', waist: '32-34', hips: '40-42' },
      { size: 'XL', chest: '40-42', waist: '34-36', hips: '42-44' },
    ],
    EU: [
      { size: 'XS', chest: '82-86', waist: '66-71', hips: '86-91' },
      { size: 'S', chest: '86-91', waist: '71-76', hips: '91-96' },
      { size: 'M', chest: '91-96', waist: '76-81', hips: '96-101' },
      { size: 'L', chest: '96-101', waist: '81-86', hips: '101-106' },
      { size: 'XL', chest: '101-106', waist: '86-91', hips: '106-111' },
    ],
  },
  shoes: {
    US: [
      { size: '6', eu: '37', uk: '4', cm: '23' },
      { size: '7', eu: '38', uk: '5', cm: '23.5' },
      { size: '8', eu: '39', uk: '6', cm: '24' },
      { size: '9', eu: '40', uk: '7', cm: '24.5' },
      { size: '10', eu: '41', uk: '8', cm: '25' },
    ],
  },
};

const SizeGuide = ({ open, onClose, category = 'clothing' }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderClothingSizeTable = (region) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Size</StyledTableCell>
            <StyledTableCell>Chest (inches)</StyledTableCell>
            <StyledTableCell>Waist (inches)</StyledTableCell>
            <StyledTableCell>Hips (inches)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sizeData.clothing[region].map((row) => (
            <TableRow key={row.size}>
              <TableCell component="th" scope="row">
                {row.size}
              </TableCell>
              <TableCell>{row.chest}</TableCell>
              <TableCell>{row.waist}</TableCell>
              <TableCell>{row.hips}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderShoeSizeTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>US</StyledTableCell>
            <StyledTableCell>EU</StyledTableCell>
            <StyledTableCell>UK</StyledTableCell>
            <StyledTableCell>CM</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sizeData.shoes.US.map((row) => (
            <TableRow key={row.size}>
              <TableCell>{row.size}</TableCell>
              <TableCell>{row.eu}</TableCell>
              <TableCell>{row.uk}</TableCell>
              <TableCell>{row.cm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Size Guide</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {category === 'clothing' && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="US Sizes" />
                <Tab label="EU Sizes" />
              </Tabs>
            </Box>
            <Box role="tabpanel" hidden={selectedTab !== 0}>
              {selectedTab === 0 && renderClothingSizeTable('US')}
            </Box>
            <Box role="tabpanel" hidden={selectedTab !== 1}>
              {selectedTab === 1 && renderClothingSizeTable('EU')}
            </Box>
          </>
        )}

        {category === 'shoes' && renderShoeSizeTable()}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            How to Measure
          </Typography>
          <Typography variant="body2" paragraph>
            Chest: Measure around the fullest part of your chest, keeping the tape horizontal.
          </Typography>
          <Typography variant="body2" paragraph>
            Waist: Measure around your natural waistline, keeping the tape comfortably loose.
          </Typography>
          <Typography variant="body2">
            Hips: Measure around the fullest part of your hips, keeping the tape horizontal.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide; 