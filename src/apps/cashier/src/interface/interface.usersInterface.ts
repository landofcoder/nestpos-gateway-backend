export interface ServiceInterface {
  loginCashierService(payload: {
    username: string;
    password: string;
    url: string;
  });
  systemConfigService(payload: { token: string; url: string });
  cashierInfoService(payload: { token: string; url: string });
  shopInfoService(payload: { platform: string, token: string; url: string });
  getDetailOutlet(payload: { token: string; url: string; outletId: string });
}
