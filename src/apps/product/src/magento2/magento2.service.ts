import {Injectable} from "@nestjs/common";
import {ProductInterface} from "../interface/iproduct";
import fetch from "node-fetch";

@Injectable()
export class Magento2Service implements ProductInterface {
    async createCustomerProduct(
        appInfo: { token: string; url: string },
        params: any
    ): Promise<string> {
        const {url, token} = appInfo;
        const {cashierInfo, detailOutlet, product} = params;
        const dateNow = Date.now().toString();
        try {
            const response = await fetch(
                `${url}/index.php/rest/V1/lof-customproduct/addcustomproduct`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    redirect: "follow",
                    body: JSON.stringify({
                        sku: product.id,
                        product: [
                            {
                                id: product.id,
                                sku: product.sku,
                                name: product.name,
                                attribute_set_id: 4,// default product
                                weight: 1.0,
                                // cost vs price ?
                                cost: +product.price.regularPrice.amount.value,
                                price: +product.price.regularPrice.amount.value,
                                status: 1,
                                visibility: 1,
                                type_id: product.type_id,
                                created_at: product.id,
                                updated_at: dateNow,
                                extension_attributes: {
                                    stockItem: {
                                        itemId: product.id,
                                        productId: product.id,
                                        stockId: 1,
                                        qty: product.pos_qty,
                                        is_in_stock: 1,
                                        isQtyDecimal: true,
                                        showDefaultNotificationMessage: false,
                                        useConfigMinQty: true,
                                        minQty: 1,
                                        useConfigMinSaleQty: 1,
                                        min_sale_qty: 1,
                                        useConfigMaxSaleQty: false,
                                        max_sale_qty: 2,
                                        useConfigBackorders: true,
                                        backorders: 0,
                                        useConfigNotifyStockQty: true,
                                        notifyStockQty: 1,
                                        useConfigQtyIncrements: true,
                                        qtyIncrements: 1,
                                        useConfigEnableQtyInc: true,
                                        enableQtyIncrements: true,
                                        use_config_manage_stock: 0,
                                        manage_stock: 1,
                                        lowStockDate: null,
                                        isDecimalDivided: true,
                                        stockStatusChangedAuto: 0,
                                        extensionAttributes: null,
                                    },
                                    category_links: [
                                        {
                                            position: 0,
                                            category_id: "1",
                                            extension_attributes: null,
                                        },
                                    ],
                                },
                                product_links: null,
                                options: null,
                                tier_prices: null,
                                custom_attributes: {
                                    url_key: "clothing",
                                    description: product.note,
                                    pos_cashier_email: cashierInfo.email,
                                    pos_cashier_name: cashierInfo.first_name,
                                    pos_cashier_id: cashierInfo.cashier_id,
                                    pos_outlet_id: detailOutlet.outlet_id,
                                    pos_outlet_name: detailOutlet.outlet_name,
                                },
                            },
                        ],
                    }),
                }
            );
            const data = await response.json();
            if (data.message || data.errors) {
                throw {message: data.message || data.errors};
            }
            return data;
        } catch (e) {
            console.log(e);
            return JSON.stringify({message: e.message || "Server not response"});
        }
    }

    async getProductsByCategory(
        appInfo: { token: string; url: string; platform: string },
        searchValue: string,
        currentPage: number,
        categoryId: number
    ): Promise<String> {
        const defaultPageSize = 10;
        const query = `{
              products(
                filter: { category_id: { eq: "${categoryId}" } }
                pageSize: ${defaultPageSize}
                currentPage: ${currentPage}
              ) {
                total_count
                items {
                  id
                  attribute_set_id
                  name
                  sku
                  type_id
                  special_price
                  special_from_date
                  special_to_date
                  small_image {
                    url
                  }
                  media_gallery_entries {
                    file
                  }
                  tier_prices {
                    qty
                    value
                    customer_group_id
                    percentage_value
                    value
                  }
                  price {
                    regularPrice {
                      amount {
                        value
                        currency
                      }
                    }
                  }
                  categories {
                    id
                  }
                  ... on ConfigurableProduct {
                    configurable_options {
                      id
                      attribute_id
                      label
                      position
                      use_default
                      attribute_code
                      values {
                        value_index
                        label
                      }
                      product_id
                    }
                    variants {
                      product {
                        id
                        name
                        sku
                        special_price
                        special_from_date
                        special_to_date
                        tier_prices {
                          qty
                          value
                          customer_group_id
                          percentage_value
                          value
                        }
                        small_image {
                          url
                        }
                        media_gallery_entries {
                          file
                        }
                        attribute_set_id
                        ... on PhysicalProductInterface {
                          weight
                        }
                        price {
                          regularPrice {
                            amount {
                              value
                              currency
                            }
                          }
                        }
                      }
                      attributes {
                        label
                        code
                        value_index
                      }
                    }
                  }
                  ... on BundleProduct {
                    dynamic_sku
                    dynamic_price
                    dynamic_weight
                    price_view
                    small_image {
                      url
                    }
                    media_gallery_entries {
                      file
                    }
                    ship_bundle_items
                    items {
                      option_id
                      title
                      required
                      type
                      position
                      sku
                      options {
                        id
                        qty
                        position
                        is_default
                        price
                        price_type
                        can_change_quantity
                        label
                        product {
                          id
                          name
                          sku
                          type_id
                          small_image {
                            url
                          }
                          media_gallery_entries {
                            file
                          }
                          special_price
                          special_from_date
                          special_to_date
                          tier_prices {
                            qty
                            value
                            customer_group_id
                            percentage_value
                            value
                          }
                          price {
                            regularPrice {
                              amount {
                                value
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  ... on GroupedProduct {
                    items {
                      qty
                      position
                      product {
                        id
                        small_image {
                          url
                        }
                        media_gallery_entries {
                          file
                        }
                        sku
                        name
                        special_price
                        special_from_date
                        special_to_date
                        tier_prices {
                          qty
                          value
                          customer_group_id
                          percentage_value
                          value
                        }
                        price {
                          regularPrice {
                            amount {
                              value
                              currency
                            }
                          }
                        }
                        type_id
                        url_key
                      }
                    }
                  }
                }
              }
            }`;
        let data = {data: {products: {}}};
        try {
            const response = await fetch(`${appInfo.url}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appInfo.token}`,
                },
                redirect: "follow",
                body: JSON.stringify({query}),
            });
            data = await response.json();
        } catch (e) {
            console.log(e);
        }
        let dataResult = "";
        if (data.data && data.data.products) {
            dataResult = JSON.stringify(data.data);
        }
        return dataResult;
    }

    async getQuerySearchProduct(
        appInfo: { token: string; url: string; platform: string },
        searchValue: string,
        currentPage: number
    ): Promise<String> {
        const defaultPageSize = 20;
        const queryName = `{
      products(${
            searchValue.length > 0 ? `search: "${searchValue}",` : ""
        } filter: {}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
        items {
          id
          attribute_set_id
          name
          sku
          type_id
          special_price
          special_from_date
          special_to_date
          tier_prices {
            qty
            value
            customer_group_id
            percentage_value
            value
          }
          small_image {
            url
          }
          media_gallery_entries {
             file
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          categories {
            id
          }
          ... on ConfigurableProduct {
            configurable_options {
              id
              attribute_id
              label
              position
              use_default
              attribute_code
              values {
                value_index
                label
              }
              product_id
            }
            variants {
              product {
                id
                name
                sku
                special_price
                special_from_date
                special_to_date
                tier_prices {
                  qty
                  value
                  customer_group_id
                  percentage_value
                  value
                }
                small_image {
                    url
                }
                media_gallery_entries {
                  file
                }
                attribute_set_id
                ... on PhysicalProductInterface {
                  weight
                }
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
              }
              attributes {
                label
                code
                value_index
              }
            }
          }
        }
      }
    }`;
        const querySku = `{
      products(filter: { sku: { eq: "${searchValue}" }}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
        items {
          id
          attribute_set_id
          name
          sku
          type_id
          special_price
          special_from_date
          special_to_date
          tier_prices {
            qty
            value
            customer_group_id
            percentage_value
            value
          }
          small_image {
             url
          }
          media_gallery_entries {
             file
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          categories {
            id
          }
          ... on ConfigurableProduct {
            configurable_options {
              id
              attribute_id
              label
              position
              use_default
              attribute_code
              values {
                value_index
                label
              }
              product_id
            }
            variants {
              product {
                id
                name
                sku
                special_price
                special_from_date
                special_to_date
                tier_prices {
                  qty
                  value
                  customer_group_id
                  percentage_value
                  value
                }
                 small_image {
                    url
                  }
                media_gallery_entries {
                  file
                }
                attribute_set_id
                ... on PhysicalProductInterface {
                  weight
                }
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
              }
              attributes {
                label
                code
                value_index
              }
            }
          }
        }
      }
    }`;
        let data = {data: {products: {}}};
        try {
            let itemResult = [];
            let response = await fetch(`${appInfo.url}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${appInfo.token}`,
                },
                redirect: "follow",
                body: JSON.stringify({query: queryName}),
            });

            let data = await response.json();
            if (!data.data.products.items) itemResult = [];
            else itemResult = data.data.products.items;
            if (!itemResult || itemResult.length === 0) {
                response = await fetch(`${appInfo.url}/graphql`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${appInfo.token}`,
                    },
                    redirect: "follow",
                    body: JSON.stringify({query: querySku}),
                });
                data = await response.json();
                itemResult = data.data.products.items;
            }
            return JSON.stringify(itemResult);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getAllBarCodeInventory(appInfo: {
        token: string;
        url: string;
        itemPerPage: number;
        currentPage: number;
    }): Promise<string> {
        let data = [];
        try {
            const response = await fetch(
                `${appInfo.url}/rest/V1/lof-barcodeinventory/getallbarcode/${appInfo.itemPerPage}/${appInfo.currentPage}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${appInfo.token}`,
                    },
                    redirect: "follow",
                }
            );
            data = await response.json();
        } catch (e) {
            console.log(e);
        }
        let dataResult = "";
        if (data) {
            dataResult = JSON.stringify(data);
        }
        return dataResult;
    }

    async getProductInventoryByWareHouse(appInfo: {
        token: string;
        url: string;
        itemPerPage: number;
        currentPage: number;
    }): Promise<string> {
        let data = [];
        try {
            const response = await fetch(
                `${appInfo.url}/rest/V1/inventoryStock/?searchCriteria[pageSize]=${appInfo.itemPerPage}&searchCriteria[currentPage]=${appInfo.currentPage}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${appInfo.token}`,
                    },
                    redirect: "follow",
                }
            );
            data = await response.json();
        } catch (e) {
            console.log(e);
        }
        let dataResult = "";
        if (data) {
            dataResult = JSON.stringify(data);
        }
        return dataResult;
    }
}
