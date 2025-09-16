// 模拟数据 - 流量监测平台

// 生成随机数
const randomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 生成时间标签
const generateTimeLabels = (count, interval = '5min') => {
  const labels = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now);
    if (interval === '5min') {
      time.setMinutes(now.getMinutes() - (i * 5));
    } else if (interval === 'hour') {
      time.setHours(now.getHours() - i);
    }
    
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    labels.push(`${hours}:${minutes}`);
  }
  
  return labels;
};

// 生成随机流量数据
const generateTrafficData = (count, min, max) => {
  return Array.from({ length: count }, () => randomValue(min, max));
};

// 设备类型
const deviceTypes = ['交换机', '路由器', '防火墙', '服务器', '存储设备'];

// 生成设备列表
const generateDevices = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const status = i % 10 === 0 ? 'offline' : (i % 15 === 0 ? 'error' : 'online');
    const type = deviceTypes[randomValue(0, deviceTypes.length - 1)];
    
    return {
      id: `device-${i + 1}`,
      name: `${type}-${i + 1}`,
      ip: `192.168.1.${i + 1}`,
      type,
      status,
      traffic: randomValue(100, 2000),
      bandwidth: randomValue(10, 95),
      errorRate: status === 'error' ? randomValue(5, 20) : randomValue(0, 2),
      packetLoss: status === 'error' ? randomValue(3, 15) : randomValue(0, 1),
      lastUpdated: new Date()
    };
  });
};

// 生成流量趋势数据
const generateTrafficTrend = (count) => {
  const labels = generateTimeLabels(count);
  const data = generateTrafficData(count, 500, 1500);
  
  return { labels, data };
};

// 生成24小时流量趋势
const generate24hTrafficTrend = () => {
  const labels = generateTimeLabels(24, 'hour');
  const data = generateTrafficData(24, 800, 2500);
  
  return { labels, data };
};

// 生成协议分布数据
const generateProtocolDistribution = () => {
  return {
    labels: ['TCP', 'UDP', 'ICMP', '其他'],
    data: [randomValue(40, 60), randomValue(20, 35), randomValue(5, 15), randomValue(5, 15)]
  };
};

// 生成设备类型分布
const generateDeviceTypeDistribution = () => {
  return {
    labels: deviceTypes,
    data: deviceTypes.map(() => randomValue(10, 40))
  };
};

// 生成设备状态分布
const generateDeviceStatusDistribution = (devices) => {
  const statusCounts = {
    online: 0,
    offline: 0,
    error: 0
  };
  
  devices.forEach(device => {
    statusCounts[device.status]++;
  });
  
  return {
    labels: ['在线', '离线', '异常'],
    data: [statusCounts.online, statusCounts.offline, statusCounts.error]
  };
};

// 生成带宽利用率数据
const generateBandwidthUtilization = (count) => {
  const labels = generateTimeLabels(count);
  const data = generateTrafficData(count, 20, 80);
  
  return { labels, data };
};

// 生成错误率和丢包率数据
const generateErrorAndLossRates = (count) => {
  const labels = generateTimeLabels(count);
  const errorRates = generateTrafficData(count, 0, 5);
  const packetLossRates = generateTrafficData(count, 0, 3);
  
  return { labels, errorRates, packetLossRates };
};

// 生成设备接口流量分布
const generateInterfaceDistribution = () => {
  return {
    labels: ['端口1', '端口2', '端口3', '端口4', '端口5', '端口6', '端口7', '端口8'],
    data: generateTrafficData(8, 100, 1000)
  };
};

// 生成筛选选项
const generateFilterOptions = () => {
  return {
    deviceTypes: ['全部', ...deviceTypes],
    timeRanges: ['今日', '本周', '本月', '自定义']
  };
};

// 导出所有模拟数据
const mockData = {
  devices: generateDevices(128),
  trafficTrend: generateTrafficTrend(24),
  protocolDistribution: generateProtocolDistribution(),
  deviceTypeDistribution: generateDeviceTypeDistribution(),
  deviceStatusDistribution: null, // 将在获取设备数据后生成
  bandwidthUtilization: generateBandwidthUtilization(24),
  errorAndLossRates: generateErrorAndLossRates(24),
  device24hTraffic: generate24hTrafficTrend(),
  interfaceDistribution: generateInterfaceDistribution(),
  filterOptions: generateFilterOptions()
};

// 生成设备状态分布
mockData.deviceStatusDistribution = generateDeviceStatusDistribution(mockData.devices);

// 计算核心指标
mockData.coreMetrics = {
  totalDevices: mockData.devices.length,
  onlineDevices: mockData.devices.filter(device => device.status === 'online').length,
  totalTraffic: (mockData.devices.reduce((sum, device) => sum + device.traffic, 0) / 1024).toFixed(1),
  avgBandwidth: (mockData.devices.reduce((sum, device) => sum + device.bandwidth, 0) / mockData.devices.length).toFixed(1),
  errorDevices: mockData.devices.filter(device => device.status === 'error').length
};

// 计算在线率
mockData.coreMetrics.onlineRate = ((mockData.coreMetrics.onlineDevices / mockData.coreMetrics.totalDevices) * 100).toFixed(1);
mockData.coreMetrics.errorRate = ((mockData.coreMetrics.errorDevices / mockData.coreMetrics.totalDevices) * 100).toFixed(1);

// 获取流量TOP10设备
mockData.topDevices = [...mockData.devices]
  .sort((a, b) => b.traffic - a.traffic)
  .slice(0, 10)
  .map((device, index) => ({
    ...device,
    rank: index + 1,
    percentage: ((device.traffic / mockData.devices.reduce((sum, d) => sum + d.traffic, 0)) * 100).toFixed(0)
  }));

export default mockData;
