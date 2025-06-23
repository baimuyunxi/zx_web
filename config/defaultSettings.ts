import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  title: '指标监控平台',
  navTheme: 'light',
  colorPrimary: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  pwa: true,
  logo: 'https://s3.bmp.ovh/imgs/2025/02/17/828239f65fdc918f.png',
  token: {},
  splitMenus: false,
  siderMenuType: 'sub',
};

export default Settings;
