"use client"

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type TodoStats } from '@/types';

interface TodoStatsChartProps {
  stats?: TodoStats;
  isLoading?: boolean;
}

// 自定义颜色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TodoStatsChart: React.FC<TodoStatsChartProps> = ({ stats, isLoading = false }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (stats && stats.total > 0) {
      const data = [
        {
          name: '已完成',
          value: stats.completed,
          percentage: Math.round((stats.completed / stats.total) * 100),
          color: COLORS[0]
        },
        {
          name: '进行中',
          value: stats.pending,
          percentage: Math.round((stats.pending / stats.total) * 100),
          color: COLORS[1]
        }
      ];
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [stats]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            数量: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            占比: <span className="font-medium">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 自定义Legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.payload.name}: {entry.payload.value} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">任务完成情况统计</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">任务完成情况统计</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">任务完成情况统计</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 饼状图 */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 统计信息 */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">总览</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">总任务数:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">完成率:</span>
                <span className="font-medium text-green-600">{stats.completionRate}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">详细统计</h4>

            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">已完成</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{stats.completed}</div>
                <div className="text-xs text-gray-500">{Math.round((stats.completed / stats.total) * 100)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">进行中</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{stats.pending}</div>
                <div className="text-xs text-gray-500">{Math.round((stats.pending / stats.total) * 100)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoStatsChart;
