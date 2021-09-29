export interface CustomerInterface {
    searchCustomerByName(
        headers: { platform: string; token: string; url: string },
        payload: { searchValue: string });

    searchCustomer(
        headers: { platform: string; token: string; url: string },
        payload: { searchValue: string });

    createCustomer(
        headers: { platform: string; token: string; url: string },
        payload: { firstName: string, lastName: string, email: string, password: string }
    );
}