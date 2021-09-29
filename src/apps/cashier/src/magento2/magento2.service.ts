import {Injectable} from "@nestjs/common";
import {ServiceInterface} from "../interface/interface.usersInterface";
import {LoginCashierResolver} from "./login/login.resolver";
import fetch from "node-fetch";

@Injectable()
export class Magento2Service implements ServiceInterface {
    constructor(private readonly loginCashierResolver: LoginCashierResolver) {
    }

    /**
     * Get all app installed
     * @param payload
     */
    async loginCashierService(payload: {
        username: string;
        password: string;
        url: string;
    }): Promise<{ status: boolean; listMessage: Array<any>; data: string }> {
        const payloadLogin = {
            url: payload.url,
            username: payload.username,
            password: payload.password,
        };

        const resultLogin = await this.loginCashierResolver.loginService(
            payloadLogin
        );

        if (resultLogin.status === false) {
            return {
                status: false,
                listMessage: [{
                    mess: "Username or password not found"
                }],
                data: "",
            };
        }

        const token = resultLogin.token;
        return await this.loginCashierResolver.getAllAppInstalledService({
            url: payload.url,
            token,
        });
    }

    async shopInfoService(payload: {
        token: string;
        url: string;
        platform: string;
    }): Promise<object> {
        const {token, url} = payload;
        try {
            const response = await fetch(url + "/index.php/rest/V1/pos/getShopInfo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                redirect: "follow",
            });
            const data = await response.json();
            const currencyCode = data[0];

            // Get cashier info
            const cashierInfo = await this.cashierInfoService({
                token: token,
                url: url,
            });
            const outletId = cashierInfo.outlet_id;

            // Get detail outlet by outletId
            const detailOutletResult = await this.getDetailOutlet({
                outletId,
                url,
                token,
            });
            const detailOutlet = detailOutletResult[0].data;

            // Get custom receipt by outletId
            const receiptResult = await this.getReceipt(
                {platform: payload.platform, token, url},
                {outletId}
            );
            const receiptByOutlet = receiptResult[0];

            const systemConfigResult = await this.systemConfigService({token, url});
            const systemConfig = systemConfigResult[0];

            return {
                currency_code: currencyCode,
                cashier_info: cashierInfo,
                detail_outlet: detailOutlet,
                receipt: receiptByOutlet,
                common_config: systemConfig,
            };
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    async cashierInfoService(payload: {
        token: string;
        url: string;
    }): Promise<any> {
        const {token, url} = payload;
        try {
            const response = await fetch(url + "/index.php/rest/V1/lof-cashier", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                redirect: "follow",
            });
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    }

    async getDetailOutlet(payload: {
        outletId: string;
        url: string;
        token: string;
    }): Promise<any> {
        const {outletId, url, token} = payload;
        try {
            const response = await fetch(
                url + `/index.php/rest/V1/lof-outlet/get-detail-outlet?id=${outletId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    redirect: "follow",
                }
            );
            return await response.json();
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    async systemConfigService(payload: {
        token: string;
        url: string;
    }): Promise<string> {
        const {token, url} = payload;
        console.log("systemConfigService");
        try {
            const response = await fetch(
                url + `/index.php/rest/V1/pos/getSystemConfig`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    redirect: "follow",
                }
            );
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    async getReceipt(
        headers: { platform: string; token: string; url: string },
        payload: { outletId: number }
    ): Promise<any> {
        const {token, url} = headers;
        try {
            const response = await fetch(
                `${url}/rest/V1/lof-posreceipt/pos/${payload.outletId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    redirect: "follow",
                }
            );
            return await response.json();
        } catch (err) {
            console.log(err);
        }
        return null;
    }
}
