import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Paper, Skeleton } from '@mui/material';
import { LocalShipping, AccessTime } from '@mui/icons-material';

const DeliveryOptionsSection = ({ onSelect, selectedOption }) => {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliveryOptions = async () => {
            try {
                const { data } = await axios.get('/api/delivery-options');
                setDeliveryOptions(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load delivery options');
                setLoading(false);
            }
        };

        fetchDeliveryOptions();
    }, []);

    if (loading) {
        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Delivery Options
                </Typography>
                {[1, 2, 3].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rectangular"
                        height={80}
                        sx={{ mb: 1, borderRadius: 1 }}
                    />
                ))}
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mb: 3 }}>
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Delivery Options
            </Typography>
            <RadioGroup
                value={selectedOption?._id || ''}
                onChange={(e) => {
                    const selected = deliveryOptions.find(
                        (option) => option._id === e.target.value
                    );
                    onSelect(selected);
                }}
            >
                {deliveryOptions.map((option) => (
                    <Paper
                        key={option._id}
                        sx={{
                            mb: 1,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <FormControlLabel
                            value={option._id}
                            control={<Radio />}
                            label={
                                <Box>
                                    <Typography variant="subtitle1" component="div">
                                        {option.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mt: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            <LocalShipping
                                                sx={{ fontSize: 20, mr: 0.5 }}
                                            />
                                            <Typography variant="body2">
                                                ${option.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            <AccessTime
                                                sx={{ fontSize: 20, mr: 0.5 }}
                                            />
                                            <Typography variant="body2">
                                                {option.estimatedDays.min}-
                                                {option.estimatedDays.max} days
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        {option.description}
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                m: 0,
                                width: '100%',
                                alignItems: 'flex-start',
                            }}
                        />
                    </Paper>
                ))}
            </RadioGroup>
        </Box>
    );
};

export default DeliveryOptionsSection; 