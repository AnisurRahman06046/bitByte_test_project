import { SetMetadata } from '@nestjs/common';

import { UserRoles } from 'src/users/constants/user.constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
