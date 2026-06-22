const { z } = require('zod');

const email = z.string().trim().toLowerCase().email('Invalid email format');
const password = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long');
const nonEmpty = (label) => z.string().trim().min(1, `${label} is required`);

const registerUserSchema = z.object({
    body: z.object({
        firstName: nonEmpty('First name'),
        lastName: nonEmpty('Last name'),
        email,
        phone: nonEmpty('Phone'),
        address: nonEmpty('Address'),
        password,
    }),
});

const registerPartnerSchema = z.object({
    body: z.object({
        businessName: nonEmpty('Business name'),
        contactName: nonEmpty('Contact name'),
        phone: nonEmpty('Phone'),
        email,
        address: nonEmpty('Address'),
        city: nonEmpty('City'),
        password,
    }),
});

const loginSchema = z.object({
    body: z.object({
        email,
        password: z.string().min(1, 'Password is required'),
    }),
});

module.exports = { registerUserSchema, registerPartnerSchema, loginSchema };
