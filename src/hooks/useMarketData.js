import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState({
    globalNftMarketVolume: {},
    marketShare: {},
    avgFee: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch global NFT market volume
      const { data: volumeData, error: volumeError } = await supabase
        .from('base_assumptions')
        .select('year, value')
        .eq('assumption_type', 'global_nft_market_volume')
        .order('year');
      
      if (volumeError) throw volumeError;

      // Fetch market share (previously paid conversion rate)
      const { data: shareData, error: shareError } = await supabase
        .from('base_assumptions')
        .select('year, value')
        .eq('assumption_type', 'paid_conversion_rate')
        .order('year');
      
      if (shareError) throw shareError;

      // Fetch average fee
      const { data: feeData, error: feeError } = await supabase
        .from('base_assumptions')
        .select('year, value')
        .eq('assumption_type', 'avg_fee')
        .order('year');
      
      if (feeError) throw feeError;

      // Transform the data into the expected format
      const formattedData = {
        globalNftMarketVolume: {},
        marketShare: {},
        avgFee: {}
      };

      volumeData?.forEach(item => {
        formattedData.globalNftMarketVolume[item.year] = item.value;
      });

      shareData?.forEach(item => {
        formattedData.marketShare[item.year] = item.value;
      });

      feeData?.forEach(item => {
        formattedData.avgFee[item.year] = item.value;
      });

      setMarketData(formattedData);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Refresh function if needed
  const refresh = useCallback(() => {
    return fetchMarketData();
  }, [fetchMarketData]);

  return {
    marketData,
    loading,
    error,
    refresh
  };
};

export default useMarketData;
