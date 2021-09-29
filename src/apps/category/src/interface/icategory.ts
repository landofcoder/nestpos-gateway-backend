export interface CategoryInterface {
    getAllCategories(payload: { token: string; url: string }): Promise<string>;
}