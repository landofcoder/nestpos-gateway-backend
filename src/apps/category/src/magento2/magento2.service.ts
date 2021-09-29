import {Injectable} from '@nestjs/common';
import {CategoryInterface} from "../interface/icategory";
import fetch from "node-fetch";

@Injectable()
export class Magento2Service implements CategoryInterface {

    allCategories = {
        main: {},
        raw: []
    };

    /**
     * Get all categories
     * @param payload
     */
    async getAllCategories(payload: { token: string; url: string }): Promise<string> {
        try {
            const response = await fetch(`${payload.url}/rest/V1/categories`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${payload.token}`
                    },
                    redirect: "follow"
                }
            );
            const data = await response.json();
            this.allCategories.main = data;
            await this.serializationCategories(data);
        } catch (e) {
            console.log(e);
        }
        return JSON.stringify(this.allCategories);
    }

    /**
     * Serialization categories to 1 level
     * @param categories
     */
    async serializationCategories(categories) {
        const childrendData = categories.children_data;
        if(childrendData && childrendData.length > 0) {
            childrendData.forEach(item => {
                const itemAssign = Object.assign({}, item);
                // Remove children data before push to main all categories
                itemAssign.children_data = 'child';
                this.allCategories.raw.push(item);
                this.serializationCategories(item);
            });
        }
    }
}
