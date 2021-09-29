import { Injectable } from "@nestjs/common";
import { CustomerInterface } from "../customer-interface";
import fetch from "node-fetch";

@Injectable()
export class Magento2CustomerService implements CustomerInterface {
  /**
   * Create customer
   * @param headers
   * @param payload
   */
  async createCustomer(
    headers: { platform: string; token: string; url: string },
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) {
    let data;
    try {
      const response = await fetch(`${headers.url}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation {
                            createCustomer(
                              input: {
                                firstname: "${payload.firstName}"
                                lastname: "${payload.lastName}"
                                email: "${payload.email}"
                                password: "${payload.password}"
                                is_subscribed: true
                              }
                            ) {
                              customer {
                                id
                                firstname
                                lastname
                                email
                                is_subscribed
                              }
                            }
                          }`,
        }),
      });
      data = await response.json();
      if (data.message || data.errors) {
        throw {
          message: data.message || data.errors[0].debugMessage,
          data: data.errors,
        };
      }
      return data;
    } catch (e) {
      return { message: e.message || "Server not response ", data: e.data };
    }
  }

  /**
   * Search customer by name
   * @param headers
   * @param payload
   */
  async searchCustomerByName(
    headers: { platform: string; token: string; url: string },
    payload: { searchValue: string }
  ): Promise<string> {
    const searchValue = payload.searchValue;
    try {
      const response = await fetch(
        `${headers.url}/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=firstname&searchCriteria[filter_groups][0][filters][0][value]=${searchValue}&searchCriteria[filter_groups][0][filters][0][condition_type]=like`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${headers.token}`,
          },
          redirect: "follow",
        }
      );
      return await response.json();
    } catch (err) {
      console.log(err);
    }
    return JSON.stringify({ items: [] });
  }

  /**
   * Search customer by value, this will searching by customer-id, or email
   * @param headers
   * @param payload
   */
  async searchCustomer(
    headers: { platform: string; token: string; url: string },
    payload: { searchValue: string }
  ): Promise<string> {
    const searchValue = payload.searchValue;
    try {
      const response = await fetch(
        `${headers.url}/rest/V1/customers/search?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][value]=${searchValue}&searchCriteria[filterGroups][0][filters][0][condition_type]=like&searchCriteria[filterGroups][0][filters][1][field]=email&searchCriteria[filterGroups][0][filters][1][value]=${searchValue}&searchCriteria[filterGroups][0][filters][1][condition_type]=like`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${headers.token}`,
          },
          redirect: "follow",
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
    return JSON.stringify({ items: [] });
  }
}
