import {Resolver, Query, Args, Mutation} from '@nestjs/graphql';
import {GwAppConnectedService} from "./gw-app-connected.service";
import {GwAppConnected} from "../entities/gw-app-connected.entity";
import {GwUsers} from "../entities/gw-users.entity";

@Resolver('GwAppConnected')
export class GwAppConnectedResolver {
    constructor(private readonly gwAppConnectedService: GwAppConnectedService) {
    }

    /**
     * Get app by token
     * @param token
     */
    @Query(() => GwAppConnected)
    async getApp(@Args('token') token: string): Promise<GwAppConnected> {
       try {
           return this.gwAppConnectedService.findByToken(token);
       } catch (e) {
           console.log('error:', e);
       }
    }

    /**
     * Get all app by userId
     * @param userId
     */
    @Query(() => [GwAppConnected])
    async getAllApp(@Args('userId') userId: string) {
        return this.gwAppConnectedService.findAll(userId);
    }

    @Query(() => String)
    async reportAllApp() {
        return this.gwAppConnectedService.getReportAllApp();
    }

    /**
     * Sign in
     * @param email
     * @param password
     */
    @Query(() => GwUsers)
    async signIn(@Args('email') email: string, @Args('password') password: string) {
        return this.gwAppConnectedService.signIn(email, password);
    }

    /**
     * Sign up
     * @param firstName
     * @param lastName
     * @param email
     * @param password
     */
    @Mutation()
    async signUp(@Args('firstName') firstName: string,
                 @Args('lastName') lastName: string,
                 @Args('email') email: string,
                 @Args('password') password: string) {
        return this.gwAppConnectedService.signUp(firstName, lastName, email, password);
    }

    /**
     * Create new app
     * @param userId
     * @param name
     * @param siteUrl
     * @param imageUrl
     */
    @Mutation()
    async createApp(@Args('userId') userId: string,
                    @Args('name') name: string,
                    @Args('siteUrl') siteUrl: string,
                    @Args('imageUrl') imageUrl: string) {
        return this.gwAppConnectedService.createApp(userId, name, siteUrl, imageUrl);
    }

    /**
     * Create new app
     * @param appId
     * @param name
     * @param siteUrl
     * @param imageUrl
     */
    @Mutation()
    async updateApp(@Args('appId') appId: string,
                    @Args('name') name: string,
                    @Args('siteUrl') siteUrl: string,
                    @Args('imageUrl') imageUrl: string) {
        return this.gwAppConnectedService.updateApp(appId, name, siteUrl, imageUrl);
    }
}
