import { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/enums";
import prisma from "../config/prisma";
import { ForbiddenError, NotFoundError } from "../utils/errors";

/*
to pass a param to any middleware, we create a function that returns a middleware. 
When Express sees this in your route:
tsrouter.get('/all', requireRole(Role.ADMIN), getAllIdeas)
It immediately calls requireRole(Role.ADMIN) when the route is being defined — not when a request comes in. That call returns the actual middleware function. So Express stores that returned function and runs it when a request hits the route.
Think of it like this:
ts// what you write
router.get('/all', requireRole(Role.ADMIN), getAllIdeas)

// what Express actually sees after requireRole(Role.ADMIN) runs
router.get('/all', async (req, res, next) => { ... }, getAllIdeas)
So yes, requireRole(Role.ADMIN) does run immediately — but it just returns a function, it doesn't execute the middleware logic yet. The middleware logic runs later when a request comes in.
It's like:
ts// factory function - runs at route definition time
const makeAdder = (x) => {
    // this part runs later
    return (y) => x + y
}

const addFive = makeAdder(5)  // runs immediately, returns a function
addFive(3)  // runs later = 8
Same concept — requireRole is a factory that creates middleware with the role baked in.

*/
export const requireRole = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) throw new NotFoundError("User not found");
    if (user.role !== role) throw new ForbiddenError("Access denied")

    next();
  };
};
