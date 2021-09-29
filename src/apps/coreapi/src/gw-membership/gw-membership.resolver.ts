import {Resolver, Query, Args, Mutation} from '@nestjs/graphql';
import {GwMembershipService} from "./gw-membership.service";
import {GwMembership} from "../entities/gw-membership.entity";
import {GwUsers} from "../entities/gw-users.entity";

@Resolver('GwMembership')
export class GwMembershipResolver {
    constructor(private readonly gwMembershipService: GwMembershipService) {
    }

    /**
     * Get app by _id
     * @param _id
     */
    @Query(() => GwMembership)
    async getMembership(@Args('_id') _id: string): Promise<GwMembership> {
       try {
           return this.gwMembershipService.getMembership(_id);
       } catch (e) {
           console.log('error:', e);
       }
    }

    /**
     * Get all app by is_featured
     * @param is_featured
     */
    @Query(() => [GwMembership])
    async getAllMembership(@Args('is_featured') is_featured: string) {
        return this.gwMembershipService.getAllMembership(is_featured);
    }
}
