import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Button,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Pinterest as PinterestIcon,
  Email as EmailIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SocialShare = ({ open, onClose, product }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const currentUrl = window.location.href;

  const shareData = {
    title: product?.name,
    text: product?.description,
    url: currentUrl,
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877f2',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1da1f2',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Check out ${product?.name}!`
          )}&url=${encodeURIComponent(currentUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: '#25d366',
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `Check out ${product?.name}! ${currentUrl}`
          )}`,
          '_blank'
        );
      },
    },
    {
      name: 'Pinterest',
      icon: <PinterestIcon />,
      color: '#bd081c',
      onClick: () => {
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            currentUrl
          )}&media=${encodeURIComponent(
            product?.images[0]?.url
          )}&description=${encodeURIComponent(product?.name)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: <EmailIcon />,
      color: '#757575',
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(
          `Check out ${product?.name}`
        )}&body=${encodeURIComponent(
          `I thought you might be interested in ${product?.name}!\n\n${currentUrl}`
        )}`;
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopySuccess(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
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
          <Typography variant="h6">Share This Product</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              {shareButtons.map((button, index) => (
                <Grid item xs={4} key={button.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={button.icon}
                      onClick={button.onClick}
                      fullWidth
                      sx={{
                        borderColor: button.color,
                        color: button.color,
                        '&:hover': {
                          borderColor: button.color,
                          backgroundColor: `${button.color}10`,
                        },
                      }}
                    >
                      {button.name}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Or copy link
            </Typography>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Tooltip title="Copy Link">
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={handleCopyLink}
                  sx={{ minWidth: 200 }}
                >
                  Copy Link
                </Button>
              </Tooltip>
            </motion.div>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
      />
    </>
  );
};

export default SocialShare; 