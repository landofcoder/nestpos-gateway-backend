import { Injectable } from "@nestjs/common";
import { CheckoutInterface } from "../interface/checkout-interface";
import fetch from "node-fetch";
import {
  REFUND_ACTION_ORDER,
  SHIPMENT_ACTION_ORDER,
  CANCEL_ACTION_ORDER,
  ADD_NOTE_ACTION_ORDER,
} from "../../constant";
import { bindingOrderData } from "../common/magento2BindingData";
const FormData = require("form-data");

@Injectable()
export class Magento2CheckoutService implements CheckoutInterface {
  /**
   * Get discount cart
   * @param payload
   */
  async getDiscountCart(payload: {
    params: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    // Step 1: Create cart for customer or guest cart
    const cartResult = await this.createCartCheckout(payload);
    const result = { coupon: "", cartTotals: {}, cartId: null };
    // @ts-ignore
    if (cartResult && cartResult.length > 0 && cartResult[0].cartId) {
      // @ts-ignore
      const cartId = cartResult[0].cartId;
      result.cartId = cartId;
      const paramsObj = JSON.parse(payload.params);
      const discountCode = paramsObj.discountCode;
      const listGiftCard = paramsObj.listGiftCard;
      const customerId = parseInt(paramsObj.customerId);
      let applyStatus = null;

      // Step 2: Apply coupon If have already discountCode
      if (discountCode && customerId > 0) {
        applyStatus = await this.applyCouponCode({
          cartId,
          discountCode,
          headers: payload.headers,
        });
      }
      if (applyStatus === "true" || applyStatus === true) {
        // Step 3: Get list coupon code to return
        result.coupon = await this.getCouponCodes({
          cartId,
          headers: payload.headers,
        });
      }

      // Step 4: Apply gift card
      if (listGiftCard && listGiftCard.length > 0) {
        await this.applyGiftCard({
          headers: payload.headers,
          cartId,
          listGiftCard,
        });
      }

      // Last step: Get cart total by cartId
      result.cartTotals = await this.getCartTotals({
        cartId,
        headers: payload.headers,
      });
    }

    return JSON.stringify(result);
  }

  /**
   * Create cart checkout
   * @param payload
   */
  async createCartCheckout(payload: {
    params: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    try {
      const form = new FormData();
      form.append("params", payload.params);
      const response = await fetch(
        `${payload.headers.url}/rest/V1/pos/create-quote-checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${payload.headers.token}`,
          },
          redirect: "follow",
          body: form,
        }
      );
      return await response.json();
    } catch (err) {
      return "error";
    }
  }

