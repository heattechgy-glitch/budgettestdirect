import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel }) => {
  const trendColor = trend > 0 ? 'text-green-500' : 'text-red-500';
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;

  return (
    <motion.div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center">
        {Icon && <Icon className="w-6 h-6 text-gray-500 mr-2" />}
        <h3 className="text-lg font-medium text-gray-700">{label}</h3>
      </div>
      <div className="my-2">
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
      {trend !== undefined && (
        <div className="flex items-center">
          <TrendIcon className={`w-4 h-4 ${trendColor} mr-1`} />
          <p className={`text-sm ${trendColor}`}>{trendLabel}</p>
        </div>
      )}
    </motion.div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  trend: PropTypes.number,
  trendLabel: PropTypes.string
};

StatCard.defaultProps = {
  icon: null,
  trend: undefined,
  trendLabel: ''
};

export default StatCard;
