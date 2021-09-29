export interface CheckoutInterface {
    getDiscountCart(payload: {
        params: string;
        headers: { platform: string; token: string; url: string };
    });

    applyCouponCode(payload: {
        cartId: string;
        headers: { platform: string; token: string; url: string };
    });

    syncUpOrder(payload: {
        params: string;
        headers: { platform: string; token: string; url: string };
    });

    syncDownOrder(payload: {
        params: { orderId : string};
        headers: { platform: string; token: string; url: string };
    });

    getRewardPointInfo(payload: {headers: { platform: string; token: string; url: string }, params: {customerId: string}});

    getListOrderHistory(payload: {
        headers: { platform: string; token: string; url: string };
    })

    getActionOrder(payload: {
        headers: { platform: string; token: string; url: string };
        type: string;
        data: any;
    });

    setActionOrder(payload: {
        headers: { platform: string; token: string; url: string };
        data: any;
        type: string;
    });
}
