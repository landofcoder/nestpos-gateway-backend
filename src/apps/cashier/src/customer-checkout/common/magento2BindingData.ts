export function bindingOrderData(order) {
  const defaultDataOrderLocal = {
    grand_total: order.grand_total,
    items: {
      cartCurrentResult: {
        cartId: null,
        customerToken: "",
        data: order.items.map((item, index) => ({
          id: item.item_id,
          attribute_set_id: null,
          name: item.name,
          sku: item.sku,
          type_id: item.product_type,
          special_price: null,
          special_from_date: null,
          special_to_date: null,
          small_image: {
            url: null,
          },
          media_gallery_entries: [
            {
              file: null,
            },
          ],
          tier_prices: null,
          price: {
            regularPrice: {
              amount: {
                value: item.price,
                currency: item.order_currency_code,
              },
            },
          },
          categories: [
            {
              id: null,
            },
          ],
          categoryIds: [],
          productIds: [],
          pos_sync_create_at: Date.parse(item.created_at),
          pos_sync_updated_at: Date.parse(item.updated_at),
          stock: {
            sku: item.sku,
            stock: [],
            created_at: Date.parse(item.created_at),
            id: null,
          },
          variants: [],
          pos_qty: item.qty_invoiced,
          pos_refunded: item.qty_refunded,
          pos_totalPrice: item.price,
          pos_totalPriceFormat: `$${item.price}`,
        })),
        customer: null,
        isGuestCustomer: true,
        comments: order.status_histories ?? [],
      },
      orderPreparingCheckoutResult: {
        currency_id: "",
        email: order.customer_email,
        posSystemConfigResult: {
          payment_for_pos: {
            default_payment_method:
              order.extension_attributes.shipping_assignments[0].shipping
                .method,
            applicable_payments: "0",
          },
          shipping_method: {
            default_shipping_method:
              order.extension_attributes.shipping_assignments[0].shipping
                .method,
            applicable_shipping_methods: "0",
            mark_as_shipped_by_default: "0",
          },
          stripe_settings: {
            api_key: null,
          },
          authorize_settings: {
            Login_id: null,
            transaction_key: null,
          },
          time_synchronized_for_modules: {
            all_products: "5",
            all_custom_product: "5",
            all_customers_sync: "5",
            general_config_sync: "5",
            barcode_index_config_sync: "15",
          },
        },
        detailOutletResult: {},
        shipping_address: {
          ...order.extension_attributes.shipping_assignments[0].shipping
            .address,
          shipping_method: {
            default_shipping_method:
              order.extension_attributes.shipping_assignments[0].shipping
                .method,
            applicable_shipping_methods: "0",
            mark_as_shipped_by_default: "0",
          },
          method: {
            default_payment_method:
              order.payment.additional_information[0] ?? "",
            applicable_payments: "0",
          },
        },
        totals: {
          base_discount_amount: order.discount_amount,
          init_discount_amount: 0,
          base_subtotal: order.subtotal,
          grand_total: order.grand_total,
          tax_amount: order.tax_amount,
          base_shipping_amount: order.shipping_amount,
          discount_code: "",
          listGiftCard_code: [],
          amount_discount_code: 0,
        },
      },
      syncData: {
        cartId: null,
        orderId: +order.increment_id,
        invoiceId: null,
        shipmentId: null,
      },
    },
    local: false,
    created_at: Date.parse(order.created_at),
    orderId: +order.increment_id,
    status: order.status,
    synced: true,
    message: "",
    update_at: Date.parse(order.updated_at),
  };
  return defaultDataOrderLocal;
}