  /**
   * Apply coupon code
   * @param payload
   * payload: cartId: cartId created before
   * payload: couponCode: coupon code
   */
  async applyCouponCode(payload: {
    cartId: string;
    discountCode: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    try {
      const response = await fetch(
        `${payload.headers.url}/rest/V1/carts/${payload.cartId}/coupons/${payload.discountCode}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${payload.headers.token}`,
          },
        }
      );
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  /**
   * Apply gift card
   * @param payload
   * payload: cartId: cartId created before
   * payload: couponCode: coupon code
   */
  async applyGiftCard(payload: {
    headers: { platform: string; token: string; url: string };
    cartId: any;
    listGiftCard: any;
  }) {
    try {
      // Tham số gift_cards nhận là mảng nhưng khi apply 1 mảng có code dùng được không ở vị trí đầu tiên thì ko dùng dc
      for (const item of payload.listGiftCard) {
        await fetch(
          `${payload.headers.url}/rest/V1/carts/${payload.cartId}/giftCards`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${payload.headers.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              giftCardAccountData: {
                gift_cards: [item],
              },
            }),
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async createInvoiceService(payload: {
    params: { orderId: string };
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { orderId } = payload.params;
    const { token, url } = payload.headers;
    let data;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/order/${orderId}/invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            capture: true,
            notify: true,
          }),
        }
      );
      data = await response.json();
      if (data.message) {
        throw { message: data.message };
      }
      return data;
    } catch (e) {
      throw { message: e.message || "Server magento cannot response " };
    }
  }
  /**
   *
   * @param payload
   * payload: cartId: cartId created before
   * payload: couponCode: coupon code
   */
  async getCouponCodes(payload: {
    cartId: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    try {
      const response = await fetch(
        `${payload.headers.url}/rest/V1/carts/${payload.cartId}/coupons`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${payload.headers.token}`,
          },
        }
      );
      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async createShipmentService(payload: {
    params: { orderId: string };
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { url, token } = payload.headers;
    const { orderId } = payload.params;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/order/${orderId}/ship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      if (data.message) {
        throw { message: data.message };
      }
      return data;
    } catch (e) {
      throw { message: e.message };
    }
  }

  async addPaymentMethod(payload: {
    headers: { platform: string; token: string; url: string };
    params: { payloadCart: any };
  }): Promise<string> {
    const { payloadCart } = payload.params;
    const { headers } = payload;
    const { paymentMethod, cashierInfo, customerToken } = payloadCart;
    const { url } = headers;
    const method = "POST";
    const token = customerToken;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/carts/mine/payment-information`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            paymentMethod: { method: paymentMethod },
            payloadCart: payloadCart,
            app: "LOF_POS",
            cashier_name: cashierInfo.first_name,
            cashier_email: cashierInfo.email,
            cashier_phone: cashierInfo.phone,
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        throw { message: data.message };
      }
      return data;
    } catch (e) {
      throw { message: e.message || "Server magento not response" };
    }
  }

  /**
   * Get cart total
   * @param payload
   * payload: cartId: cartId created before
   * payload: couponCode: coupon code
   */
  async getCartTotals(payload: {
    cartId: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    try {
      const response = await fetch(
        `${payload.headers.url}/rest/V1/carts/${payload.cartId}/totals`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${payload.headers.token}`,
          },
        }
      );
      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async addPaymentInfo(payload: {
    params: { cartId: string; defaultPaymentMethod: any; cashierInfo: any };
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { cartId } = payload.params;
    const { token, url } = payload.headers;
    const { defaultPaymentMethod, cashierInfo } = payload.params;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/guest-carts/${cartId}/order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            paymentMethod: { method: defaultPaymentMethod },
            app: "LOF_POS",
            cashier_name: cashierInfo.first_name,
            cashier_email: cashierInfo.email,
            cashier_phone: cashierInfo.phone,
          }),
        }
      );
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  async createInvoicepayload(payload: {
    params: { orderId: string };
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { orderId } = payload.params;
    const { token, url } = payload.headers;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/order/${orderId}/invoice`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            capture: true,
            notify: true,
          }),
        }
      );
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  async getCustomerCartTokenService(payload: {
    params: any;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { customerId } = payload.params.payloadCart;
    const { token, url } = payload.headers;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/pos/${customerId}/customer/token`,
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
        }
      );
      const data = await response.json(); // parses JSON response into native JavaScript objects
      return data;
    } catch (err) {
      return null;
    }
  }

  async addShippingInfor(payload: {
    params: any;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const { token, url } = payload.headers;
    const { payloadCart } = payload.params;
    const {
      customerToken,
      defaultGuestCheckout,
      cashierInfo,
      detailOutlet,
    } = payloadCart;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/carts/mine/shipping-information`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customerToken}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            addressInformation: {
              shipping_address: {
                region: cashierInfo.city,
                region_id: 1,
                region_code: 1,
                country_id: defaultGuestCheckout.country_id,
                street: [defaultGuestCheckout.street],
                postcode: defaultGuestCheckout.post_code,
                city: defaultGuestCheckout.city,
                firstname: defaultGuestCheckout.first_name,
                lastname: defaultGuestCheckout.last_name,
                email: defaultGuestCheckout.email,
                telephone: defaultGuestCheckout.telephone,
              },
              billing_address: {
                region: detailOutlet.city,
                region_id: 1,
                region_code: 1,
                country_id: "US",
                street: [detailOutlet.street],
                postcode: detailOutlet.post_code,
                city: detailOutlet.city,
                firstname: detailOutlet.firstname,
                lastname: detailOutlet.lastname,
                email: detailOutlet.email,
                telephone: detailOutlet.telephone,
              },
              shipping_carrier_code: "tablerate",
              shipping_method_code: "bestway",
            },
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        throw { message: data.message };
      }
      return data;
    } catch (e) {
      throw { message: e.message };
    }
  }

  /**
   * return data and status to determine sync status
   * @param payload
   */
  async syncUpOrder(payload: {
    params: string;
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    let result = {
      status: false,
      data: { cartId: null, orderId: null, invoiceId: null, shipmentId: null },
      message: null,
    };
    try {
      const { params, headers } = payload;
      let dataCheckout = JSON.parse(JSON.stringify(params));
      let customerId;

      const {
        cartCurrentResult,
        orderPreparingCheckoutResult,
      } = dataCheckout.items;

      if (cartCurrentResult.isGuestCustomer) {
        customerId =
          orderPreparingCheckoutResult.posSystemConfigResult
            .default_guest_checkout.customer_id;
      } else {
        customerId = cartCurrentResult.customer.id;
      }

      if (!cartCurrentResult.cartId) {
        // interval to create cartId to go sync order again
        const discountCode = "";
        const cart = cartCurrentResult.data;

        const params = JSON.stringify({
          cart,
          customerId,
          discountCode,
        });
        const responseCreateCartId = await this.getDiscountCart({
          headers,
          params,
        });
        const cartIdResult = JSON.parse(responseCreateCartId);
        if (Number.parseInt(cartIdResult.cartId)) {
          // nhan duoc cartId
          cartCurrentResult.cartId = cartIdResult.cartId;
        }
      }

      if (cartCurrentResult.cartId) {
        result.data.cartId = cartCurrentResult.cartId;
        // already create CartId
        // create an order
        const payloadParams = {
          params: {
            payloadCart: {
              cartIdResult: cartCurrentResult.cartId,
              customerToken: cartCurrentResult.customerToken,
              customerId,
              shippingMethod:
                orderPreparingCheckoutResult.shipping_address.shipping_method,
              paymentMethod:
                orderPreparingCheckoutResult.shipping_address.method
                  .default_payment_method,
              posSystemConfigCustomer:
                orderPreparingCheckoutResult.posSystemConfigResult
                  .general_configuration,
              cashierInfo: orderPreparingCheckoutResult.shipping_address,
              defaultGuestCheckout:
                orderPreparingCheckoutResult.posSystemConfigResult
                  .default_guest_checkout,
              detailOutlet: orderPreparingCheckoutResult.detailOutletResult,
            },
            orderId: null,
          },
          headers,
        };
        // step 1 get customer token
        const customerToken = await this.getCustomerCartTokenService(
          payloadParams
        );
        payloadParams.params.payloadCart.customerToken = customerToken;
        // step 2 add shipping information
        const addShippingResult = await this.addShippingInfor(payloadParams);
        // Step 3 : add paymentMethod return orderID or not
        let orderId = await this.addPaymentMethod(payloadParams);
        // Step 4: create an invoice
        payloadParams.params.orderId = orderId;
        let invoiceId = await this.createInvoiceService(payloadParams);
        // Step 5: Create shipment
        let shipmentId = await this.createShipmentService(payloadParams);
        // Step 6: Check all api work correct or not
        orderId = JSON.parse(orderId);
        invoiceId = JSON.parse(invoiceId);
        shipmentId = JSON.parse(shipmentId);
        if (
          Number.parseInt(orderId) +
          Number.parseInt(invoiceId) +
          Number.parseInt(shipmentId)
        ) {
          result.status = true;
          result.data.orderId = orderId;
          result.data.invoiceId = invoiceId;
          result.data.shipmentId = shipmentId;
        } else if (!Number.parseInt(orderId)) {
          result.data.orderId = orderId;
        } else if (!Number.parseInt(invoiceId)) {
          result.data.invoiceId = invoiceId;
        } else if (!Number.parseInt(shipmentId)) {
          result.data.shipmentId = shipmentId;
        }
      }
    } catch (e) {
      result.message = e.message;
      result.status = false;
    }
    return JSON.stringify({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  }

  /**
   * return data and status to determine sync status
   * @param payload
   */
  async syncDownOrder(payload: {
    params: { orderId: string };
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const payloadParams = {
      headers: payload.headers,
      params: payload.params,
    };
    const orderDetail = await this.getDetailOrderHistory(payloadParams);
    const orderBindingReturn = bindingOrderData(orderDetail);
    return JSON.stringify(orderBindingReturn);
  }

  async getRewardPointInfo(payload: {
    headers: { platform: string; token: string; url: string };
    params: { customerId: string };
  }) {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let rewardPoint;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/lof-rewardpoints/customer/${payload.params.customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );
      rewardPoint = await response.json();
    } catch (e) {
      throw { message: e.message };
    }
    const totalPoints =
      rewardPoint && rewardPoint.length > 0 ? rewardPoint[0].total_points : 0;

    // Get all rules reward points
    let listRules = [];
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/lof-rewardpoints/getlistspending?searchCriteria`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );
      listRules = await response.json();
    } catch (e) {
      throw { message: e.message };
    }

    return {
      total_points: totalPoints,
      list_rules: listRules,
    };
  }

  /**
   * Get order history service
   * @returns void
   */
  async getListOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
  }): Promise<string> {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let data = {};
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/pos/order_history/search?searchCriteria[sortOrders][0][field]=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );
      data = await response.json();
    } catch (e) {
      data = { items: [] };
    }
    return JSON.stringify(data);
  }

  /**
   * Call detail order history
   * @param payload
   */
  async getDetailOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
    params: { orderId: string };
  }): Promise<string> {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let data;
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/orders/${payload.params.orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );
      data = await response.json();
      if (data.message || data.errors || data.error) {
        throw { message: data.message };
      }
      return data;
    } catch (e) {
      throw { message: e.message };
    }
  }

  async setRefundItemsOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
    params: { orderId: string; items };
  }): Promise<string> {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let data, dataReturn;
    dataReturn = { status: false, message: "", data: {} };
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/order/${payload.params.orderId}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: payload.params.items,
            notify: true,
          }),
          redirect: "follow",
        }
      );
      data = await response.json();
      if (data.message || data.errors) {
        throw { message: data.message };
      }
      dataReturn.status = true;
      dataReturn.data.refundedId = data;
    } catch (e) {
      dataReturn.message = e.message || e;
    }
    return dataReturn;
  }

  async setShipItemsOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
    params: { orderId: string; items };
  }): Promise<string> {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let data, dataReturn;
    dataReturn = { status: false, message: "", data: {} };
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/orders/${payload.params.orderId}/ship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: payload.params.items,
            notify: true,
          }),
          redirect: "follow",
        }
      );
      data = await response.json();
      if (data.message || data.errors) {
        throw { message: data.message };
      }
      dataReturn.status = true;
      dataReturn.data.refundedId = data;
    } catch (e) {
      dataReturn.message = e.message || e;
    }
    return dataReturn;
  }

  async setCancelOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
    params: { orderId: string };
  }): Promise<string> {
    const url = payload.headers.url;
    const token = payload.headers.token;
    let data, dataReturn;
    dataReturn = { status: false, message: "", data: {} };
    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/orders/${payload.params.orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
          redirect: "follow",
        }
      );
      data = await response.json();
      if (data.message || data.errors) {
        throw { message: data.message };
      }
      dataReturn.status = true;
      dataReturn.data.refundedId = data;
    } catch (e) {
      dataReturn.message = e.message || e;
    }
    return dataReturn;
  }

  async setNoteOrderHistory(payload: {
    headers: { platform: string; token: string; url: string };
    params: { orderId: string; note: String };
  }): Promise<string> {
    const params = {
      statusHistory: {
        comment: payload.params.note,
        created_at: new Date(),
      },
    };

    const url = payload.headers.url;
    const token = payload.headers.token;
    let data, dataReturn;
    dataReturn = { status: false, message: "", data: {} };

    try {
      const response = await fetch(
        `${url}/index.php/rest/V1/orders/${payload.params.orderId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(params),
          redirect: "follow",
        }
      );
      data = await response.json();
      if (data.message || data.errors) {
        throw { message: data.message };
      }
      dataReturn.status = true;
      dataReturn.data.refundedId = data;
    } catch (e) {
      dataReturn.message = e.message || e;
    }
    return dataReturn;
  }

  async getActionOrder(payload: {
    headers: { platform: string; token: string; url: string };
    data: any;
    type: string;
  }): Promise<string> {
    console.log(payload.data);
    const { orderId } = payload.data;
    const payloadOrderID = { headers: payload.headers, params: { orderId } };

    switch (payload.type) {
      case REFUND_ACTION_ORDER:
      case SHIPMENT_ACTION_ORDER:
        return this.getDetailOrderHistory(payloadOrderID);
      default:
        return null;
    }
  }

  async setActionOrder(payload: {
    headers: { platform: string; token: string; url: string };
    data: any;
    type: string;
  }): Promise<string> {
    const { orderId, items } = payload.data;
    let data;
    switch (payload.type) {
      case REFUND_ACTION_ORDER:
        const payloadRefund = {
          headers: payload.headers,
          params: { orderId, items },
        };
        data = this.setRefundItemsOrderHistory(payloadRefund);
        return data;
      case SHIPMENT_ACTION_ORDER:
        const payloadShipment = {
          headers: payload.headers,
          params: { orderId, items },
        };
        data = this.setShipItemsOrderHistory(payloadShipment);
        return data;
      case CANCEL_ACTION_ORDER:
        const payloadCancel = {
          headers: payload.headers,
          params: { orderId },
        };
        data = this.setCancelOrderHistory(payloadCancel);
        return data;
      case ADD_NOTE_ACTION_ORDER:
        const payloadAddNote = {
          headers: payload.headers,
          params: { orderId, note: payload.data.payload },
        };
        data = this.setNoteOrderHistory(payloadAddNote);
        return data;
      default:
        return null;
    }
  }
}
