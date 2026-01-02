import { Company } from "./admin/Company.model.js";
import { Role } from "./admin/Role.model.js";
import { Users } from "./admin/Users.model.js";
import { Hero } from "./design/Hero.model.js";
import { Category } from "./products/Category.model.js";

const adminNavigation = {
    name: 'Admin',
    icon: 'User',
}

const productsNavigation = {
    name: 'Products',
    icon: 'Shopping',
}

const designNavigation = {
    name: 'Design',
    icon: 'File',
}

export const AppResources = [
    {
        resource: Hero,
        options: {
            navigation: designNavigation,
        },
    },
    {
        resource: Category,
        options: {
            navigation: productsNavigation,
        },
    },
    {
        resource: Role,
        options: {
            navigation: adminNavigation,
        },
    },
    {
        resource: Users,
        options: {
            navigation: adminNavigation,
        },
    },
    {
        resource: Company,
        options: {
            navigation: adminNavigation,
        },
    },
]