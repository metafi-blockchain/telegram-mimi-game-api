
import {IsEmail, IsString} from 'class-validator'

export class ActivityLogDto{
    
    methods: string

    account: string

    ipAddress: string

    path: string

    data?: string;

}