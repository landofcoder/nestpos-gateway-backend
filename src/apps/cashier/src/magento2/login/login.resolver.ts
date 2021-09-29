import {Injectable} from "@nestjs/common";
import fetch from "node-fetch";

@Injectable()
export class LoginCashierResolver {

    /**
     * Get all app installed
     * @param payload
     */
    async getAllAppInstalledAPI(payload: { url: string, token: string }): Promise<any> {
        try {
            const response = await fetch(`${payload.url}/index.php/rest/V1/pos/check-all-module-installed`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${payload.token}`
                    },
                    redirect: "follow"
                }
            );
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    /**
     * Login service
     * @param payload
     */
    async loginService(payload: {
        username: string;
        password: string;
        url: string;
    }): Promise<{ token: string; status: boolean }> {
        const {username, password, url} = payload;
        let token, message;
        try {
            const response = await fetch(
                url + "/index.php/rest/V1/integration/admin/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    redirect: "follow",
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );
            const data = await response.json();
            if (data) {
                return {
                    token: data,
                    status: true
                };
            }
        } catch (err) {
            console.log(err);
        }
        return {
            token: '',
            status: false
        };
    }

    /***
     * Get all app installed service
     * @param payload
     */
    async getAllAppInstalledService(payload: {
        url: string,
        token: string
    }): Promise<{ status: boolean; listMessage: Array<any>, data: string }> {
        let status = false;
        let message;
        const resultInstalled = await this.getAllAppInstalledAPI(payload);
        let listMessage = [];
        if (resultInstalled && resultInstalled.length > 0) {
            const listModuleStatus = resultInstalled[0];
            const result = await this.convertCodeToName(listModuleStatus);
            status = result.status;
            listMessage = result.listMessages.slice();
        } else {
            message = 'Cannot connect pos server site';
            listMessage.push({mess: message, status: false});
        }
        return {
            status,
            listMessage,
            data: payload.token
        };
    }

    async convertCodeToName(listModuleStatus: Array<{ name: string, status: boolean }>): Promise<any> {
        const lisAssign = [];
        // Status for POS client check, if true is success, else show all message errors
        let status = true;
        listModuleStatus.map(item => {
            const itemReassign = Object.assign(item);
            const moduleName = item.name;
            const moduleStatus = item.status;
            // status = true if any module status = false
            if(!item.status) {
                status = false;
            }
            switch (moduleName) {
                case 'Lof_All':
                    if(moduleStatus) {
                        itemReassign.mess = 'Installed module Lof_All';
                    } else {
                        itemReassign.mess = 'Please install Lof_All module. Please visit https://github.com/landofcoder/module-all to downloading';
                    }
                    break;
                case 'Lof_Cashier':
                    itemReassign.mess = 'Installed module Lof_Cashier';
                    break;
                case 'Lof_Outlet':
                    itemReassign.mess = 'Installed module Lof_Outlet';
                    break;
                case 'Lof_PosReceipt':
                    itemReassign.mess = 'Installed module Lof_PosReceipt';
                    break;
                case 'Lof_BarcodeInventory':
                    itemReassign.mess = 'Installed module Lof_BarcodeInventory';
                    break;
                case 'Link_Admin_Cashier':
                    itemReassign.mess = 'Linked admin to a cashier';
                    break;
                case 'Cashier_Not_Enable':
                    itemReassign.mess = 'Enabled cashier';
                    break;
                default:
                    itemReassign.mess = 'Some modules missing, please contact technical for support.';
                    break;
            }
            lisAssign.push(itemReassign);
        });
        return {
            status,
            listMessages: lisAssign
        };
    }
}
