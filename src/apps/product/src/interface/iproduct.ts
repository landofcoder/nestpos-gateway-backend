export interface ProductInterface {
  getProductsByCategory(
    appInfo: { token: string; url: string; platform: string },
    searchValue: string,
    currentPage: number,
    categoryId: number
  ): Promise<String>;
  getQuerySearchProduct(
    appInfo: { token: string; url: string; platform: string },
    searchValue: string,
    currentPage: number
  ): Promise<String>;
  createCustomerProduct(
    appInfo: { token: string; url: string },
    params: any
  ): Promise<String>;
}
