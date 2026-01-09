import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from './interfaces/auth-tokens.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject('MONGO_DB') private db: Db,
        private jwt: JwtService,
    ) { }

    private users() {
        return this.db.collection('users');
    }

    private async signTokens(
        userId: string,
        email: string,
    ): Promise<AuthTokens> {
        const accessToken = this.jwt.sign(
            { sub: userId, email },
            { expiresIn: '15m' },
        );

        const refreshToken = this.jwt.sign(
            { sub: userId },
            { expiresIn: '7d' },
        );

        return { accessToken, refreshToken };
    }

    async signup(email: string, password: string) {
        const exists = await this.users().findOne({ email });

        if (exists) {
            throw new ConflictException(
                'Account already exists. Please log in instead.',
            );
        }

        const hash = await bcrypt.hash(password, 10);

        await this.users().insertOne({
            email,
            password: hash,
        });

        return { message: 'User created' };
    }


    async login(email: string, password: string) {
        const user = await this.users().findOne({ email });

        if (!user) {
            throw new NotFoundException(
                'Account not found. Please sign up first.',
            );
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.signTokens(
            user._id.toString(),
            email,
        );

        await this.users().updateOne(
            { _id: user._id },
            { $set: { refreshToken: tokens.refreshToken } },
        );

        return tokens;
    }
    async refresh(refreshToken: string): Promise<AuthTokens> {
        const payload = this.jwt.verify(refreshToken);

        const user = await this.users().findOne({
            _id: new ObjectId(payload.sub),
            refreshToken,
        });

        if (!user) throw new UnauthorizedException();

        const tokens = await this.signTokens(
            user._id.toString(),
            user.email,
        );

        await this.users().updateOne(
            { _id: user._id },
            { $set: { refreshToken: tokens.refreshToken } },
        );

        return tokens;
    }
}
