import { Args, Query, Resolver } from "@nestjs/graphql";
import { MAGENTO2 } from "./constant";
import { Magento2Service } from "./magento2/magento2.service";

@Resolver("Product")
export class ProductsResolvers {
  constructor(private readonly magento2Service: Magento2Service) {}

  @Query()
  getProductsByCategory(
    @Args("appInfo") appInfo: { token: string; url: string; platform: string },
    @Args("searchValue") searchValue: string,
    @Args("currentPage")
    currentPage: number,
    @Args("categoryId") categoryId: number
  ): Promise<String> {
    const platform = appInfo.platform;
    switch (platform) {
      case MAGENTO2:
        return this.magento2Service.getProductsByCategory(
          appInfo,
          searchValue,
          currentPage,
          categoryId
        );
      default:
        break;
    }
  }
  @Query()
  getQuerySearchProduct(
    @Args("appInfo") appInfo: { token: string; url: string; platform: string },
    @Args("searchValue") searchValue: string,
    @Args("currentPage")
    currentPage: number
  ): Promise<String> {
    const platform = appInfo.platform;
    switch (platform) {
      case MAGENTO2:
        return this.magento2Service.getQuerySearchProduct(
          appInfo,
          searchValue,
          currentPage
        );
      default:
        break;
    }
  }
}
