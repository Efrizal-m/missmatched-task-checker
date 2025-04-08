import dotenv from 'dotenv';

dotenv.config({ path: `./${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}.env` });

export const config = {
	port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || "https://dev.sitesched.com",
    credentials: {
        email: process.env.EMAIL || "",
        password: process.env.PASSWORD || "",
    },
    projectId: process.env.PROJECT_ID || "",
    mAuthToken: process.env.MAUTH_TOKEN || "",
    mAuthUser:  process.env.MAUTH_USER || ""
};
