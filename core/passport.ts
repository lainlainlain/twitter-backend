import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

passport.use(
  new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec();

      if (!user) {
        return done(null, false);
      }

      if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

export { passport };
