/**
 * Send-rate sparkline. Plots one point per month that has climbs and connects
 * them, with an ink dot on the latest. Falls back to a quiet note until there
 * are at least two months of data.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';
import type { SendRatePoint } from '@/lib/stats';

interface TrendLineProps {
  data: SendRatePoint[];
  height?: number;
}

export function TrendLine({ data, height = 72 }: TrendLineProps) {
  const [width, setWidth] = useState(0);

  const n = data.length;
  // Keep the original bucket index so empty months leave a real gap on the x axis.
  const points = data
    .map((d, i) => ({ ...d, i }))
    .filter((d) => d.hasData);
  const latest = points[points.length - 1];

  const padY = 8;
  const toX = (i: number) => (n <= 1 ? width / 2 : (i / (n - 1)) * width);
  const toY = (rate: number) => padY + (1 - rate) * (height - padY * 2);

  const path = points
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'}${toX(p.i).toFixed(1)},${toY(p.rate).toFixed(1)}`,
    )
    .join(' ');

  const ready = width > 0 && points.length >= 2;

  return (
    <View>
      <View
        style={[styles.chart, { height }]}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {ready ? (
          <Svg width={width} height={height}>
            <Path
              d={path}
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {latest ? (
              <Circle
                cx={toX(latest.i)}
                cy={toY(latest.rate)}
                r={3.4}
                fill={colors.text}
              />
            ) : null}
          </Svg>
        ) : (
          <Text style={styles.emptyText}>Keep logging to see your trend</Text>
        )}
      </View>

      <View style={styles.caption}>
        {data.map((d, i) => (
          <Text key={`${d.label}-${i}`} style={styles.capText}>
            {i === n - 1 && d.hasData
              ? `NOW · ${Math.round(d.rate * 100)}%`
              : d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { alignItems: 'center', justifyContent: 'center' },
  emptyText: {
    fontFamily: fontFamily.sansLight,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  caption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  capText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wide,
    color: colors.textMuted,
  },
});
